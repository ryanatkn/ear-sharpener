import * as React from 'react';
import * as NoteDistanceGameModel from '../../models/NoteDistanceGame';
import NoteDistanceChoices from '../NoteDistanceChoices';
import GamePresentButton from '../GamePresentButton';
import LevelMap from '../LevelMap';
import pureComponent from '../../utils/pureComponent';
import {GameProps} from '../../types';

interface Props extends GameProps<NoteDistanceGameModel.State, number> {}

@pureComponent
export default class NoteDistanceGame extends React.Component<Props, {}> {
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
          Choose the number of semitones between the two notes.
        </GamePresentButton>
        <NoteDistanceChoices distanceChoices={gameState.choices}
          onChooseNoteDistance={isInputEnabled ? onGuess : null}
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
