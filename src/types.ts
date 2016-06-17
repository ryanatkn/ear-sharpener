import {Reducer} from 'redux';
import * as assetLoader from './reducers/assetLoader';
import * as comboGame from './reducers/comboGame';
import * as games from './reducers/games';
import {GameState} from './models/Game';
import * as NoteDistanceGame from './models/NoteDistanceGame';
import * as NoteNameGame from './models/NoteNameGame';
import * as PianoGame from './models/PianoGame';
import {Action} from './utils/actions';

export interface AppState {
  // Index signature for the rare times we need to iterate through the state.
  [key: string]: any;

  // App reducers
  assetLoader: assetLoader.State;
  comboGame: comboGame.State;
  games: games.State;

  // react-router-redux does not provide a type for its state,
  // and this is needed to let pure components update on routing changes. 
  routing: {locationBeforeTransitions: {key: string}};
}

export interface GetState {
  (): AppState;
}

export interface Dispatch {
  (action: Action): void;
  <T extends Promise<any>>(action: Thunk<T>): T; // thunks in this app must return a promise
}

export interface MiddlewareArg {
  dispatch: Dispatch;
  getState: GetState;
}

// Use this store interface instead of Redux.Store to get type safe `getState`.
export interface Store {
  getReducer(): Reducer;
  replaceReducer(nextReducer: Reducer): void;
  dispatch: Dispatch;
  getState: GetState;
  subscribe(listener: Function): Function;
}

export interface Thunk<T> {
  (dispatch: Dispatch, getState?: GetState): T;
}

// There's no type safety when `GameName` and `GameGuess` are used together.
// Tuple types don't work with the polymorphism we have in the components without casting,
// which seems to defeat the purpose.
export type GameName = 'combo-game' | 'piano-game' | 'note-name-game' | 'note-distance-game';
export const gameNames: GameName[] = [
  'combo-game', 'piano-game', 'note-name-game', 'note-distance-game',
];
export type GameGuess = NoteDistanceGame.Guess | NoteNameGame.Guess | PianoGame.Guess;

export interface GameProps<T extends GameState<TGuess>, TGuess> {
  gameState: T;
  isGuessIndicatorEnabled: boolean;
  isInputEnabled: boolean;
  isActive?: boolean;
  onGuess(guess: TGuess): void;
  onSetDifficulty(level: number, step: number): void;
  onPresent(): void;
}
