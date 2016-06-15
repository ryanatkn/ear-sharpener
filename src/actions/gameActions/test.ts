import {assert} from 'chai';
import createReduxStore from '../../main/createReduxStore';
import {present, setDifficulty, guess} from './index';
import {Store, GameName} from '../../types';
import * as PianoGame from '../../models/PianoGame';
import {spy} from 'sinon';

// tslint:disable:max-line-length

describe('gameActions', () => {
  let store: Store;
  const gameName: GameName = 'piano-game';
  function getGameState(): PianoGame.State {
    return store.getState().games.pianoGame;
  }
  function getIncorrectChoice(): PianoGame.Guess {
    const state = getGameState();
    return state.choices.get(0) === state.correctChoice
      ? state.choices.get(0)
      : state.choices.get(1);
  }
  beforeEach(() => {
    store = createReduxStore();
  });

  describe('present', () => {
    it('should present a game, disable input during the process, and enable it afterwards', () => {
      assert.strictEqual(store.getState().games.isInputEnabled, true);
      const promise = store.dispatch(present(gameName));
      assert.strictEqual(store.getState().games.isInputEnabled, false);
      return promise.then(() => {
        assert.strictEqual(store.getState().games.isInputEnabled, true);
      });
    });

    it('should present a game and force refresh it', () => {
      const originalGameState = getGameState();
      return store.dispatch(present(gameName, true))
        .then(() => {
          const updatedGameState = getGameState();
          assert.strictEqual(
            originalGameState.refreshChoicesCount,
            updatedGameState.refreshChoicesCount - 1,
            'force refreshing a game should refresh the choices'
          );
          assert.strictEqual(
            originalGameState.refreshCorrectChoiceCount,
            updatedGameState.refreshCorrectChoiceCount - 1,
            'force refreshing a game should refresh the correct choice'
          );
        });
    });

    it('should present a game and not refresh the correct choice if the game has had no correct guesses and it is not forced', () => {
      const originalGameState = getGameState();
      assert.strictEqual(
        !originalGameState.shouldRefreshChoices && !originalGameState.shouldRefreshCorrectChoice,
        true,
        'a game in its original state should not have any flags set to refresh the choices'
      );
      return store.dispatch(present(gameName, false))
        .then(() => {
          const updatedGameState = getGameState();
          assert.strictEqual(
            originalGameState.refreshChoicesCount,
            updatedGameState.refreshChoicesCount,
            'non-force refreshing a game that has no flags set to refresh it should result in no changes to the choices'
          );
          assert.strictEqual(
            originalGameState.refreshCorrectChoiceCount,
            updatedGameState.refreshCorrectChoiceCount,
            'non-force refreshing a game that has no flags set to refresh it should result in no changes to the correct choice'
          );
        });
    });
  });

  describe('setDifficulty', () => {
    it('should set the difficulty of the game and fully refresh it', () => {
      const newLevel = 2;
      const newStep = 2;
      const originalGameState = getGameState();
      assert.notStrictEqual(
        originalGameState.level,
        newLevel
      );
      assert.notStrictEqual(
        originalGameState.step,
        newStep
      );
      return store.dispatch(setDifficulty(gameName, newLevel, newStep))
        .then(() => {
          const updatedGameState = getGameState();
          assert.strictEqual(
            updatedGameState.level,
            newLevel,
            'the level should be updated'
          );
          assert.strictEqual(
            updatedGameState.step,
            newStep,
            'the step should be updated'
          );
          assert.strictEqual(
            originalGameState.refreshChoicesCount,
            updatedGameState.refreshChoicesCount - 1,
            'setting the difficulty of a game should refresh the choices'
          );
          assert.strictEqual(
            originalGameState.refreshCorrectChoiceCount,
            updatedGameState.refreshCorrectChoiceCount - 1,
            'setting the difficulty of a game should refresh the correct choice'
          );
        });
    });
  });

  describe('guess', () => {
    it('should make a correct guess on a game and update the game guess state values', (): Promise<void> => {
      const originalGameState = getGameState();
      const correctChoice = originalGameState.correctChoice;
      const promise = store.dispatch(guess(gameName, correctChoice));
      const updatedGameState = getGameState();
      assert.strictEqual(updatedGameState.lastGuess, correctChoice);
      assert.strictEqual(updatedGameState.wasLastGuessCorrect, true);
      assert.strictEqual(updatedGameState.guessCount, originalGameState.guessCount + 1);
      assert.strictEqual(updatedGameState.guessCountForCurrentCorrectChoice, 1);
      assert.strictEqual(updatedGameState.shouldRefreshCorrectChoice, true);
      return promise.then(() => {
        const finalGameState = getGameState();
        assert.strictEqual(finalGameState.guessCountForCurrentCorrectChoice, 0, 'the correct choice count should be reset after a correct guess completes');
      });
    });

    it('should make an incorrect guess on a game and update the game guess state values', (): Promise<void> => {
      const originalGameState = getGameState();
      const incorrectChoice = getIncorrectChoice();
      const promise = store.dispatch(guess(gameName, incorrectChoice));
      const updatedGameState = getGameState();
      assert.strictEqual(updatedGameState.lastGuess, incorrectChoice);
      assert.strictEqual(updatedGameState.wasLastGuessCorrect, false);
      assert.strictEqual(updatedGameState.guessCount, originalGameState.guessCount + 1);
      assert.strictEqual(updatedGameState.guessCountForCurrentCorrectChoice, 1);
      assert.strictEqual(updatedGameState.shouldRefreshCorrectChoice, false);
      return promise.then(() => {
        const finalGameState = getGameState();
        assert.strictEqual(finalGameState.guessCountForCurrentCorrectChoice, 1, 'the correct choice count should not be reset after an incorrect guess completes');
      });
    });

    it('should make a correct guess on a game at the final step of its level and advance to the next level', (): Promise<void> => {
      const originalLevel = 1;
      store.dispatch(setDifficulty(gameName, originalLevel, getGameState().stepCounts.get(originalLevel)));
      const originalGameState = getGameState();
      return store.dispatch(guess(gameName, originalGameState.correctChoice))
        .then(() => {
          const updatedGameState = getGameState();
          assert.strictEqual(
            originalGameState.level,
            updatedGameState.level - 1,
            'making a correct guess on a game at the final step of the level should increment the level'
          );
          assert.strictEqual(
            updatedGameState.step,
            1,
            'incrementing the level should set the step to 1'
          );
        });
    });

    it('should make an incorrect guess on a game at the first step of its level and fall back a level', (): Promise<void> => {
      store.dispatch(setDifficulty(gameName, 2, 1));
      const originalGameState = getGameState();
      return store.dispatch(guess(gameName, getIncorrectChoice()))
        .then(() => {
          const updatedGameState = getGameState();
          assert.strictEqual(
            originalGameState.level,
            updatedGameState.level + 1,
            'making an incorrect guess on a game at the first step of the level should decrement the level'
          );
          assert.strictEqual(
            updatedGameState.step,
            updatedGameState.stepCounts.get(updatedGameState.level),
            'decrementing the level should set the step to its new maximum'
          );
        });
    });

    it('should make a correct guess on a game and renew it', (): Promise<void> => {
      const originalGameState = getGameState();
      return store.dispatch(guess(gameName, originalGameState.correctChoice))
        .then(() => {
          const updatedGameState = getGameState();
          assert.strictEqual(
            originalGameState.refreshChoicesCount,
            updatedGameState.refreshChoicesCount - 1,
            'making a correct guess on a game should refresh the choices'
          );
          assert.strictEqual(
            originalGameState.refreshCorrectChoiceCount,
            updatedGameState.refreshCorrectChoiceCount - 1,
            'making a correct guess on a game should refresh the correct choice'
          );
        });
    });

    it('should make an incorrect guess on a game that does not change the level and not renew it', (): Promise<void> => {
      store.dispatch(setDifficulty(gameName, 1, 1));
      const originalGameState = getGameState();
      return store.dispatch(guess(gameName, getIncorrectChoice()))
        .then(() => {
          const updatedGameState = getGameState();
          assert.strictEqual(
            originalGameState.refreshChoicesCount,
            updatedGameState.refreshChoicesCount,
            'making an incorrect guess on a game that does not change the level should not refresh the choices'
          );
          assert.strictEqual(
            originalGameState.refreshCorrectChoiceCount,
            updatedGameState.refreshCorrectChoiceCount,
            'making an incorrect guess on a game that does not change the level should not refresh the correct choice'
          );
        });
    });

    it('should make an incorrect guess on a game that changes the level and renews it', (): Promise<void> => {
      store.dispatch(setDifficulty(gameName, 2, 1));
      const originalGameState = getGameState();
      return store.dispatch(guess(gameName, getIncorrectChoice()))
        .then(() => {
          const updatedGameState = getGameState();
          assert.strictEqual(
            originalGameState.refreshChoicesCount,
            updatedGameState.refreshChoicesCount - 1,
            'making an incorrect guess on a game that changes the level should refresh the choices'
          );
          // TODO we could test refreshing the correct choice
          // there are two conditions:
            // if the correct choice is still in the new choices, do not refresh it.
            // if the correct choice is not in the new choices, refresh it.
        });
    });

    it('should make a correct guess on a game, immediately disable input, and re-enable it when the next choices are presented', (): Promise<void> => {
      const promise = store.dispatch(guess(gameName, getGameState().correctChoice));
      assert.strictEqual(
        store.getState().games.isInputEnabled,
        false,
        'input should be disabled directly after a correct guess'
      );
      return promise.then(() => {
        assert.strictEqual(
          store.getState().games.isInputEnabled,
          true,
          'input should be enabled after the game finishes a correct guess'
        );
      });
    });

    it('should make an incorrect guess on a game and not disable input', (): Promise<void> => {
      const promise = store.dispatch(guess(gameName, getIncorrectChoice()));
      assert.strictEqual(
        store.getState().games.isInputEnabled,
        true,
        'input should remain enabled directly after an incorrect guess'
      );
      return promise.then(() => {
        assert.strictEqual(
          store.getState().games.isInputEnabled,
          true,
          'input should still be enabled after an incorrect guess on a game'
        );
      });
    });

    it('should make a correct guess on a game and use the provided functions', (): Promise<void> => {
      const getDelaySpy = spy(() => 1);
      const onCompleteSpy = spy();
      return store.dispatch(guess(gameName, getGameState().correctChoice, getDelaySpy, onCompleteSpy))
        .then(() => {
          assert(getDelaySpy.calledOnce);
          assert(getDelaySpy.calledWithExactly(true, gameName));
          assert(onCompleteSpy.calledOnce);
          assert(onCompleteSpy.calledWith(true, gameName)); // dispatch is the 3rd arg but Redux does not pass the same `store.dispatch` function identity to middleware
          assert.typeOf(onCompleteSpy.firstCall.args[2], 'function');
        });
    });

    it('should make an incorrect guess on a game and use the provided functions', (): Promise<void> => {
      const getDelaySpy = spy(() => 1);
      const onCompleteSpy = spy();
      return store.dispatch(guess(gameName, getIncorrectChoice(), getDelaySpy, onCompleteSpy))
        .then(() => {
          assert(getDelaySpy.calledOnce);
          assert(getDelaySpy.calledWithExactly(false, gameName));
          assert(onCompleteSpy.calledOnce);
          assert(onCompleteSpy.calledWith(false, gameName)); // dispatch is the 3rd arg but Redux does not pass the same `store.dispatch` function identity to middleware
          assert.typeOf(onCompleteSpy.firstCall.args[2], 'function');
        });
    });

  });
});
