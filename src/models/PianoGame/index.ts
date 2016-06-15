import {Note, notes, getSurroundingNotes, padOctaves} from '../Notes';
import {playNote} from '../Audio';
import * as I from 'immutable';
import * as Game from '../Game';
import * as sample from 'lodash/sample';
import * as without from 'lodash/without';
import * as Promiz from 'bluebird';

/**
 * The PianoGame has the player find the played note on the piano.
 * For example `C#5` will play and the player must find the key and play it back.
 */
export type Guess = Note;

export interface IState extends Game.IGameState<Guess> {
  startingNote: Note;
}

export type State = I.Record.IRecord<IState>;

// Game state values that are needed to initialize other game state values.
const levelCount = notes.length - 2;
const levels = Game.createLevels(levelCount);

export const StateRecord = I.Record<IState>({
  // base game state
  name: 'piano-game',
  levelCount,
  levels,
  stepCounts: I.Map<number, number>(levels.zip(levels.map(getStepCountForLevel))),
  level: undefined,
  step: undefined,
  choices: undefined,
  correctChoice: undefined,
  lastGuess: undefined,
  wasLastGuessCorrect: undefined,
  guessCount: undefined,
  guessCountForCurrentCorrectChoice: undefined,
  shouldRefreshChoices: undefined,
  shouldRefreshCorrectChoice: undefined,
  refreshChoicesCount: undefined,
  refreshCorrectChoiceCount: undefined,
  // state specific to this game type
  startingNote: 'C4',
});

/**
 * Creates a new instance of the game state with valid initial values.
 */
export function create(doc?: IState): State {
  return Game.init(new StateRecord(doc), refreshChoices, refreshCorrectChoice);
}

/**
 * Presents the current state of the game to the player,
 * playing the note the player must find on the piano.
 */
export function present(game: State): Promise<number> {
  playNote(game.correctChoice);
  return Promiz.resolve(1);
}

export function refreshChoices(game: State): State {
  const notesForLevel = getNotesForLevel(game.level, game.startingNote);
  const nextChoices = I.List(getChoices(notesForLevel));
  return game.set('choices', nextChoices) as State;
}

export function refreshCorrectChoice(game: State): State {
  const notesForLevel = getNotesForLevel(game.level, game.startingNote);
  const nextCorrectChoice = getNextNote(notesForLevel, game.correctChoice);
  return game.set('correctChoice', nextCorrectChoice) as State;
}

function getStepCountForLevel(level: number): number {
  return Math.min(level + 2, 10);
}

/**
 * Gets the list of notes displayed for a particular level and starting note.
 */
function getNotesForLevel(level: number, startingNote: Note): Note[] {
  return getSurroundingNotes(startingNote, getNoteCount(level));
}

export function getChoices(notesForLevel: Note[]): Note[] {
  return padOctaves(notesForLevel);
}

function getNoteCount(level: number): number {
  return Math.min(level + 2, notes.length);
}

export function getNextNote(notesForLevel: Note[], currentNote: Note): Note {
  return sample(without(notesForLevel, currentNote));
}

export function getPresentDelayAfterGuess(): number {
  if (__TEST__) {
    return 0;
  } else {
    return 1000;
  }
}
