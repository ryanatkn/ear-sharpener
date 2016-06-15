import * as React from 'react';
import * as I from 'immutable';
import {NoteName} from '../../models/Notes';
import NoteNameChoice from '../NoteNameChoice';
import pureComponent from '../../utils/pureComponent';

import './style.css';

interface Props {
  noteNameChoices: I.List<NoteName>;
  lastGuess: NoteName;
  wasLastGuessCorrect: boolean;
  onChooseNoteName?(noteName: NoteName): void;
  guessCount: number; // used by React components to reset animations
  isGuessIndicatorEnabled: boolean;
}

@pureComponent
export default class NoteNameChoices extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {noteNameChoices, lastGuess, wasLastGuessCorrect, onChooseNoteName,
      guessCount, isGuessIndicatorEnabled} = this.props;
    return (
      <div className="note-name-choices">
        {noteNameChoices.map((noteName: NoteName): JSX.Element => {
          const isIndicatorEnabled = lastGuess === noteName && isGuessIndicatorEnabled;
          const wasLastGuessAndCorrect = wasLastGuessCorrect && isIndicatorEnabled;
          const wasLastGuessAndIncorrect = !wasLastGuessCorrect && isIndicatorEnabled;
          // Create a special key to reset the guess animations if needed.
          const key = wasLastGuessAndCorrect || wasLastGuessAndIncorrect
            ? (noteName + guessCount)
            : noteName;
          return (
            <NoteNameChoice key={key} noteName={noteName} onChoose={onChooseNoteName}
              guessedCorrectly={wasLastGuessAndCorrect}
              guessedIncorrectly={wasLastGuessAndIncorrect}
            />
          );
        })}
      </div>
    );
  }
}
