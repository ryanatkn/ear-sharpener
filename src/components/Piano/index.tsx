import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as I from 'immutable';
import {Note, isNatural} from '../../models/Notes';
import PianoKey from '../PianoKey';
import pureComponent from '../../utils/pureComponent';

import './style.css';

interface Props {
  notes: I.List<Note>;
  lastGuess: Note;
  wasLastGuessCorrect: boolean;
  guessCount: number; // used by React components to reset animations
  isActive?: boolean; // used to make sure the piano resizes when a parent's display css is toggled
  onPressKey?(note: Note): void;
  isGuessIndicatorEnabled?: boolean;
}

interface State {
  pianoWrapperWidth: number;
}

const UNRENDERED_PIANO_WIDTH = -1;
const MAX_KEY_WIDTH = 50;
const MAX_KEY_HEIGHT = 150;
const BLACK_KEY_WIDTH_MULT = 0.7;
const BLACK_KEY_HEIGHT_MULT = 0.7;

@pureComponent
export default class Piano extends React.Component<Props, State> {

  static defaultProps = {
    isActive: true,
    isGuessIndicatorEnabled: true,
  };

  state = {pianoWrapperWidth: UNRENDERED_PIANO_WIDTH};

  componentDidMount(): void {
    this.listenToResize();
    this.updatePianoWrapperWidth();
  }

  componentDidUpdate(): void {
    this.updatePianoWrapperWidth();
  }

  componentWillUnmount(): void {
    this.unlistenToResize();
  }

  render(): JSX.Element {
    const {notes, lastGuess, wasLastGuessCorrect, onPressKey, guessCount,
      isGuessIndicatorEnabled} = this.props;
    const {pianoWrapperWidth} = this.state;
    const totalNaturalNoteCount = notes.reduce(
      (count: number, note: Note): number => {
        return isNatural(note) ? count + 1 : count;
      },
      0
    );
    const keyWidth = Math.min(
      MAX_KEY_WIDTH,
      Math.floor((pianoWrapperWidth - 2) / totalNaturalNoteCount) // -2 for border
    );
    const keyHeight = MAX_KEY_HEIGHT * (keyWidth / MAX_KEY_WIDTH);
    const blackKeyWidth = Math.floor(keyWidth * BLACK_KEY_WIDTH_MULT);
    const blackKeyHeight = keyHeight * BLACK_KEY_HEIGHT_MULT;
    const pianoWidth = totalNaturalNoteCount * keyWidth;
    let naturalNoteCount = 0;
    let sharpNoteCount = 0;
    return (
      <div className="piano">
        <div className="piano-keys" style={{height: keyHeight}}>
          {pianoWrapperWidth === UNRENDERED_PIANO_WIDTH
            ? null
            : notes.map((note: Note): JSX.Element => {
                let finalKeyWidth: number;
                let finalKeyHeight: number;
                const noteIsNatural = isNatural(note);
                if (noteIsNatural) {
                  finalKeyWidth = keyWidth;
                  finalKeyHeight = keyHeight;
                } else {
                  finalKeyWidth = blackKeyWidth;
                  finalKeyHeight = blackKeyHeight;
                }
                const leftOffset = (noteIsNatural
                  ? naturalNoteCount * keyWidth
                  : naturalNoteCount * keyWidth - blackKeyWidth / 2)
                  + (pianoWrapperWidth / 2)
                  - (pianoWidth / 2);
                if (noteIsNatural) {
                  naturalNoteCount++;
                } else {
                  sharpNoteCount++;
                }
                const isIndicatorEnabled = lastGuess === note && isGuessIndicatorEnabled;
                const wasLastGuessAndCorrect = wasLastGuessCorrect && isIndicatorEnabled;
                const wasLastGuessAndIncorrect = !wasLastGuessCorrect && isIndicatorEnabled;
                // Create a special key to reset the incorrect guess animation.
                const key = wasLastGuessAndCorrect || wasLastGuessAndIncorrect
                  ? (note + guessCount)
                  : note;
                return (
                  <PianoKey key={key} note={note} onPress={onPressKey}
                    leftOffset={leftOffset} width={finalKeyWidth} height={finalKeyHeight}
                    guessedCorrectly={wasLastGuessAndCorrect}
                    guessedIncorrectly={wasLastGuessAndIncorrect}
                  />
                );
              })
          }
        </div>
      </div>
    );
  }

  listenToResize(): void {
    window.addEventListener('resize', this.updatePianoWrapperWidth);
  }

  unlistenToResize(): void {
    window.removeEventListener('resize', this.updatePianoWrapperWidth);
  }

  updatePianoWrapperWidth = (): void => {
    const node = ReactDom.findDOMNode(this);
    // this is a `pureComponent` so this won't cause unnecessary re-renders
    this.setState({pianoWrapperWidth: node.clientWidth});
  };
}
