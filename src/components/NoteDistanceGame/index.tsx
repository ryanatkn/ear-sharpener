import * as React from 'react';
import * as NoteDistanceGameModel from '../../models/NoteDistanceGame';
import NoteDistanceChoices from '../NoteDistanceChoices';
import GameInstructions from '../GameInstructions';
import LevelMap from '../LevelMap';
import pureComponent from '../../utils/pureComponent';
import {GameProps} from '../../types';

interface Props extends GameProps<NoteDistanceGameModel.State, number> {}

@pureComponent
export default class NoteDistanceGame extends React.Component<Props, {}> {
  // awkward but needed so it can be instantiated generically in ToggleableGame
  static defaultProps = {
    gameState: null as any,
    isGuessIndicatorEnabled: true,
    isInputEnabled: true,
    onGuess: null as any,
    onSetDifficulty: null as any,
  };

  render(): JSX.Element {
    const {gameState, isGuessIndicatorEnabled, isInputEnabled, onGuess,
      onSetDifficulty} = this.props;
    return (
      <div className="game">
        <GameInstructions text="Choose the number of half-steps between the two notes."/>
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
