import assetLoader, {getInitialState as assetLoaderGetInitialState} from './assetLoader';
import comboGame, {getInitialState as comboGameGetInitialState} from './comboGame';
import games, {getInitialState as gamesGetInitialState} from './games';
import {AppState} from '../types';

export default {
  assetLoader,
  comboGame,
  games,
};

/**
 * Returns the initial state of the app.
 * Normally we would let Redux do this initialization automatically,
 * but in this app the localStorage persistence layer powerted by `redux-localstorage`
 * requires that the top-level store is created with the initial app state.
 */
export function getInitialState(): AppState {
  return {
    assetLoader: assetLoaderGetInitialState(),
    comboGame: comboGameGetInitialState(),
    games: gamesGetInitialState(),
    routing: undefined,
  };
}
