import * as React from 'react';
import {Note} from '../../models/Notes';
import * as PianoGameModel from '../../models/PianoGame';
import Piano from '../Piano';
import LevelMap from '../LevelMap';
import pureComponent from '../../utils/pureComponent';
import GameInstructions from '../GameInstructions';
import {playNote} from '../../models/Audio';
import {GameProps} from '../../types';

interface Props extends GameProps<PianoGameModel.State, Note> {}

@pureComponent
export default class PianoGame extends React.Component<Props, {}> {
  // awkward but needed so it can be instantiated generically in ToggleableGame
  static defaultProps = {
    gameState: null as any,
    isGuessIndicatorEnabled: true,
    isInputEnabled: true,
    onGuess: null as any,
    onSetDifficulty: null as any,
  };

  render(): JSX.Element {
    const {gameState, isGuessIndicatorEnabled, isActive, isInputEnabled,
      onSetDifficulty} = this.props;
    return (
      <div className="game">
        <GameInstructions text="Play back the note."/>
        <Piano notes={gameState.choices}
          onPressKey={isInputEnabled ? this.doGuess : null}
          lastGuess={gameState.lastGuess} wasLastGuessCorrect={gameState.wasLastGuessCorrect}
          isGuessIndicatorEnabled={isGuessIndicatorEnabled}
          guessCount={gameState.guessCount} isActive={isActive}
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

  doGuess = (note: Note): void => {
    playNote(note, undefined, 'pianoFeedback');
    this.props.onGuess(note);
  };
}
