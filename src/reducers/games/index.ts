import {Action, GameName} from '../../types';
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
  inputDisabledActionIds: I.Set<number>;
}

export type State = I.Record.IRecord<IState>;

const StateRecord = I.Record<IState>({
  noteDistanceGame: NoteDistanceGame.create(),
  noteNameGame: NoteNameGame.create(),
  pianoGame: PianoGame.create(),
  lastGameGuessed: null,
  isInputEnabled: true,
  inputDisabledActionIds: I.Set<number>(),
});

export function getInitialState(): State {
  return new StateRecord();
}

export default function games(state: State = getInitialState(), action: Action): State {
  switch (action.type) {

    /**
     * Handles the transformations that should happen when a game starts presenting.
     * Disable input while presenting unless the current state has already been presented,
     * allowing the user to make multiple quick guesses.
     */
    case 'presenting': {
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
      // TODO unfortunately we introduced an undesirable UX quirk with the GamePresentButton here.
      // The button is disabled when clicked for the note distance game
      // until it finishes presenting.
      // Ideally the user should be able to click the button rapidly without it being disabled.
      if (getGameState(newState, gameName).guessCountForCurrentCorrectChoice === 0) {
        newState = disableInput(newState, action.meta.actionId);
      }
      return newState;
    }

    /**
     * Handles the transformations that should happen when a game finishes presenting.
     * Input may have been disabled when it started presenting, so re-enable it as necessary.
     */
    case 'presented': {
      return enableInput(state, action.payload.presentingActionId);
    }

    /**
     * Sets the difficulty (level and step) for a game.
     */
    case 'setDifficulty': {
      const {gameName, level, step} = action.payload;
      return state.update(
        getGameStateKey(gameName),
        (game: Game.GameState<any>): Game.GameState<any> => {
          return Game.clearLastGuess(Game.setDifficulty(game, level, step));
        }
      ) as State;
    }

    /**
     * Handles the transformations that should happen when
     * a guess is made on a game and before it completes.
     * Disables input if the guess was correct.
     */
    case 'guessing': {
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
        newState = disableInput(newState, action.meta.actionId);
      }
      return newState;
    }

    /**
     * Handles the transformations that should happen when a guess is completed.
     * There is a delay between this and the `GuessAction` for some games
     * to allow for feedback animations.
     * Re-enables input as necessary.
     */
    case 'guessed': {
      return enableInput(state, action.payload.guessingActionId);
    }

    /**
     * Unhandled action.
     */
    default: {
      return state;
    }
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

/**
 * Disables input on the state, tracking which actions have disabled input so it can be
 * re-enabled only when there are no pending actions that also requested to disable input.
 */
function disableInput(state: State, actionId: number): State {
  return state
    .set('isInputEnabled', false)
    .set('inputDisabledActionIds', state.inputDisabledActionIds.add(actionId)) as State;
}

/**
 * Enables input on the state,
 * but only if there are no pending actions that requested to disable input.
 * This prevents a bug where input can be enabled prematurely if multiple actions
 * that disable it come through.
 */
function enableInput(state: State, actionId: number): State {
  let newState = state.set(
    'inputDisabledActionIds',
    state.inputDisabledActionIds.remove(actionId)
  ) as State;
  if (newState.inputDisabledActionIds.size === 0) {
    newState = newState.set('isInputEnabled', true) as State;
  }
  return newState;
}
