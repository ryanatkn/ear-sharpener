import * as React from 'react';
import {Note, isNatural} from '../../models/Notes';
import pureComponent from '../../utils/pureComponent';

import './style.css';

interface Props {
  note: Note;
  leftOffset: number;
  width: number;
  height: number;
  guessedCorrectly: boolean;
  guessedIncorrectly: boolean;
  onPress?(note: Note): void;
}

@pureComponent
export default class PianoKey extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {note, leftOffset, width, height, guessedCorrectly, guessedIncorrectly,
      onPress} = this.props;
    const noteIsNatural = isNatural(note);

    let className = 'piano-key';
    if (guessedCorrectly) {
      className += ' piano-key--correct';
    }
    if (guessedIncorrectly) {
      className += ' piano-key--incorrect';
    }
    if (noteIsNatural) {
      className += ' piano-key--white';
    } else {
      className += ' piano-key--black';
    }
    if (!onPress) {
      className += ' piano-key--disabled';
    }

    const style: React.CSSProperties = {
      left: leftOffset,
      height,
      width,
    };

    return (
      <div className={className} onClick={this.doPress} style={style}>
      </div>
    );
  }

  doPress = (): void => {
    if (this.props.onPress) {
      this.props.onPress(this.props.note);
    }
  };
}
