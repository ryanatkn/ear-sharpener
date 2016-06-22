import {getSurroundingItems, getDistanceBetweenItems,
  getItemAtDistance, getItemBefore} from '../../utils/arrayHelpers';

/**
 * The 12 musical notes of the chromatic scale are given the type `NoteName`.
 * For simplicity, sharps♯ are used and flats♭ are not.
 * The hash character `#` is used instead of the sharp character `♯`.
 */
export type NoteName = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';

/**
 * Each element of type `NoteName`.
 * Would be nice if TypeScript let us compute this from the type like you can with enums.
 */
export const noteNames: NoteName[] = [
  'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
];

/**
 * All of the notes of a modern 88 key piano, A0 through C8.
 */
export type Note =                                                    'A0' | 'A#0' | 'B0'
  | 'C1' | 'C#1' | 'D1' | 'D#1' | 'E1' | 'F1' | 'F#1' | 'G1' | 'G#1'| 'A1' | 'A#1' | 'B1'
  | 'C2' | 'C#2' | 'D2' | 'D#2' | 'E2' | 'F2' | 'F#2' | 'G2' | 'G#2'| 'A2' | 'A#2' | 'B2'
  | 'C3' | 'C#3' | 'D3' | 'D#3' | 'E3' | 'F3' | 'F#3' | 'G3' | 'G#3'| 'A3' | 'A#3' | 'B3'
  | 'C4' | 'C#4' | 'D4' | 'D#4' | 'E4' | 'F4' | 'F#4' | 'G4' | 'G#4'| 'A4' | 'A#4' | 'B4'
  | 'C5' | 'C#5' | 'D5' | 'D#5' | 'E5' | 'F5' | 'F#5' | 'G5' | 'G#5'| 'A5' | 'A#5' | 'B5'
  | 'C6' | 'C#6' | 'D6' | 'D#6' | 'E6' | 'F6' | 'F#6' | 'G6' | 'G#6'| 'A6' | 'A#6' | 'B6'
  | 'C7' | 'C#7' | 'D7' | 'D#7' | 'E7' | 'F7' | 'F#7' | 'G7' | 'G#7'| 'A7' | 'A#7' | 'B7'
  | 'C8';

/**
 * Each element of type `Note`.
 * Would be nice if TypeScript let us compute this from the type like you can with enums.
 */
export const notes: Note[] = [
                                                            'A0', 'A#0', 'B0',
  'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
  'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
  'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
  'C8',
 ];

/**
 * Notes and note names are either natural, like `C`, or accidental/sharp/flat, like `C#`.
 */
export function isNatural(note: Note|NoteName): boolean {
  return note[1] !== '#';
}

/**
 * Indicates if the given note is of the given note name.
 * For example, note `C3` is note name `C`, but `C#3` is not note name `C`.  
 */
export function noteIsNoteName(note: Note, noteName: NoteName): boolean {
  return noteToNoteName(note) === noteName;
}

/**
 * Converts the given note to its note name, stripping the octave.
 */
export function noteToNoteName(note: Note): NoteName {
  return note.slice(0, note.length - 1) as NoteName;
}

/**
 * Converts the given note name a note at the given octave.
 */
export function noteNameToNote(noteName: NoteName, octave: number): Note {
  return noteName + octave as Note;
}

/**
 * Gets N note names around `noteName`, alternating after and before.
 * For example, getting 4 note names around 'C' should return ['B', 'C', 'C#' 'D'].
 */
export function getSurroundingNoteNames(noteName: NoteName, count: number): NoteName[] {
  return getSurroundingItems(noteNames, noteName, count);
}

/**
 * Gets N notes around `note`, alternating after and before.
 * For example, getting 4 notes around 'C3' should return ['B3', 'C3', 'C#3' 'D3'].
 */
export function getSurroundingNotes(note: Note, count: number): Note[] {
  return getSurroundingItems(notes, note, count);
}

/**
 * Gets the index distance between two note names.
 */
export function getDistanceBetweenNoteNames(noteName1: NoteName, noteName2: NoteName): number {
  return getDistanceBetweenItems(noteNames, noteName1, noteName2);
}

/**
 * Gets the index distance between two notes.
 */
export function getDistanceBetweenNotes(note1: Note, note2: Note): number {
  return getDistanceBetweenItems(notes, note1, note2);
}

