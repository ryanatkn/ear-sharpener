import {NoteName, noteNames, getSurroundingNoteNames} from '../Notes';
import {playNoteName} from '../Audio';
import * as I from 'immutable';
import * as Game from '../Game';
import * as shuffle from 'lodash/shuffle';
import * as sample from 'lodash/sample';
import * as without from 'lodash/without';
import * as Promiz from 'bluebird';

/**
 * The NoteNameGame has the player guess the name of the notes played.
 * For example `G#0/G#1/G#2/G#3/G#4/G#5/G#6` will play and the player must guess `G`.
 */
export type Guess = NoteName;

export interface IState extends Game.IGameState<Guess> {
  startingNoteName: NoteName;
}

export type State = I.Record.IRecord<IState>;

// Game state values that are needed to initialize other game state values.
const levelCount = noteNames.length - 1;
const levels = Game.createLevels(levelCount);

export const StateRecord = I.Record<IState>({
  // base game state
  name: 'note-name-game',
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
  startingNoteName: 'C',
});

/**
 * Creates a new instance of the game state with valid initial values.
 */
export function create(doc?: IState): State {
  return Game.init(new StateRecord(doc), refreshChoices, refreshCorrectChoice);
}

/**
 * Presents the current state of the game to the player,
 * playing all of the notes with the current name at once.
 */
export function present(game: State): Promise<number> {
  playNoteName(game.correctChoice);
  return Promiz.resolve(1);
}

export function refreshChoices(game: State): State {
  const noteNamesForLevel = getNoteNamesForLevel(game.level, game.startingNoteName);
  const nextChoices = I.List(shuffle(noteNamesForLevel));
  return game.set('choices', nextChoices) as State;
}

export function refreshCorrectChoice(game: State): State {
  const nextCorrectChoice = getNextNoteName(game.choices.toJS(), game.correctChoice);
  return game.set('correctChoice', nextCorrectChoice) as State;
}

function getStepCountForLevel(level: number): number {
  return (level * 2) + 1;
}

/**
 * Gets the list of notes displayed for a particular level and starting note.
 */
function getNoteNamesForLevel(level: number, startingNote: NoteName): NoteName[] {
  const noteCount = getNoteCount(level);
  return getSurroundingNoteNames(startingNote, noteCount);
}

function getNoteCount(level: number): number {
  return Math.min(level + 1, noteNames.length);
}

export function getNextNoteName(
  noteNamesForLevel: NoteName[],
  currentNoteName: NoteName
): NoteName {
  return sample(without(noteNamesForLevel, currentNoteName));
}

export function getPresentDelayAfterGuess(wasCorrect: boolean): number {
  if (__TEST__) {
    return 0;
  } else {
    return wasCorrect ? 500 : 0;
  }
}
