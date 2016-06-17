import {IGameState, init, setDifficulty, refresh, guess, clampDifficulty,
  createLevels} from './index';
import * as I from 'immutable';
import {spy} from 'sinon';
import {assert} from 'chai';

// tslint:disable:max-line-length

describe('Game', () => {
  // Set up the types for a test game record.
  const levels = I.Range(1, 3);
  const stepCounts = I.Map<number, number>([[1, 10], [2, 20], [3, 30]]);
  type TestGuess = number;
  interface ITestState extends IGameState<TestGuess> {}
  type TestState = I.Record.IRecord<ITestState>;
  const TestStateRecord = I.Record<ITestState>({
    name: 'piano-game', // has nothing to do with piano game, is just to satisfy the type
    levelCount: 3,
    levels,
    stepCounts,
    level: undefined,
    step: undefined,
    choices: undefined,
    correctChoice: undefined,
    lastGuess: undefined,
    wasLastGuessCorrect: undefined,
    presentCount: undefined,
    guessCount: undefined,
    guessCountForCurrentCorrectChoice: undefined,
    shouldRefreshChoices: undefined,
    shouldRefreshCorrectChoice: undefined,
    refreshChoicesCount: undefined,
    refreshCorrectChoiceCount: undefined,
  });

  // Helper to create a fresh. Isn't needed for every test so is not used in a `beforeEach`.
  function createAndInitGame(): TestState {
    return init(
      new TestStateRecord(),
      (g: TestState) => g.set('choices', I.List([3, 4, 5])) as TestState,
      (g: TestState) => g.set('correctChoice', 4) as TestState
    );
  }

  describe('init', () => {
    it('should initialize a game state record with default values', () => {
      const choices = I.List([3, 4, 5]);
      const correctChoice = 4;
      const refreshChoices = spy(
        (game: TestState) => game.set('choices', choices)
      );
      const refreshCorrectChoice = spy(
        (game: TestState) => game.set('correctChoice', correctChoice)
      );
      const game = init(new TestStateRecord(), refreshChoices, refreshCorrectChoice);
      assert.strictEqual(refreshChoices.callCount, 1);
      assert.strictEqual(refreshCorrectChoice.callCount, 1);
      assert.strictEqual(game.level, 1);
      assert.strictEqual(game.step, 0);
      assert(I.is(game.choices, choices));
      assert.strictEqual(game.correctChoice, correctChoice);
      assert.strictEqual(game.lastGuess, null);
      assert.strictEqual(game.wasLastGuessCorrect, null);
      assert.strictEqual(game.presentCount, 0);
      assert.strictEqual(game.guessCount, 0);
      assert.strictEqual(game.guessCountForCurrentCorrectChoice, 0);
      assert.strictEqual(game.shouldRefreshChoices, false);
      assert.strictEqual(game.shouldRefreshCorrectChoice, false);
      assert.strictEqual(game.refreshChoicesCount, 1);
      assert.strictEqual(game.refreshCorrectChoiceCount, 1);
    });
  });

  describe('setDifficulty', () => {
    it('should set the level and step for a game', () => {
      const game = createAndInitGame();
      const newLevel = 2;
      const newStep = 2;
      assert.notStrictEqual(game.level, newLevel);
      assert.notStrictEqual(game.step, newStep);
      const updatedGame = setDifficulty(game, newLevel, newStep);
      assert.strictEqual(updatedGame.level, newLevel);
      assert.strictEqual(updatedGame.step, newStep);
      assert.strictEqual(updatedGame.shouldRefreshChoices, true);
    });
  });

  describe('refresh', () => {
    it('should refresh a game when forced', () => {
      const game = createAndInitGame();
      const newChoices = I.List([7, 8, 9]);
      const newCorrectChoice = 8;
      assert(!I.is(game.choices, newChoices));
      assert.notStrictEqual(game.correctChoice, newCorrectChoice);
      const updatedGame = refresh(
        game,
        (g: TestState) => g.set('choices', newChoices) as TestState,
        (g: TestState) => g.set('correctChoice', newCorrectChoice) as TestState,
        true
      );
      assert(I.is(updatedGame.choices, newChoices));
      assert.strictEqual(updatedGame.correctChoice, newCorrectChoice);
      assert.strictEqual(updatedGame.guessCountForCurrentCorrectChoice, 0);
      assert.strictEqual(game.refreshChoicesCount, updatedGame.refreshChoicesCount - 1);
      assert.strictEqual(game.refreshCorrectChoiceCount, updatedGame.refreshCorrectChoiceCount - 1);
    });

    it('should not refresh a new game when not forced', () => {
      const game = createAndInitGame();
      const newChoices = I.List([7, 8, 9]);
      const newCorrectChoice = 8;
      assert(!I.is(game.choices, newChoices));
      assert.notStrictEqual(game.correctChoice, newCorrectChoice);
      const updatedGame = refresh(
        game,
        (g: TestState) => g.set('choices', newChoices) as TestState,
        (g: TestState) => g.set('correctChoice', newCorrectChoice) as TestState,
        false
      );
      assert(!I.is(updatedGame.choices, newChoices));
      assert.notStrictEqual(updatedGame.correctChoice, newCorrectChoice);
      assert.strictEqual(updatedGame.guessCountForCurrentCorrectChoice, 0);
      assert.strictEqual(game.refreshChoicesCount, updatedGame.refreshChoicesCount);
      assert.strictEqual(game.refreshCorrectChoiceCount, updatedGame.refreshCorrectChoiceCount);
    });

    it('should refresh a game when not forced if the refresh flags are true', () => {
      const game = createAndInitGame()
        .set('shouldRefreshChoices', true)
        .set('shouldRefreshCorrectChoice', true) as TestState;
      const newChoices = I.List([7, 8, 9]);
      const newCorrectChoice = 8;
      assert(!I.is(game.choices, newChoices));
      assert.notStrictEqual(game.correctChoice, newCorrectChoice);
      const updatedGame = refresh(
        game,
        (g: TestState) => g.set('choices', newChoices) as TestState,
        (g: TestState) => g.set('correctChoice', newCorrectChoice) as TestState,
        false
      );
      assert(I.is(updatedGame.choices, newChoices));
      assert.strictEqual(updatedGame.correctChoice, newCorrectChoice);
      assert.strictEqual(updatedGame.guessCountForCurrentCorrectChoice, 0);
      assert.strictEqual(game.refreshChoicesCount, updatedGame.refreshChoicesCount - 1);
      assert.strictEqual(game.refreshCorrectChoiceCount, updatedGame.refreshCorrectChoiceCount - 1);
    });
  });

  describe('guess', () => {
    it('should perform an incorrect guess on a game that does not change its level', () => {
      const game = setDifficulty(createAndInitGame(), 1, 2);
      const incorrectChoice = game.choices.last();
      assert.notStrictEqual(game.correctChoice, incorrectChoice);
      const updatedGame = guess(game, incorrectChoice);
      assert.strictEqual(updatedGame.level, game.level);
      assert.strictEqual(updatedGame.step, game.step - 1);
      assert.strictEqual(updatedGame.lastGuess, incorrectChoice);
      assert.strictEqual(updatedGame.wasLastGuessCorrect, false);
      assert.strictEqual(updatedGame.guessCount, game.guessCount + 1);
      assert.strictEqual(updatedGame.guessCountForCurrentCorrectChoice, game.guessCountForCurrentCorrectChoice + 1);
      assert.strictEqual(updatedGame.shouldRefreshChoices, false);
      assert.strictEqual(updatedGame.shouldRefreshCorrectChoice, false);
    });

    it('should perform an incorrect guess on a game that changes its level', () => {
      const game = setDifficulty(createAndInitGame(), 2, 1);
      const incorrectChoice = game.choices.last();
      assert.notStrictEqual(game.correctChoice, incorrectChoice);
      const updatedGame = guess(game, incorrectChoice);
      assert.strictEqual(updatedGame.level, game.level - 1);
      assert.strictEqual(updatedGame.step, updatedGame.stepCounts.get(updatedGame.level));
      assert.strictEqual(updatedGame.lastGuess, incorrectChoice);
      assert.strictEqual(updatedGame.wasLastGuessCorrect, false);
      assert.strictEqual(updatedGame.guessCount, game.guessCount + 1);
      assert.strictEqual(updatedGame.guessCountForCurrentCorrectChoice, game.guessCountForCurrentCorrectChoice + 1);
      assert.strictEqual(updatedGame.shouldRefreshChoices, true);
      assert.strictEqual(updatedGame.shouldRefreshCorrectChoice, false);
    });

    it('should perform a correct guess on a game that does not change its level', () => {
      const game = setDifficulty(createAndInitGame(), 1, 2);
      assert.strictEqual(game.correctChoice, game.correctChoice);
      const updatedGame = guess(game, game.correctChoice);
      assert.strictEqual(updatedGame.level, game.level);
      assert.strictEqual(updatedGame.step, game.step + 1);
      assert.strictEqual(updatedGame.lastGuess, game.correctChoice);
      assert.strictEqual(updatedGame.wasLastGuessCorrect, true);
      assert.strictEqual(updatedGame.guessCount, game.guessCount + 1);
      assert.strictEqual(updatedGame.guessCountForCurrentCorrectChoice, game.guessCountForCurrentCorrectChoice + 1);
      assert.strictEqual(updatedGame.shouldRefreshChoices, false);
      assert.strictEqual(updatedGame.shouldRefreshCorrectChoice, true);
    });

    it('should perform a correct guess on a game that changes its level', () => {
      const originalGame = createAndInitGame();
      const game = setDifficulty(originalGame, 1, originalGame.stepCounts.get(1));
      assert.strictEqual(game.correctChoice, game.correctChoice);
      const updatedGame = guess(game, game.correctChoice);
      assert.strictEqual(updatedGame.level, game.level + 1);
      assert.strictEqual(updatedGame.step, 1);
      assert.strictEqual(updatedGame.lastGuess, game.correctChoice);
      assert.strictEqual(updatedGame.wasLastGuessCorrect, true);
      assert.strictEqual(updatedGame.guessCount, game.guessCount + 1);
      assert.strictEqual(updatedGame.guessCountForCurrentCorrectChoice, game.guessCountForCurrentCorrectChoice + 1);
      assert.strictEqual(updatedGame.shouldRefreshChoices, true);
      assert.strictEqual(updatedGame.shouldRefreshCorrectChoice, true);
    });
  });

  describe('clampDifficulty', () => {
    it('should enforce that the level does not go below its minimum', () => {
      assert.deepEqual(
        clampDifficulty(levels, stepCounts, 0, 1),
        [1, 0]
      );
    });

    it('should enforce that the step does not go below its minimum', () => {
      assert.deepEqual(
        clampDifficulty(levels, stepCounts, 1, -1),
        [1, 0]
      );
    });

    it('should enforce that the level does not go above its maximum', () => {
      assert.deepEqual(
        clampDifficulty(levels, stepCounts, levels.last() + 1, 1),
        [levels.last(), stepCounts.get(levels.last())]
      );
    });

    it('should enforce that the step does not go above its maximum', () => {
      assert.deepEqual(
        clampDifficulty(levels, stepCounts, levels.last(), stepCounts.get(levels.last()) + 1),
        [levels.last(), stepCounts.get(levels.last())]
      );
    });

    it('should increment the level and reset the step when the step exceeds the maximum for the level', () => {
      assert.deepEqual(
        clampDifficulty(levels, stepCounts, levels.first(), stepCounts.get(levels.first()) + 1),
        [levels.first() + 1, 1]
      );
    });

    it('should decrement the level and set the step to the new maximum when the step is lower than the minimum for the level', () => {
      assert.deepEqual(
        clampDifficulty(levels, stepCounts, 2, 0),
        [1, stepCounts.get(1)]
      );
    });
  });

  describe('createLevels', () => {
    it('should create an iterable sequence of levels for a game', () => {
      const levelCount = 12;
      const levels = createLevels(levelCount); // tslint:disable-line:no-shadowed-variable
      assert.equal(levels.first(), 1, 'levels should start counting at 1');
      assert.equal(levels.last(), levelCount);
    });
  });
});