/**
 * Gets the note name at `distance` from `noteName`.
 */
export function getNoteNameAtDistance(
  noteName: NoteName,
  distance: number,
  randomizeDirection: boolean = true
): NoteName {
  return getItemAtDistance(noteNames, noteName, distance, randomizeDirection);
}

/**
 * Gets the note at `distance` from `note`.
 */
export function getNoteAtDistance(
  note: Note,
  distance: number,
  randomizeDirection: boolean = true
): Note {
  return getItemAtDistance(notes, note, distance, randomizeDirection);
}

/**
 * Returns the minimum full octaves that include all of `aroundNotes`,
 * beginning at C and ending at B.
 * For example, given [B#3, ..., C4], returns [C2, ..., B5]
 */
export function padOctaves(aroundNotes: Note[], octaveStartingNoteName: NoteName = 'C'): Note[] {
  return notesInOctaveBefore(aroundNotes[0], octaveStartingNoteName)
    .concat(aroundNotes)
    .concat(notesInOctaveAfter(aroundNotes[aroundNotes.length - 1], octaveStartingNoteName));
}

/**
 * Gets the notes before `note` down to and including the next `octaveStartingNoteName`.
 */
function notesInOctaveBefore(note: Note, octaveStartingNoteName: NoteName): Note[] {
  const startIndex = notes.indexOf(findNextNoteBefore(note, octaveStartingNoteName));
  const endIndex = notes.indexOf(note);
  return notes.slice(startIndex, endIndex);
}

/**
 * Gets the notes after `note` up to and excluding the next `octaveStartingNoteName`.
 */
function notesInOctaveAfter(note: Note, octaveStartingNoteName: NoteName): Note[] {
  const startIndex = notes.indexOf(note) + 1;
  const octaveEndingNoteName = getItemBefore(noteNames, octaveStartingNoteName);
  const endIndex = notes.indexOf(findNextNoteAfter(note, octaveEndingNoteName)) + 1;
  return notes.slice(startIndex, endIndex);
}

/**
 * Finds the next instance of `downToNoteName` before and including `note`.
 * For example, if `note=A4` and `downToNoteName=B`, returns `B3`.
 */
function findNextNoteBefore(note: Note, downToNoteName: NoteName): Note {
  let index = notes.indexOf(note);
  while (true) {
    const currentNote = notes[index];
    if (noteIsNoteName(currentNote, downToNoteName)) {
      return currentNote;
    }
    index--;
    if (index < 0) {
      return notes[0];
    }
  }
}

/**
 * Finds the next instance of `upToNoteName` after and including `note`.
 * For example, if `note=B4` and `upToNoteName=A`, returns `A5`.
 */
function findNextNoteAfter(note: Note, upToNoteName: NoteName): Note {
  let index = notes.indexOf(note);
  while (true) {
    const currentNote = notes[index];
    if (noteIsNoteName(currentNote, upToNoteName)) {
      return currentNote;
    }
    index++;
    if (index === notes.length) {
      return notes[notes.length - 1];
    }
  }
}

/**
 * Gets the interval name for the number of semitones between two notes.
 */
export function getIntervalName(noteDistance: number): string {
  const semitoneIndex = Math.abs(noteDistance % 12); // starts at 0
  const octaveIndex = Math.abs(Math.floor(noteDistance / 12)); // starts at 0
  const octaveOffset = octaveIndex * 7;
  switch (semitoneIndex) {
    case 0:
      return 'P' + (1 + octaveOffset);
    case 1:
      return 'm' + (2 + octaveOffset);
    case 2:
      return 'M' + (2 + octaveOffset);
    case 3:
      return 'm' + (3 + octaveOffset);
    case 4:
      return 'M' + (3 + octaveOffset);
    case 5:
      return 'P' + (4 + octaveOffset);
    case 6:
      return 'd' + (5 + octaveOffset);
    case 7:
      return 'P' + (5 + octaveOffset);
    case 8:
      return 'm' + (6 + octaveOffset);
    case 9:
      return 'M' + (6 + octaveOffset);
    case 10:
      return 'm' + (7 + octaveOffset);
    case 11:
      return 'M' + (7 + octaveOffset);
    default:
      throw new Error('Logic error in `getIntervalName`');
  }
}
