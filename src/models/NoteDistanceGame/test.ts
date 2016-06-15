import {State, StateRecord, create, present, refreshChoices, refreshCorrectChoice} from './index';
import * as Audio from '../Audio';
import {assert} from 'chai';
import {spy} from 'sinon';
import * as I from 'immutable';

describe('NoteDistanceGame', () => {
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
    it('should play two notes', (): Promise<void> => {
      return present(
        create()
          .set('currentNote1', 'C1')
          .set('currentNote2', 'C2') as State,
        () => false
      )
        .then((notesPlayedCount: number) => {
          assert.equal(notesPlayedCount, 2);
        });
    });

    it('should play the notes of the game state', (): Promise<void> => {
      const note1 = 'C#3';
      const note2 = 'B1';
      const playNotesSpy = spy(Audio, 'playNotes');
      const game = create()
        .set('currentNote1', note1)
        .set('currentNote2', note2) as State;
      return present(game, () => false)
        .then(() => {
          assert(playNotesSpy.calledOnce);
          assert.sameMembers(playNotesSpy.firstCall.args[0], [note1, note2]);
          playNotesSpy.restore();
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
      const choices = I.List.of(1, 2, 3);
      const correctChoice = 80;
      const note1 = 'C1';
      const note2 = 'C8';
      const game = create()
        .set('choices', choices)
        .set('correctChoice', correctChoice)
        .set('currentNote1', note1)
        .set('currentNote2', note2) as State;
      const updatedGame = refreshCorrectChoice(game);
      assert.notStrictEqual(game.correctChoice, updatedGame.correctChoice);
      assert.notStrictEqual(updatedGame.currentNote1, note1);
      assert.notStrictEqual(updatedGame.currentNote2, note2);
    });
  });
});
