import * as persistState from 'redux-localstorage';
import * as get from 'lodash/get';
import * as Game from '../../models/Game';
import {getGameModel, getGameStateKey, State as GamesState} from '../../reducers/games';
import {AppState, gameNames} from '../../types';

/**
 * Middleware for persisting state values to localStorage.
 * This is complicated because the app uses Immutable.js,
 * and it does not attempt much type safety.
 * Reading from the app state is easy using lodash `get` keypaths because we use records,
 * but merging the persisted data back into the app state cannot be done generically
 * because `Immutable.fromJS` gives us maps, not the named records we need in the app state.
 */
export default function localStorageStoreEnhancer(): Function {
  return persistState(
    [
      'games.pianoGame.level',
      'games.pianoGame.step',
      'games.noteNameGame.level',
      'games.noteNameGame.step',
      'games.noteDistanceGame.level',
      'games.noteDistanceGame.step',
    ],
    {
      slicer: (paths: string[]) => (state: any) => { // tslint:disable-line:typedef
        return paths.reduce(
          (subset: any, path: string): any => {
            const value = get(state, path);
            if (typeof value !== 'string' && typeof value !== 'number') {
              throw new Error(`Unexpected value type for localStorage: '${typeof value}'`);
            }
            subset[path] = value;
            return subset;
          },
          {}
        );
      },
      merge: (initialState: AppState, persistedState: any): any => {
        // Harcode only the merge cases that are needed.
        // See the comments above for why this cannot be done generically.
        for (const key in persistedState) {
          const [reducerName, ...parts] = key.split('.');
          // Handle key paths for `games.fooGame.barValue`
          if (reducerName === 'games' && parts.length === 2) {
            const [gameName, gameKey] = parts;
            initialState[reducerName] = initialState[reducerName].set(
              gameName,
              initialState[reducerName][gameName].set(gameKey, persistedState[key])
            );
          } else {
            throw new Error(`Unimplemented merge behavior for key '${key}'`);
          }
        }
        // Re-initialize the games with their level and step.
        // This must be done after setting all of the other values from the persistedState above
        // because setting the level but not the step (or vice versa) and initializing
        // could cause garbage data when the game difficulty is clamped.
        // In other words, this is terrible, but I don't see a quick way around it without adding a
        // hacky initialization action on app startup, which seems worse.
        // Better to isolate the garbage here.
        initialState.games = initialState.games.withMutations((games: GamesState): void => {
          for (const gameName of gameNames) {
            // Not every game has state, like the 'combo-game',
            // and trying to find the game state key for those throws an error.
            try {
              const gameStateKey = getGameStateKey(gameName);
              const game = games[gameStateKey];
              if (game && game.levels) {
                games.set(
                  gameStateKey,
                  Game.init(
                    game,
                    getGameModel(gameName).refreshChoices,
                    getGameModel(gameName).refreshCorrectChoice
                  )
                );
              }
            } catch (err) {
              continue;
            }
          }
        }) as GamesState;
        return initialState;
      },
    }
  );
}
