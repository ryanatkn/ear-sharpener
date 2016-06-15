import * as React from 'react';
import * as I from 'immutable';
import NoteDistanceChoice from '../NoteDistanceChoice';
import pureComponent from '../../utils/pureComponent';

import './style.css';

interface Props {
  distanceChoices: I.List<number>;
  lastGuess: number;
  wasLastGuessCorrect: boolean;
  onChooseNoteDistance?(noteDistance: number): void;
  guessCount: number; // used by React components to reset animations
  isGuessIndicatorEnabled: boolean;
}

@pureComponent
export default class NoteDistanceChoices extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {distanceChoices, lastGuess, wasLastGuessCorrect, onChooseNoteDistance,
      guessCount, isGuessIndicatorEnabled} = this.props;
    return (
      <div className="note-distance-choices">
        {distanceChoices.map((noteDistance: number): JSX.Element => {
          const isIndicatorEnabled = lastGuess === noteDistance && isGuessIndicatorEnabled;
          const wasLastGuessAndCorrect = wasLastGuessCorrect && isIndicatorEnabled;
          const wasLastGuessAndIncorrect = !wasLastGuessCorrect && isIndicatorEnabled;
          // Create a special key to reset the guess animations if needed.
          const key = wasLastGuessAndCorrect || wasLastGuessAndIncorrect
            ? (noteDistance + '-' + guessCount)
            : noteDistance;
          return (
            <NoteDistanceChoice key={key} noteDistance={noteDistance}
              onChoose={onChooseNoteDistance}
              guessedCorrectly={wasLastGuessAndCorrect}
              guessedIncorrectly={wasLastGuessAndIncorrect}
            />
          );
        })}
      </div>
    );
  }
}
