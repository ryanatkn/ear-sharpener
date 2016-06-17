import * as I from 'immutable';
import {GameName} from '../../types';

export interface IGameState<TGuess> {
  name: GameName;
  levels: I.Seq.Indexed<number>; // games have a fixed number of levels
  levelCount: number; // each difficulty level has many steps
  stepCounts: I.Map<number, number>; // number of steps per level - key is level, value is stepCount
  level: number; // start counting at 1
  step: number;  // start counting at 1, but allow to go to 0 for the first level (desired ux)
  choices: I.List<TGuess>;
  correctChoice: TGuess;
  lastGuess: TGuess; // each game type defines its own `TGuess` type with this generic param
  wasLastGuessCorrect: boolean;
  presentCount: number; // tslint:disable-line:max-line-length // unfortunately this is not updated by the reducer, not the model, because in Redux we don't have side effects in the reducers or data transformations outside of them!
  guessCount: number;
  guessCountForCurrentCorrectChoice: number;
  shouldRefreshChoices: boolean;
  shouldRefreshCorrectChoice: boolean;
  refreshChoicesCount: number;
  refreshCorrectChoiceCount: number;
}

// Integrating with Immutable.js works well enough, but it isn't pretty.
export type GameState<TGuess> = I.Record.IRecord<IGameState<TGuess>>;

/**
 * The `GameModel` interface specifies functions that each game module must implement.
 * This is how we achieve polymorphism without classes and using Immutable.js records.
 * These functions may get passed around to generic methods to customize behavior for each
 * game while sharing as much code as possible in this base module.
 * I'm not thrilled with this pattern but it's good enough for now.
 */
export interface GameModel<T extends GameState<any>> {
  present(
    game: T,
    shouldAbort: () => boolean // tslint:disable-line:no-unused-variable (TODO bug in tslint)
  ): Promise<number>;
  refreshChoices: RefreshChoices<T>;
  refreshCorrectChoice: RefreshCorrectChoice<T>;
  getPresentDelayAfterGuess(wasCorrect: boolean): number; // tslint:disable-line:no-unused-variable max-line-length (TODO bug in tslint)
}

interface RefreshChoices<T extends GameState<any>> {
  (game: T): T;
}

interface RefreshCorrectChoice<T extends GameState<any>> {
  (game: T): T;
}

/**
 * Sets up the initial state of a game.
 */
export function init<T extends GameState<any>>(
  game: T,
  refreshChoices: RefreshChoices<T>,
  refreshCorrectChoice: RefreshCorrectChoice<T>
): T {
  const finalLevel = game.level || 1;
  const finalStep = game.step || 0;
  const gameWithDefaults = game.withMutations((g: T) => {
    g.set('lastGuess', null);
    g.set('wasLastGuessCorrect', null);
    g.set('presentCount', 0);
    g.set('guessCount', 0);
    g.set('guessCountForCurrentCorrectChoice', 0);
    g.set('refreshChoicesCount', 0);
    g.set('refreshCorrectChoiceCount', 0);
  }) as T;
  return refresh(
    setDifficulty(gameWithDefaults, finalLevel, finalStep),
    refreshChoices,
    refreshCorrectChoice,
    true
  );
}

/**
 * Sets the level and step for a game, setting a flag to refresh the choices as necessary.
 */
export function setDifficulty<T extends GameState<any>>(
  game: T,
  level: number,
  step: number
): T {
  const [nextLevel, nextStep] = clampDifficulty(game.levels, game.stepCounts, level, step);
  let newGame = game
    .set('level', nextLevel)
    .set('step', nextStep) as T;
  // When the level changes, the set of choices needs to be updated.
  if (game.level !== newGame.level) {
    newGame = newGame.set('shouldRefreshChoices', true) as T;
  }
  return newGame;
}

/**
 * Clears the game state of the last guess.
 * Is basically a hack to make the guess feedback animations not appear after
 * the user manually selects the difficulty.
 * See the readme's tech notes for a discussion of how React/Redux make handling
 * this sort of animation behavior difficult.
 */
export function clearLastGuess<T extends GameState<any>>(game: T): T {
  return game.set('lastGuess', null) as T;
}

/**
 * Refreshes the choices and correct choice if they're flagged to be updated.
 * The caller can use `forceRefreshCorrectChoice` to force an update to the correct choice,
 * but otherwise it will only be changed if it is no longer valid.
 * This flag is useful in the case where you want the current correct choice to remain the same
 * when the user falls back a level, so they can keep narrowing in on the correct answer.
 */
