import {GetState, Thunk, GameName, GameGuess, PresentingAction, PresentedAction,
  SetDifficultyAction, GuessingAction, GuessedAction} from '../../types';
import {Dispatch} from 'redux';
import {getGameState, getGameModel} from '../../reducers/games';
import * as Promiz from 'bluebird';
import {shouldAbortPresenting} from '../../models/Game';

function presenting(gameName: GameName, forceRefresh: boolean): PresentingAction {
  return {
    type: 'presenting',
    payload: {gameName, forceRefresh}
  };
}

function presented(gameName: GameName): PresentedAction {
  return {
    type: 'presented',
    payload: {gameName},
  };
}

/**
 * Presents `gameName`, which plays the current sounds.
 * The flag `forceRefresh` can be set to always refresh the choices and correct choice
 * regardless of the state of the game - otherwise the game state flags
 * `shouldRefreshChoices` and `shouldRefreshCorrectChoice` determine whether or not
 * the refresh is actually performed.
 */
export function present(gameName: GameName, forceRefresh: boolean = false): Thunk<Promise<void>> {
  return (dispatch: Dispatch, getState: GetState): Promise<void> => {
    dispatch(presenting(gameName, forceRefresh));
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
        dispatch(presented(gameName));
      });
  };
}

function _setDifficulty(gameName: GameName, level: number, step: number): SetDifficultyAction {
  return {
    type: 'setDifficulty',
    payload: {gameName, level, step}
  };
}

/**
 * Sets the difficulty (level and step) for a game.
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

function guessing(gameName: GameName, guess: GameGuess): GuessingAction {
  return {
    type: 'guessing',
    payload: {gameName, guess},
  };
}

function guessed(gameName: GameName): GuessedAction {
  return {
    type: 'guessed',
    payload: {gameName},
  };
}

/**
 * Makes a guess against a game.
 * The optional flag `presentIfCorrect` can be set to false to give the caller control
 * over what happens on correct guesses. (the combo game uses this functionality)
 */
export function guess(
  gameName: GameName,
  guess: GameGuess,
  getDelay: typeof getDelayAfterGuess = getDelayAfterGuess,
  onComplete: typeof onGuessComplete = onGuessComplete
): Thunk<Promise<void>> {
  return (dispatch: Dispatch, getState: GetState): Promise<void> => {
    dispatch(guessing(gameName, guess));
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
        dispatch(guessed(gameName));
        // Allow callers to provide their own completion logic,
        // but include a default that refreshes and presents the current game.
        return onComplete(wasCorrect, gameName, dispatch);
      });
  };
}

/**
 * Default behavior for `guess` that can be overridden by the caller.
 */
function getDelayAfterGuess(wasCorrect: boolean, gameName: GameName): number {
  return getGameModel(gameName).getPresentDelayAfterGuess(wasCorrect);
}

/**
 * Default behavior for `guess` that can be overridden by the caller.
 */
function onGuessComplete(
  _wasCorrect: boolean, // isn't needed for the default implemention
  gameName: GameName,
  dispatch: Dispatch
): Promise<void> {
  return dispatch(present(gameName));
}
