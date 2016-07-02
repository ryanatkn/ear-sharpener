import {GetState, Thunk, GameName, GameGuess, PresentingAction, PresentedAction,
  SetDifficultyAction, GuessingAction, GuessedAction} from '../../types';
import {Dispatch} from 'redux';
import {getGameState, getGameModel} from '../../reducers/games';
import * as Promiz from 'bluebird';
import {shouldAbortPresenting} from '../../models/Game';

/**
 * Presents `gameName`, which plays the current sounds.
 * The flag `forceRefresh` can be set to always refresh the choices and correct choice
 * regardless of the state of the game - otherwise the game state flags
 * `shouldRefreshChoices` and `shouldRefreshCorrectChoice` determine whether or not
 * the refresh is actually performed.
 */
export function present(gameName: GameName, forceRefresh: boolean = false): Thunk<Promise<void>> {
  return (dispatch: Dispatch, getState: GetState): Promise<void> => {
    const {meta: {actionId}} = dispatch(presenting(gameName, forceRefresh));
    // Presenting the game is just a side effect (playing sound), so it has no dispatched action.
    // I dislike how the action stream does not fully represent what's happening,
    // but I'm sticking with Redux best practices.
    const originalGameState = getGameState(getState().games, gameName);
    return getGameModel(gameName).present(
      getGameState(getState().games, gameName),
      (): boolean => { // `shouldAbort` callback
        const currentGameState = getGameState(getState().games, gameName);
        return shouldAbortPresenting(originalGameState, currentGameState);
      }
    )
      .then((): void => {
        dispatch(presented(gameName, actionId));
      });
  };
}

/**
 * Indicates that a game is about to be presented.
 */
function presenting(gameName: GameName, forceRefresh: boolean): PresentingAction {
  return {
    type: 'presenting',
    payload: {gameName, forceRefresh},
  };
}

/**
 * Indicates that a game has finished being presented.
 */
function presented(gameName: GameName, presentingActionId: number): PresentedAction {
  return {
    type: 'presented',
    payload: {gameName, presentingActionId},
  };
}

/**
 * Sets the difficulty (level and step) for a game and presents its next state.
 */
export function setDifficulty(
  gameName: GameName,
  level: number,
  step: number
): Thunk<Promise<void>> {
  return (dispatch: Dispatch): Promise<void> => {
    dispatch(_setDifficulty(gameName, level, step));
    return dispatch(present(gameName, true));
  };
}

/**
 * Sets the difficulty for a game without any additional effects.
 */
function _setDifficulty(gameName: GameName, level: number, step: number): SetDifficultyAction {
  return {
    type: 'setDifficulty',
    payload: {gameName, level, step},
  };
}

/**
 * Makes a guess against a game.
 * The caller can customize behavior with the `getDelay` and `onComplete` arguments.
 * The combo game achieves significantly different behavior on a guess with these.
 */
export function guess(
  gameName: GameName,
  guess: GameGuess,
  getDelay: typeof getDelayAfterGuess = getDelayAfterGuess,
  onComplete: typeof onGuessComplete = onGuessComplete
): Thunk<Promise<void>> {
  return (dispatch: Dispatch, getState: GetState): Promise<void> => {
    const {meta: {actionId}} = dispatch(guessing(gameName, guess));
    // Allow callers to provide their own post-guess delay,
    // but include a default that defers to the specific game's logic.
    const updatedGameState = getGameState(getState().games, gameName);
    const wasCorrect = updatedGameState.wasLastGuessCorrect;
    return Promiz.delay(getDelay(wasCorrect, gameName))
      .then((): Promise<void> => {
        // Abort if another guess has been made. The other guess action should handle
        // re-enabling input - we don't want to prematurely enable it.
        const currentGameState = getGameState(getState().games, gameName);
        if (currentGameState.guessCount !== updatedGameState.guessCount) {
          return undefined;
        }
        dispatch(guessed(gameName, actionId));
        // Allow callers to provide their own completion logic,
        // but include a default that refreshes and presents the current game.
        return onComplete(wasCorrect, gameName, dispatch);
      });
  };
}

/**
 * Indicates that a guess is being made on a game.
 */
function guessing(gameName: GameName, guess: GameGuess): GuessingAction {
  return {
    type: 'guessing',
    payload: {gameName, guess},
  };
}

/**
 * Indicates that a guess has finished being made on a game.
 */
function guessed(gameName: GameName, guessingActionId: number): GuessedAction {
  return {
    type: 'guessed',
    payload: {gameName, guessingActionId},
  };
}

/**
 * Default delay timer for `guess` that can be overridden by the caller.
 */
function getDelayAfterGuess(wasCorrect: boolean, gameName: GameName): number {
  return getGameModel(gameName).getPresentDelayAfterGuess(wasCorrect);
}

/**
 * Default behavior when a `guess` completes that can be overridden by the caller.
 */
function onGuessComplete(
  _wasCorrect: boolean, // isn't needed for the default implemention
  gameName: GameName,
  dispatch: Dispatch
): Promise<void> {
  return dispatch(present(gameName));
}
