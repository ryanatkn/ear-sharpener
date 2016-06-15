import * as React from 'react';
import {NoteName} from '../../models/Notes';
import pureComponent from '../../utils/pureComponent';

import './style.css';

interface Props {
  noteName: NoteName;
  onChoose?(noteName: NoteName): void;
  guessedCorrectly: boolean;
  guessedIncorrectly: boolean;
}

@pureComponent
export default class NoteNameChoice extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {noteName, onChoose, guessedCorrectly, guessedIncorrectly} = this.props;

    let className = 'note-name-choice';
    if (guessedCorrectly) {
      className += ' note-name-choice--correct';
    }
    if (guessedIncorrectly) {
      className += ' note-name-choice--incorrect';
    }
    if (!onChoose) {
      className += ' note-name-choice--disabled';
    }

    return (
      <div className={className} onClick={this.doChoose}>
        <span className="note-name-choice-text">{noteName}</span>
      </div>
    );
  }

  doChoose = (): void => {
    if (this.props.onChoose) {
      this.props.onChoose(this.props.noteName);
    }
  };
}
