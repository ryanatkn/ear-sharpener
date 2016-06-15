import {notes, Note, noteNames, NoteName, noteNameToNote} from '../Notes';
import * as Promiz from 'bluebird';

const VOLUME_FOR_ONE_NOTE = 0.9; // default volume to play individual notes
const VOLUME_FOR_MULTIPLE_NOTES = 0.25; // default volume to play many notes at once
const RAND_DELAY_MIN = 350; // minimum delay when randomized
const RAND_DELAY_MAX = 1000; // maximum delay when randomized

/**
 * Plays a single note at the given volume.
 */
export function playNote(note: Note, volume: number = VOLUME_FOR_ONE_NOTE): void {
  playAudio(getAudioUrl(getFileNameForNote(note)), volume);
}

/**
 * Plays all of the notes of the given note name in concert.
 * For example, if `C` is given, plays C1-8 all at the same time.
 * Uses a lower volume by default because playing a bunch of notes at once is super loud.
 */
export function playNoteName(noteName: NoteName, volume: number = VOLUME_FOR_MULTIPLE_NOTES): void {
  for (const fileName of getFileNamesForNoteName(noteName)) {
    playAudio(getAudioUrl(fileName), volume);
  }
}

/**
 * Plays a series of notes with a fixed delay between each.
 * Returns a promise with the number of notes played
 * when either all notes are played or `shouldAbort` returns true.
 * Does not stop or mute audio that is already playing when aborted.
 */
export function playNotes(
  notes: Note[],
  delay: number = getRandomNoteDelay(),
  shouldAbort?: () => boolean,
  volume?: number
): Promise<number> {
  return Promiz.reduce(
    notes,
    (notesPlayedCount: number, note: Note, index: number) => {
      if (shouldAbort && shouldAbort()) {
        return notesPlayedCount;
      } else {
        playNote(note, volume);
        return index === notes.length - 1
          ? notesPlayedCount + 1 // do not delay after playing the final note
          : Promiz.delay(delay).then((): number => notesPlayedCount + 1);
      }
    },
    0
  );
}

/**
 * Load all of the audio files in parallel.
 */
export function loadAllAudio(): Promise<void[]> {
  return Promiz.map(notes, (note: Note) => loadAudio(getAudioUrl(getFileNameForNote(note))));
}

/**
 * Loads an audio object with `url`, fulfilling the promise when it is loaded and ready to play.
 */
function loadAudio(url: string): Promise<void> {
  return new Promiz((resolve: (value: void) => void): void => {
    const audio = getAudio(url);
    // Quick hack for tests.
    if (__TEST__) {
      resolve(undefined);
    } else {
      function onLoad(): void {
        audio.removeEventListener('loadeddata', onLoad);
        resolve(undefined);
      }
      audio.addEventListener('loadeddata', onLoad);
    }
  });
}

/**
 * Gets a randomized delay to space two notes apart.
 * Randomized a bit to keep the player's ears on their toes.
 */
function getRandomNoteDelay(): number {
  return __TEST__ ? 0 : RAND_DELAY_MIN + (Math.random() * (RAND_DELAY_MAX - RAND_DELAY_MIN));
}

/**
 * A pre-computed dictionary of each note to its file name.
 * {[note]: fileName, ...}
 */
const fileNameByNote: Dict<string> = notes.reduce(
  (result: Dict<string>, note: Note) => {
    result[note] = deriveFileNameForNote(note);
    return result;
  },
  {} as Dict<string>
);

/**
 * Computes the file name of a note based on the file naming conventions.
 */
function deriveFileNameForNote(note: Note): string {
  return  `${notes.indexOf(note) + 1}-${note.replace('#', '-').toLowerCase()}.mp3`;
}

/**
 * Type-safe accessor to `fileNameByNote`.
 * Wouldn't be needed if TypeScript allowed string literal index types.
 */
function getFileNameForNote(note: Note): string {
  return fileNameByNote[note];
}

/**
 * A pre-computed dictionary of each note name to its file names.
 * {[noteName]: [fileName1, fileName2, ...], ...}
 */
const fileNamesByNoteName: Dict<string[]> = noteNames.reduce(
  (result: Dict<string[]>, noteName: NoteName) => {
    result[noteName] = deriveFileNamesForNoteName(noteName);
    return result;
  },
  {} as Dict<string[]>
);

/**
 * Creates an array of file names representing the piano notes for the given note name.
 * For example, if `C` is given, returns the file names for C1-8.
 */
function deriveFileNamesForNoteName(noteName: NoteName): string[] {
  const fileNames: string[] = [];
  for (let i = 0; i <= 8; i++) { // cover the whole piano, overflowing beyond the edges
    const note = noteNameToNote(noteName, i); // may be an invalid note
    if (notes.indexOf(note) !== -1) { // ignore if the note is invalid
      fileNames.push(getFileNameForNote(note));
    }
  }
  return fileNames;
}

/**
 * Type-safe accessor to `fileNamesByNoteName`.
 * Wouldn't be needed if TypeScript allowed string literal index types.
 */
function getFileNamesForNoteName(noteName: NoteName): string[] {
  return fileNamesByNoteName[noteName];
}

/**
 * Audio objects are created once and cached in this global.
 */
const audioCache: Dict<HTMLAudioElement> = {};

/**
 * Gets an audio object by url, pulling from the cache if available,
 * and creating and caching it if not.
 */
function getAudio(url: string): HTMLAudioElement {
  return audioCache[url]
    || (audioCache[url] = createAudio(url));
}

/**
 * Plays audio `url` at `volume`.
 * If the audio is already playing, it restarts it from the beginning.
 */
function playAudio(url: string, volume: number = 1.0): void {
  const audio = getAudio(url);
  audio.volume = volume;
  if (audio.paused) {
    audio.play();
  } else {
    audio.currentTime = 0;
  }
}

/**
 * Creates a full audio url from a file name. Only implemented for piano notes.
 */
function getAudioUrl(fileName: string): string {
  // quick hack for gh-pages - right now these are the only assets loaded outside of `index.html`
  return `${__PROD__ ? '/ear-sharpener' : ''}/static/audio/notes/${fileName}`;
}

/**
 * Creates an audio object. Returns a mock in test mode.
 */
function createAudio(url: string): HTMLAudioElement {
  return __TEST__
    ? mockAudio(url)
    : new Audio(url);
}

/**
 * Mock audio for testing in Node. Implements noops for only the stuff we need to pass tests.
 * See `./test.ts` for a discussion of why this is hacked together rather than testing correctly.
 */
function mockAudio(url: string): HTMLAudioElement {
  return {
    src: url,
    play: Function.prototype,
    paused: true,
    volume: 1.0,
    currentTime: 0,
  } as any;
}
