import {Thunk} from '../../types';
import {Dispatch} from 'redux';
import {GameName, GameGuess, SetActiveGameAction} from '../../types';
import * as gameActions from '../gameActions';
import {getNextGame, pauseTimeBetweenGames} from '../../models/ComboGame';
import {getGameModel} from '../../reducers/games';

/**
 * Sets the combo game's active game.
 */
export function setActiveGame(gameName: GameName): SetActiveGameAction {
  return {
    type: 'setActiveGame',
    payload: {gameName},
  };
}

/**
 * Makes a guess for a game inside the combo game.
 */
export function guess(gameName: GameName, guess: GameGuess): Thunk<Promise<void>> {
  return (dispatch: Dispatch): Promise<void> => {
    return dispatch(gameActions.guess(
      gameName,
      guess,
      (wasCorrect: boolean): number => {
        return wasCorrect
          ? pauseTimeBetweenGames
          : getGameModel(gameName).getPresentDelayAfterGuess(wasCorrect);
      },
      (wasCorrect: boolean): Promise<void> => {
        if (wasCorrect) {
          const nextGameName = getNextGame(gameName);
          dispatch(setActiveGame(nextGameName));
          return dispatch(gameActions.present(nextGameName));
        } else {
          return dispatch(gameActions.present(gameName));
        }
      }
    ));
  };
}
