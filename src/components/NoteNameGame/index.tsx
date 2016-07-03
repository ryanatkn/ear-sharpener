import * as React from 'react';
import {NoteName} from '../../models/Notes';
import * as NoteNameGameModel from '../../models/NoteNameGame';
import NoteNameChoices from '../NoteNameChoices';
import LevelMap from '../LevelMap';
import pureComponent from '../../utils/pureComponent';
import GamePresentButton from '../GamePresentButton';
import {GameProps} from '../../types';

interface Props extends GameProps<NoteNameGameModel.State, NoteName> {}

@pureComponent
export default class NoteNameGame extends React.Component<Props, {}> {
  // the `any` type is unfortunate - see https://github.com/Microsoft/TypeScript/issues/4889
  static defaultProps: any = {
    isGuessIndicatorEnabled: true,
    isInputEnabled: true,
  };

  render(): JSX.Element {
    const {gameState, isGuessIndicatorEnabled, isInputEnabled, onGuess,
      onSetDifficulty, onPresent} = this.props;
    return (
      <div className="game">
        <GamePresentButton isEnabled={isInputEnabled} onClick={onPresent}>
          Choose the name of the note.
        </GamePresentButton>
        <NoteNameChoices noteNameChoices={gameState.choices}
          onChooseNoteName={isInputEnabled ? onGuess : null}
          lastGuess={gameState.lastGuess} wasLastGuessCorrect={gameState.wasLastGuessCorrect}
          isGuessIndicatorEnabled={isGuessIndicatorEnabled}
          guessCount={gameState.guessCount}
        />
        <LevelMap levelCount={gameState.levelCount}
          stepCounts={gameState.stepCounts}
          activeLevel={gameState.level}
          activeStep={gameState.step}
          onSetDifficulty={onSetDifficulty}
        />
      </div>
    );
  }
}
