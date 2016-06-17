import {Note, notes, noteNames, getSurroundingNotes, getDistanceBetweenNotes,
  getNoteAtDistance} from '../Notes';
import {playNotes} from '../Audio';
import * as Game from '../Game';
import * as I from 'immutable';
import * as sample from 'lodash/sample';
import * as range from 'lodash/range';

/**
 * The NoteDistanceGame has the player guess the number of half-steps between two notes.
 * For example, if notes `A4` and then `B4` play, the player must guess `2`.
 */
export type Guess = number;

// All props are optional because Immutable records support default values.
export interface IState extends Game.IGameState<Guess> {
  startingNote: Note;
  currentNote1: Note;
  currentNote2: Note;
}

export type State = I.Record.IRecord<IState>;

// Game state values that are needed to initialize other game state values.
const levelCount = 39; // is three octaves with current algorithm and hardcoded levels
const levels = Game.createLevels(levelCount);

export const StateRecord = I.Record<IState>({
  // base game state
  name: 'note-distance-game',
  levelCount,
  levels,
  stepCounts: I.Map<number, number>(levels.zip(levels.map(getStepCountForLevel))),
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
  // state specific to this game type
  startingNote: 'C4',
  currentNote1: null,
  currentNote2: null,
});

/**
 * Creates a new instance of the game state with valid initial values.
 */
export function create(doc?: IState): State {
  return Game.init(new StateRecord(doc), refreshChoices, refreshCorrectChoice);
}

// A toggle to present notes alternating backwards and forwards.
let presentInReverseOrder = false;

/**
 * Presents the current state of the game to the player,
 * playing the two notes that the player must guess the half-step distance between.
 */
export function present(game: State, shouldAbort: () => boolean): Promise<number> {
  const notesToPlay = [game.currentNote1, game.currentNote2];
  if (presentInReverseOrder) {
    notesToPlay.reverse();
  }
  presentInReverseOrder = !presentInReverseOrder;
  return playNotes(notesToPlay, undefined, shouldAbort);
}

export function refreshChoices(game: State): State {
  const nextChoices = I.List(getDistanceChoices(game.level));
  return game.set('choices', nextChoices) as State;
}

export function refreshCorrectChoice(game: State): State {
  return game.withMutations((newGame: State): void => {
    const notesForLevel = getNotesForLevel(game.level, game.startingNote);
    const [note1, note2] = getNextNotes(notesForLevel, game.choices.toJS());
    newGame.set('currentNote1', note1);
    newGame.set('currentNote2', note2);
    newGame.set('correctChoice', getDistanceBetweenNotes(note1, note2));
  }) as State;
}

function getNextNotes(notesForLevel: Note[], distanceChoices: number[]): [Note, Note] {
  const correctDistance = sample(distanceChoices);
  const note1 = sample(notesForLevel);
  const note2 = getNoteAtDistance(note1, correctDistance);
  return [note1, note2];
}

function getStepCountForLevel(level: number): number {
  return Math.min(Math.floor(level * 1.5) + 2, 24);
}

/**
 * Gets the list of possible notes for a particular level and starting note.
 */
function getNotesForLevel(level: number, startingNote: Note): Note[] {
  return getSurroundingNotes(startingNote, getNoteCount(level));
}

/**
 * The choices for early levels can be hardcoded instead of using an algorithm.
 * If multiple sets of choices are defined for a level, one is randomly chosen each refresh. 
 * If there are no hardcoded values for a level, defaults to the algorithm in `getDistanceChoices`.
 */
const hardcodedDistanceChoicesByLevel: Dict<number[][]> = {
  1: [[1, 12]],
  2: [[1, 4, 12]],
  3: [[4, 7, 12]],
  4: [[2, 4]],
  // algorithm continues from here:
  // 3: [[1, 2]]
  // 4: [[1, 2, 3]]
  // etc
};

const hardcodedLevelCount = Object.keys(hardcodedDistanceChoicesByLevel).length;

function getDistanceChoices(level: number): number[] {
  const hardcodedChoices = hardcodedDistanceChoicesByLevel[level];
  return hardcodedChoices
    ? sample(hardcodedChoices)
    : range(1, getMaxDistance(level - hardcodedLevelCount) + 1);
}

function getNoteCount(level: number): number {
  return Math.min(
    notes.length - 1,
    Math.round((level * noteNames.length / 2) + (noteNames.length / 2))
  );
}

function getMaxDistance(level: number): number {
  return level + 1;
}

export function getPresentDelayAfterGuess(wasCorrect: boolean): number {
  if (__TEST__) {
    return 0;
  } else {
    return wasCorrect ? 500 : 0;
  }
}
