import * as React from 'react';
import {Note} from '../../models/Notes';
import * as PianoGameModel from '../../models/PianoGame';
import Piano from '../Piano';
import LevelMap from '../LevelMap';
import pureComponent from '../../utils/pureComponent';
import GamePresentButton from '../GamePresentButton';
import {playNote} from '../../models/Audio';
import {GameProps} from '../../types';

interface Props extends GameProps<PianoGameModel.State, Note> {}

@pureComponent
export default class PianoGame extends React.Component<Props, {}> {
  // awkward but needed so it can be instantiated generically in ToggleableGame
  // see https://github.com/Microsoft/TypeScript/issues/3960
  static defaultProps = {
    gameState: null as any,
    isGuessIndicatorEnabled: true,
    isInputEnabled: true,
    onGuess: null as any,
    onSetDifficulty: null as any,
    onPresent: null as any,
  };

  render(): JSX.Element {
    const {gameState, isGuessIndicatorEnabled, isActive, isInputEnabled,
      onSetDifficulty, onPresent} = this.props;
    return (
      <div className="game">
        <GamePresentButton isEnabled={isInputEnabled} onClick={onPresent}>
          Play back the note.
        </GamePresentButton>
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
