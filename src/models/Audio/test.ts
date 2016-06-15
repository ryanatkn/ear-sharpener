import {playNote, playNoteName, playNotes, loadAllAudio} from './index';
import {Note} from '../Notes';
import {assert} from 'chai';

/**
 * The Audio and HTMLAudioElement objects don't work in Node,
 * and it's not important enough for this project to try a correct solution
 * like jsdom, Phantom, or browser testing, so we'll just use some simple mocks
 * and include some basic smoke tests here.
 */
describe('Audio', () => {
  describe('playNote', () => {
    it('should not blow up', () => {
      playNote('C4');
    });
  });

  describe('playNoteName', () => {
    it('should not blow up', () => {
      playNoteName('C');
    });
  });

  describe('playNotes', () => {
    it('should play the given notes', (): Promise<void> => {
      const notesToPlay: Note[] = ['C4', 'G4', 'C5'];
      return playNotes(notesToPlay, 0)
        .then((notesPlayedCount: number) => {
          assert.equal(notesPlayedCount, notesToPlay.length);
        });
    });

    it('should abort after the second note', (): Promise<void> => {
      const notesToPlayCount = 2;
      let count = 0;
      return playNotes(['C4', 'G4', 'C5'], 0, () => ++count === notesToPlayCount)
        .then((notesPlayedCount: number): void => {
          assert.equal(notesToPlayCount, notesPlayedCount);
        });
    });
  });

  describe('loadAllAudio', () => {
    it('should not blow up', (done: MochaDone) => {
      loadAllAudio().then(() => done());
    });
  });
});
