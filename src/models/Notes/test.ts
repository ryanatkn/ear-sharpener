import {noteNames, notes, isNatural,
  noteIsNoteName, noteToNoteName, noteNameToNote,
  getSurroundingNoteNames, getSurroundingNotes,
  getDistanceBetweenNoteNames, getDistanceBetweenNotes,
  getNoteNameAtDistance, getNoteAtDistance, padOctaves, getIntervalName} from './index';
import * as uniq from 'lodash/uniq';
import {assert} from 'chai';

// tslint:disable:max-line-length

describe('Notes', () => {
  describe('noteNames', () => {
    it('should have 12 unique note names', () => {
      assert.equal(uniq(noteNames).length, 12);
    });
  });

  describe('notes', () => {
    it('should have 88 unique note names', () => {
      assert.equal(uniq(notes).length, 88);
    });
  });

  describe('isNatural', () => {
    it('should return true for naturals', () => {
      assert.strictEqual(isNatural('C'), true);
      assert.strictEqual(isNatural('C3'), true);
      assert.strictEqual(isNatural('G'), true);
      assert.strictEqual(isNatural('G1'), true);
    });

    it('should return false for accidentals', () => {
      assert.strictEqual(isNatural('C#'), false);
      assert.strictEqual(isNatural('C#3'), false);
      assert.strictEqual(isNatural('G#'), false);
      assert.strictEqual(isNatural('G#1'), false);
    });
  });

  describe('noteIsNoteName', () => {
    it('should return true if the note is the note name', () => {
      assert.strictEqual(noteIsNoteName('C3', 'C'), true);
      assert.strictEqual(noteIsNoteName('G#1', 'G#'), true);
    });

    it('should return false if the note is not the note name', () => {
      assert.strictEqual(noteIsNoteName('C3', 'G'), false);
      assert.strictEqual(noteIsNoteName('G#1', 'G'), false);
    });
  });

  describe('noteToNoteName', () => {
    it('should convert notes to their note name', () => {
      assert.equal(noteToNoteName('C3'), 'C');
      assert.equal(noteToNoteName('G#1'), 'G#');
    });
  });

  describe('noteNameToNote', () => {
    it('should convert note names to the note at the given octave', () => {
      assert.strictEqual(noteNameToNote('C', 3), 'C3');
      assert.strictEqual(noteNameToNote('G#', 1), 'G#1');
    });
  });

  describe('getSurroundingNoteNames', () => {
    it('should get the specified number of note names surrounding the given note name', () => {
      assert.deepEqual(getSurroundingNoteNames('C', 4), ['B', 'C', 'C#', 'D']);
      assert.deepEqual(getSurroundingNoteNames('B', 6), ['A', 'A#', 'B', 'C', 'C#', 'D']);
    });
  });

  describe('getSurroundingNotes', () => {
    it('should get the specified number of notes surrounding the given note', () => {
      assert.deepEqual(getSurroundingNotes('A#3', 6), ['G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4']);
      assert.deepEqual(getSurroundingNotes('C1', 7), ['A0', 'A#0', 'B0', 'C1', 'C#1', 'D1', 'D#1']);
    });
  });

  describe('getDistanceBetweenNoteNames', () => {
    it('should get the index distance between note names', () => {
      assert.equal(getDistanceBetweenNoteNames('A', 'G#'), 11);
      assert.equal(getDistanceBetweenNoteNames('C#', 'F'), 4);
      assert.equal(getDistanceBetweenNoteNames('F', 'C#'), 4);
    });
  });

  describe('getDistanceBetweenNotes', () => {
    it('should get the index distance between notes', () => {
      assert.equal(getDistanceBetweenNotes('A3', 'G#3'), 1);
      assert.equal(getDistanceBetweenNotes('A3', 'G#4'), 11);
      assert.equal(getDistanceBetweenNotes('A4', 'A5'), 12);
      assert.equal(getDistanceBetweenNotes('A4', 'A1'), 36);
      assert.equal(getDistanceBetweenNotes('C#5', 'F5'), 4);
      assert.equal(getDistanceBetweenNotes('F5', 'C#5'), 4);
      assert.equal(getDistanceBetweenNotes('C#5', 'F6'), 16);
      assert.equal(getDistanceBetweenNotes('F6', 'C#5'), 16);
    });
  });

  describe('getNoteNameAtDistance', () => {
    it('should get the index distance between note names', () => {
      assert.equal(getNoteNameAtDistance('A', 11, false), 'G#');
      assert.equal(getNoteNameAtDistance('G#', -11, false), 'A');
      assert.equal(getNoteNameAtDistance('C#', 4, false), 'F');
      assert.equal(getNoteNameAtDistance('F', -4, false), 'C#');
    });

    it('should get the index distance between note names randomly before or after', () => {
      assert.include(['G#', 'A#'], getNoteNameAtDistance('A', 11, true));
      assert.include(['G', 'A'], getNoteNameAtDistance('G#', -11, true));
      assert.include(['A', 'F'], getNoteNameAtDistance('C#', 4, true));
      assert.include(['A', 'C#'], getNoteNameAtDistance('F', -4, true));
    });
  });

  describe('getNoteAtDistance', () => {
    it('should get the index distance between notes', () => {
      assert.equal(getNoteAtDistance('G#3', 1, false), 'A3');
      assert.equal(getNoteAtDistance('A3', 11, false), 'G#4');
      assert.equal(getNoteAtDistance('A4', 12, false), 'A5');
      assert.equal(getNoteAtDistance('A4', 36, false), 'A7');
      assert.equal(getNoteAtDistance('C#5', 4, false), 'F5');
      assert.equal(getNoteAtDistance('F5', -4, false), 'C#5');
      assert.equal(getNoteAtDistance('C#4', 16, false), 'F5');
      assert.equal(getNoteAtDistance('F5', -16, false), 'C#4');
    });

    it('should get the index distance between notes randomly before or after', () => {
      assert.include(['G3', 'A3'], getNoteAtDistance('G#3', 1, true));
      assert.include(['A#2', 'G#4'], getNoteAtDistance('A3', 11, true));
      assert.include(['A3', 'A5'], getNoteAtDistance('A4', 12, true));
      assert.include(['A1', 'A7'], getNoteAtDistance('A4', 36, true));
      assert.include(['A4', 'F5'], getNoteAtDistance('C#5', 4, true));
      assert.include(['C#5', 'A5'], getNoteAtDistance('F5', -4, true));
      assert.include(['A2', 'F5'], getNoteAtDistance('C#4', 16, true));
      assert.include(['C#4', 'A6'], getNoteAtDistance('F5', -16, true));
    });
  });

  describe('padOctaves', () => {
    it('should return the full octave around a single note', () => {
      assert.deepEqual(
        padOctaves(['F4'], 'C'),
        ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4']
      );
      assert.deepEqual(
        padOctaves(['F4'], 'A'),
        ['A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4']
      );
    });

    it('should return no unnecessary notes if the given notes fill the octaves', () => {
      assert.deepEqual(
        padOctaves(
          ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'],
          'C'
        ),
        ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4']
      );
      assert.deepEqual(
        padOctaves(
          ['A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4'],
          'A'
        ),
        ['A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4']
      );
    });

    it('should return the full octave before a set of notes that ends with a full octave', () => {
      assert.deepEqual(
        padOctaves(
          ['B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'],
          'C'
        ),
        [
          'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
          'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
        ]
      );
      assert.deepEqual(
        padOctaves(
          ['G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4'],
          'A'
        ),
        [
          'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3',
          'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4',
        ]
      );
    });

    it('should return the full octave after a set of notes that starts with a full octave', () => {
      assert.deepEqual(
        padOctaves(
          ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'],
          'C'
        ),
        [
          'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
          'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
        ]
      );
      assert.deepEqual(
        padOctaves(
          ['A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4'],
          'A'
        ),
        [
          'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4',
          'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5',
        ]
      );
    });

    it('should return the full octaves before and after a set of notes', () => {
      assert.deepEqual(
        padOctaves(
          ['B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'],
          'C'
        ),
        [
          'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
          'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
          'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
        ]
      );
      assert.deepEqual(
        padOctaves(
          ['G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4'],
          'A'
        ),
        [
          'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3',
          'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4',
          'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5',
        ]
      );
    });
  });

  describe('getIntervalName', () => {
    it('should return the name for the interval at the given note distance', () => {
      assert.equal(getIntervalName(0), 'P1');
      assert.equal(getIntervalName(1), 'm2');
      assert.equal(getIntervalName(2), 'M2');
      assert.equal(getIntervalName(3), 'm3');
      assert.equal(getIntervalName(4), 'M3');
      assert.equal(getIntervalName(5), 'P4');
      assert.equal(getIntervalName(6), 'd5');
      assert.equal(getIntervalName(7), 'P5');
      assert.equal(getIntervalName(8), 'm6');
      assert.equal(getIntervalName(9), 'M6');
      assert.equal(getIntervalName(10), 'm7');
      assert.equal(getIntervalName(11), 'M7');

      assert.equal(getIntervalName(12), 'P8');
      assert.equal(getIntervalName(13), 'm9');
      assert.equal(getIntervalName(14), 'M9');
      assert.equal(getIntervalName(15), 'm10');
      assert.equal(getIntervalName(16), 'M10');
      assert.equal(getIntervalName(17), 'P11');
      assert.equal(getIntervalName(18), 'd12');
      assert.equal(getIntervalName(19), 'P12');
      assert.equal(getIntervalName(20), 'm13');
      assert.equal(getIntervalName(21), 'M13');
      assert.equal(getIntervalName(22), 'm14');
      assert.equal(getIntervalName(23), 'M14');

      assert.equal(getIntervalName(24), 'P15');
      assert.equal(getIntervalName(25), 'm16');
      assert.equal(getIntervalName(26), 'M16');
      assert.equal(getIntervalName(27), 'm17');
      assert.equal(getIntervalName(28), 'M17');
      assert.equal(getIntervalName(29), 'P18');
      assert.equal(getIntervalName(30), 'd19');
      assert.equal(getIntervalName(31), 'P19');
      assert.equal(getIntervalName(32), 'm20');
      assert.equal(getIntervalName(33), 'M20');
      assert.equal(getIntervalName(34), 'm21');
      assert.equal(getIntervalName(35), 'M21');
      assert.equal(getIntervalName(36), 'P22');
    });
  });
});
