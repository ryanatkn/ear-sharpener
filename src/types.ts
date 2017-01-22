import {Reducer} from 'redux';
import * as assetLoader from './reducers/assetLoader';
import * as comboGame from './reducers/comboGame';
import * as games from './reducers/games';
import {GameState} from './models/Game';
import * as NoteDistanceGame from './models/NoteDistanceGame';
import * as NoteNameGame from './models/NoteNameGame';
import * as PianoGame from './models/PianoGame';

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

// This is a bit odd, but it allows us to get `GameName` and `gameNames` generically.
const GameNames = {
  'combo-game': 1,
  'piano-game': 1,
  'note-name-game': 1,
  'note-distance-game': 1,
};
export type GameName = keyof typeof GameNames;
export const gameNames = keysOf(GameNames);

// This helper is used because `Object.keys` doesn't return the desired type.
function keysOf<T, U extends (keyof T)[]>(t: T): U {
  return Object.keys(t) as U;
}


// There's no type safety when `GameName` and `GameGuess` are used together.
// Tuple types don't work with the polymorphism we have in the components without casting,
// which seems to defeat the purpose.
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

/**
 * Action types.
 * Uses the discriminated union types in typescript@next
 * See https://github.com/Microsoft/TypeScript/pull/9163
 */
export type Action = PresentingAction | PresentedAction | SetDifficultyAction
  | GuessingAction | GuessedAction | AudioLoadedAction | SetActiveGameAction;

interface ReduxAction {
  meta?: { // needs to be optional so actions don't have to define a meta property
    // The `actionId` is added by middleware and uniquely identifies each action.
    // Used to re-enable input with precision.
    actionId: number;
  };
}

export interface PresentingAction extends ReduxAction {
  type: 'presenting';
  payload: {gameName: GameName, forceRefresh: boolean};
}

export interface PresentedAction extends ReduxAction {
  type: 'presented';
  payload: {gameName: GameName, presentingActionId: number};
}

export interface SetDifficultyAction extends ReduxAction {
  type: 'setDifficulty';
  payload: {gameName: GameName, level: number, step: number};
}

export interface GuessingAction extends ReduxAction {
  type: 'guessing';
  payload: {gameName: GameName, guess: GameGuess};
}

export interface GuessedAction extends ReduxAction {
  type: 'guessed';
  payload: {gameName: GameName, guessingActionId: number};
}

export interface AudioLoadedAction extends ReduxAction {
  type: 'audioLoaded';
  payload?: undefined;
}

export interface SetActiveGameAction extends ReduxAction {
  type: 'setActiveGame';
  payload: {gameName: GameName};
}
