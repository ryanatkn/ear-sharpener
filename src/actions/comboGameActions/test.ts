import {assert} from 'chai';
import createReduxStore from '../../main/createReduxStore';
import {setActiveGame, guess} from './index';
import {getNextGame} from '../../models/ComboGame';
import {Store, GameName} from '../../types';
import * as PianoGame from '../../models/PianoGame';

// tslint:disable:max-line-length

describe('comboGameActions', () => {
  let store: Store;
  const firstGameName: GameName = 'piano-game';
  function getFirstGameState(): PianoGame.State {
    return store.getState().games.pianoGame;
  }
  function getIncorrectChoice(): PianoGame.Guess {
    const state = getFirstGameState();
    return state.choices.get(0) === state.correctChoice
      ? state.choices.get(0)
      : state.choices.get(1);
  }
  beforeEach(() => {
    store = createReduxStore();
    store.dispatch(setActiveGame(firstGameName));
    assert.strictEqual(
      store.getState().comboGame.activeGame,
      firstGameName
    );
  });

  describe('setActiveGame', () => {
    it('should set the active game for the combo game', () => {
      store.dispatch(setActiveGame('note-distance-game'));
      assert.strictEqual(
        store.getState().comboGame.activeGame,
        'note-distance-game'
      );
      store.dispatch(setActiveGame('note-name-game'));
      assert.strictEqual(
        store.getState().comboGame.activeGame,
        'note-name-game'
      );
    });
  });

  describe('guess', () => {
    it('should make a correct guess on the active game and advance to the next game', (): Promise<void> => {
      return store.dispatch(guess(firstGameName, getFirstGameState().correctChoice))
        .then(() => {
          assert.strictEqual(
            store.getState().comboGame.activeGame,
            getNextGame(firstGameName),
            'combo game should advance to the next game after a correct guess'
          );
        });
    });

    it('should make an incorrect guess on the active game and remain on the same game', (): Promise<void> => {
      return store.dispatch(guess(firstGameName, getIncorrectChoice()))
        .then(() => {
          assert.strictEqual(
            store.getState().comboGame.activeGame,
            firstGameName,
            'combo game should remain on the same game after an incorrect guess'
          );
        });
    });

    it('should make a correct guess on the active game, immediately disable input, and re-enable it when the next game is presented', (): Promise<void> => {
      const promise = store.dispatch(guess(firstGameName, getFirstGameState().correctChoice));
      assert.strictEqual(
        store.getState().games.isInputEnabled,
        false,
        'input should be disabled immediately after a correct combo game guess'
      );
      return promise.then(() => {
        assert.strictEqual(
          store.getState().games.isInputEnabled,
          true,
          'input should be enabled after the combo game finishes a correct guess'
        );
      });
    });

    it('should make an incorrect guess on the active game and not disable input', (): Promise<void> => {
      const promise = store.dispatch(guess(firstGameName, getIncorrectChoice()));
      assert.strictEqual(
        store.getState().games.isInputEnabled,
        true,
        'input should remain enabled immediately after an incorrect combo game guess'
      );
      return promise.then(() => {
        assert.strictEqual(
          store.getState().games.isInputEnabled,
          true,
          'input should still be enabled after the combo game finishes an incorrect guess'
        );
      });
    });
  });
});
