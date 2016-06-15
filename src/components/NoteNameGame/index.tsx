import * as React from 'react';
import {NoteName} from '../../models/Notes';
import * as NoteNameGameModel from '../../models/NoteNameGame';
import NoteNameChoices from '../NoteNameChoices';
import LevelMap from '../LevelMap';
import pureComponent from '../../utils/pureComponent';
import GameInstructions from '../GameInstructions';
import {GameProps} from '../../types';

interface Props extends GameProps<NoteNameGameModel.State, NoteName> {}

@pureComponent
export default class NoteNameGame extends React.Component<Props, {}> {
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
        <GameInstructions text="Choose the name of the note."/>
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