export function refresh<T extends GameState<any>>(
  game: T,
  refreshChoices: RefreshChoices<T>,
  refreshCorrectChoice: RefreshCorrectChoice<T>,
  forceRefresh: boolean = true
): T {
  let newGame = game;
  // Update the choices if either of the choice update flags is set.
  if (forceRefresh || newGame.shouldRefreshChoices || newGame.shouldRefreshCorrectChoice) {
    newGame = refreshChoices(newGame)
      .set('shouldRefreshChoices', false)
      .set('refreshChoicesCount', newGame.refreshChoicesCount + 1) as T;
    // Update the correct choice if the flag is set if it's no longer valid.
    if (forceRefresh || newGame.shouldRefreshCorrectChoice || !isCorrectChoiceValid(newGame)) {
      newGame = refreshCorrectChoice(newGame)
        .set('shouldRefreshCorrectChoice', false)
        .set('guessCountForCurrentCorrectChoice', 0)
        .set('refreshCorrectChoiceCount', newGame.refreshCorrectChoiceCount + 1) as T;
    }
  }
  return newGame;
}

/**
 * Indicates whether or not the game's `correctChoice` is valid given its available choices.
 */
function isCorrectChoiceValid<T extends GameState<any>>(game: T): boolean {
  return game.choices.includes(game.correctChoice);
}

/**
 * Makes a guess on the game, updating the game state
 * and advancing or falling back in difficulty as needed.
 */
export function guess<TGuess, T extends GameState<TGuess>>(
  game: T,
  guess: TGuess
): T {
  const isCorrect = game.correctChoice === guess;
  const newGame = game.withMutations((g: T): void => {
    g.set('lastGuess', guess);
    g.set('wasLastGuessCorrect', isCorrect);
    g.set('guessCount', g.guessCount + 1);
    g.set('guessCountForCurrentCorrectChoice', g.guessCountForCurrentCorrectChoice + 1);
    g.set('shouldRefreshCorrectChoice', isCorrect);
  }) as T;
  const nextStep = isCorrect ? (game.step + 1) : (game.step - 1);
  return setDifficulty(
    newGame,
    game.level,
    nextStep
  );
}

/**
 * Represents a valid `[level, step]` for a game.
 */
type GameDifficulty = [number, number];

/**
 * Returns a tuple representing a valid difficulty state,
 * adjusting step and level as necessary.
 * Can be called with a step above or below the valid range
 * to advance or fall back a level.
 */
export function clampDifficulty(
  levels: I.Seq.Indexed<number>,
  stepCounts: I.Map<number, number>,
  level: number,
  step: number
): GameDifficulty {
  const firstLevel = levels.first();
  const lastLevel = levels.last();
  if (level < firstLevel) {
    return [firstLevel, 0];
  } else if (level > lastLevel) {
    return [lastLevel, stepCounts.get(lastLevel)];
  } else if (step > stepCounts.get(level)) {
    return level === lastLevel
      ? [level, stepCounts.get(lastLevel)]
      : [level + 1, 1];
  } else if (step < 1) {
    return level === firstLevel
      ? [level, 0]
      : [level - 1, stepCounts.get(level - 1)];
  } else {
    return [level, step];
  }
}

/**
 * Helper to create a range of level names, represented by integers that start counting at 1.
 */
export function createLevels(levelCount: number): I.Seq.Indexed<number> {
  return I.Range(1, levelCount + 1);
}

/**
 * Helper function that indicates if a game state is stale and should abort presenting.
 * This can happen if another guess has been made or the player
 * has changed the level before presenting completes.
 * Aborting avoids the unwanted situation where the player is presented a bunch of stale audio cues.
 * TODO this should also check if the game is still active so presenting is canceled when the user
 * clicks around on the nav, but we have no notion of an active game at the moment.
 * (the combo game active game is a different concept)
 */
export function shouldAbortPresenting<TGuess, T extends GameState<TGuess>>(
  originalGameState: T,
  currentGameState: T
): boolean {
  return originalGameState.presentCount !== currentGameState.presentCount
    || originalGameState.guessCount !== currentGameState.guessCount
    || originalGameState.refreshCorrectChoiceCount !== currentGameState.refreshCorrectChoiceCount;
}
