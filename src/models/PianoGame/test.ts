import {State, StateRecord, create, present, refreshChoices, refreshCorrectChoice} from './index';
import * as Audio from '../Audio';
import {assert} from 'chai';
import {spy} from 'sinon';
import * as I from 'immutable';

describe('PianoGame', () => {
  describe('StateRecord', () => {
    it('does not blow up', () => {
      const game = new StateRecord();
      assert(game.name);
    });
  });

  describe('create', () => {
    it('should not blow up', () => {
      create();
    });
  });

  describe('present', () => {
    it('should play a single note', (): Promise<void> => {
      return present(create().set('correctChoice', 'C1') as State)
        .then((notesPlayedCount: number) => {
          assert.equal(notesPlayedCount, 1);
        });
    });

    it('should play the note of the game state', (): Promise<void> => {
      const note = 'C#3';
      const playNoteSpy = spy(Audio, 'playNote');
      const game = create().set('correctChoice', note) as State;
      return present(game)
        .then(() => {
          assert(playNoteSpy.calledOnce);
          assert(playNoteSpy.calledWith(note));
          playNoteSpy.restore();
        });
    });
  });

  describe('refreshChoices', () => {
    it('should set new choices', () => {
      const game = create();
      const updatedGame = refreshChoices(game);
      assert.notStrictEqual(game.choices, updatedGame.choices); // value may be equal though
    });
  });

  describe('refreshCorrectChoice', () => {
    it('set a new correct choice', () => {
      const choices = I.List.of('B0', 'C1', 'C#1');
      const correctChoice = 'C8';
      const game = create()
        .set('choices', choices)
        .set('correctChoice', correctChoice) as State;
      const updatedGame = refreshCorrectChoice(game);
      assert.notStrictEqual(game.correctChoice, updatedGame.correctChoice);
    });
  });
});
