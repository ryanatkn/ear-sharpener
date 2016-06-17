import * as React from 'react';
import NoteDistanceGame from '../../components/NoteDistanceGame';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import * as NoteDistanceGameModel from '../../models/NoteDistanceGame';
import * as gameActions from '../../actions/gameActions';
import {AppState} from '../../types';

interface SelectedProps {
  gameState: NoteDistanceGameModel.State;
  isGuessIndicatorEnabled: boolean;
  isInputEnabled: boolean;
}

interface ContainerProps {
  dispatch: Dispatch;
}

interface Props extends SelectedProps, ContainerProps {
}

class NoteDistanceGamePage extends React.Component<Props, {}> {
  componentDidMount(): void {
    this.props.dispatch(gameActions.present('note-distance-game'));
  }

  render(): JSX.Element {
    const {gameState, isGuessIndicatorEnabled, isInputEnabled} = this.props;
    return (
      <div className="page">
        <NoteDistanceGame gameState={gameState}
          isGuessIndicatorEnabled={isGuessIndicatorEnabled} isInputEnabled={isInputEnabled}
          onGuess={this.doGuess} onSetDifficulty={this.doSetDifficulty} onPresent={this.doPresent}
        />
      </div>
    );
  }

  doGuess = (noteDistance: number): void => {
    this.props.dispatch(gameActions.guess('note-distance-game', noteDistance));
  };

  doSetDifficulty = (level: number, step: number): void => {
    this.props.dispatch(gameActions.setDifficulty('note-distance-game', level, step));
  };

  doPresent = (): void => {
    this.props.dispatch(gameActions.present('note-distance-game'));
  };
}

// TODO Redux decorator type is broken atm
export default connect((state: AppState): SelectedProps => ({
  gameState: state.games.noteDistanceGame,
  isGuessIndicatorEnabled: state.games.lastGameGuessed === 'note-distance-game',
  isInputEnabled: state.games.isInputEnabled,
}))(NoteDistanceGamePage);
