import {GameName} from '../../types';
import {Action, isAction} from '../../utils/actions';
import {GuessingAction, GuessedAction, PresentingAction, PresentedAction,
  SetDifficultyAction} from '../../actions/gameActions';
import * as Game from '../../models/Game';
import * as I from 'immutable';
import * as NoteDistanceGame from '../../models/NoteDistanceGame';
import * as NoteNameGame from '../../models/NoteNameGame';
import * as PianoGame from '../../models/PianoGame';

interface IState {
  // This index signature is hacky, but is the cleanest way to reuse `getGameStateKey`.
  // Immutable forces a loss of type safety when setting values, so this isn't much of a loss.
  // Might be cleaner to have a nested `games` record, but that would add unwanted boilerplate.
  [key: string]: any;
  // Games state
  noteDistanceGame: NoteDistanceGame.State;
  noteNameGame: NoteNameGame.State;
  pianoGame: PianoGame.State;
  // Other state
  lastGameGuessed: GameName;
  isInputEnabled: boolean;
}

export type State = I.Record.IRecord<IState>;

const StateRecord = I.Record<IState>({
  noteDistanceGame: NoteDistanceGame.create(),
  noteNameGame: NoteNameGame.create(),
  pianoGame: PianoGame.create(),
  lastGameGuessed: null,
  isInputEnabled: true,
});

export function getInitialState(): State {
  return new StateRecord();
}

export default function games(state: State = getInitialState(), action: Action): State {
  /**
   * Handles the transformations that should happen when a game starts presenting.
   * Disable input while presenting unless the current state has already been presented,
   * allowing the user to make multiple quick guesses.
   */
  if (isAction(action, PresentingAction)) {
    const {gameName, forceRefresh} = action.payload;
    let newState = state.update(
      getGameStateKey(gameName),
      (game: Game.GameState<any>): Game.GameState<any> => {
        // Increment a counter so we can determine if an async present is stale.
        const newGame = game.set('presentCount', game.presentCount + 1);
        // Perform a refresh. This can be a noop if no refresh is necessary or forced.
        const {refreshChoices, refreshCorrectChoice} = getGameModel(gameName);
        return Game.refresh(newGame, refreshChoices, refreshCorrectChoice, forceRefresh);
      }
    ) as State;
    // Disable input when presenting a game state for the first time.
    // This permits the player to guess immediately after incorrect guesses
    // without waiting for the same state to be presented again.
    if (getGameState(newState, gameName).guessCountForCurrentCorrectChoice === 0) {
      newState = newState.set('isInputEnabled', false) as State;
    }
    return newState;
  /**
   * Handles the transformations that should happen when a game finishes presenting.
   * Input may have been disabled when it started presenting, so re-enable it as necessary.
   */
  } else if (isAction(action, PresentedAction)) {
    // TODO this should only enable it if it was disabled in the associated PresentingAction!
    // However that requires some hacky workarounds, and it's a rare enough bug to ignore.
    // One way to do it would be to track a unique id for each dispatched action which gets
    // set on the state in `presenting` and is passed as a parameter into `presented`.
    // Input would only be re-enabled here if the parameter id matched the id on the state.
    return state.set('isInputEnabled', true) as State;
  /**
   * Sets the difficulty (level and step) for a game.
   */
  } else if (isAction(action, SetDifficultyAction)) {
    const {gameName, level, step} = action.payload;
    return state.update(
      getGameStateKey(gameName),
      (game: Game.GameState<any>): Game.GameState<any> => {
        return Game.clearLastGuess(Game.setDifficulty(game, level, step));
      }
    ) as State;
  /**
   * Handles the transformations that should happen when
   * a guess is made on a game and before it completes.
   * Disables input if the guess was correct.
   */
  } else if (isAction(action, GuessingAction)) {
    const {gameName, guess} = action.payload;
    let newState = state
      .set('lastGameGuessed', gameName)
      .update(
        getGameStateKey(gameName),
        (game: Game.GameState<any>): Game.GameState<any> => {
          return Game.guess(game, guess);
        }
      ) as State;
    // Disable input for correct guesses until the `GuessedAction` occurs.
    // This permits the player to guess immediately after incorrect guesses
    // without waiting for the same state to be presented again.
    if (getGameState(newState, gameName).wasLastGuessCorrect) {
      newState = newState.set('isInputEnabled', false) as State;
    }
    return newState;
  /**
   * Handles the transformations that should happen when a guess is completed.
   * There is a delay between this and the `GuessAction` for some games
   * to allow for feedback animations.
   * Re-enables input as necessary.
   */
  } else if (isAction(action, GuessedAction)) {
    // TODO this should only enable it if it was disabled in the associated GuessAction!
    // See the notes in the `PresentedAction` block above for a possible fix.
    return state.set('isInputEnabled', true) as State;
  } else {
    return state;
  }
};

export function getGameModel(gameName: GameName): Game.GameModel<any> {
  switch (gameName) {
    case 'note-distance-game':
      return NoteDistanceGame;
    case 'note-name-game':
      return NoteNameGame;
    case 'piano-game':
      return PianoGame;
    default:
      throw new Error(`Unknown game name "${gameName}"`);
  }
}

// Not very clean, but we already lose type safety by using Immutable - mirrors IState fields above
export function getGameStateKey(gameName: GameName): string {
  switch (gameName) {
    case 'note-distance-game':
      return 'noteDistanceGame';
    case 'note-name-game':
      return 'noteNameGame';
    case 'piano-game':
      return 'pianoGame';
    default:
      throw new Error(`Unknown game name "${gameName}"`);
  }
}

export function getGameState(state: State, gameName: GameName): Game.GameState<any> {
  return state[getGameStateKey(gameName)];
}
