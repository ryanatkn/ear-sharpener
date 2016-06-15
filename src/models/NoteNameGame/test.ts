import {State, StateRecord, create, present, refreshChoices, refreshCorrectChoice} from './index';
import * as Audio from '../Audio';
import {assert} from 'chai';
import {spy} from 'sinon';
import * as I from 'immutable';

describe('NoteNameGame', () => {
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
      return present(create().set('correctChoice', 'C') as State)
        .then((notesPlayedCount: number) => {
          assert.equal(notesPlayedCount, 1);
        });
    });

    it('should play the note name of the game state', (): Promise<void> => {
      const noteName = 'C';
      const playNoteNameSpy = spy(Audio, 'playNoteName');
      const game = create().set('correctChoice', noteName) as State;
      return present(game)
        .then(() => {
          assert(playNoteNameSpy.calledOnce);
          assert(playNoteNameSpy.calledWith(noteName));
          playNoteNameSpy.restore();
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
      const choices = I.List.of('B', 'C', 'C#');
      const correctChoice = 'G#';
      const game = create()
        .set('choices', choices)
        .set('correctChoice', correctChoice) as State;
      const updatedGame = refreshCorrectChoice(game);
      assert.notStrictEqual(game.correctChoice, updatedGame.correctChoice);
    });
  });
});
