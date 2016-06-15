import * as React from 'react';
import NoteNameGame from '../../components/NoteNameGame';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import * as NoteNameGameModel from '../../models/NoteNameGame';
import {NoteName} from '../../models/Notes';
import * as gameActions from '../../actions/gameActions';
import {AppState} from '../../types';

interface SelectedProps {
  gameState: NoteNameGameModel.State;
  isGuessIndicatorEnabled: boolean;
  isInputEnabled: boolean;
}

interface ContainerProps {
  dispatch: Dispatch;
}

interface Props extends SelectedProps, ContainerProps {
}

class NoteNameGamePage extends React.Component<Props, {}> {
  componentDidMount(): void {
    this.props.dispatch(gameActions.present('note-name-game'));
  }

  render(): JSX.Element {
    const {gameState, isGuessIndicatorEnabled, isInputEnabled} = this.props;
    return (
      <div className="page">
        <NoteNameGame gameState={gameState}
          isGuessIndicatorEnabled={isGuessIndicatorEnabled} isInputEnabled={isInputEnabled}
          onGuess={this.doGuess} onSetDifficulty={this.doSetDifficulty}
        />
      </div>
    );
  }

  doGuess = (noteName: NoteName): void => {
    this.props.dispatch(gameActions.guess('note-name-game', noteName));
  };

  doSetDifficulty = (level: number, step: number): void => {
    this.props.dispatch(gameActions.setDifficulty('note-name-game', level, step));
  };
}

// TODO decorator type is broken atm
export default connect((state: AppState): SelectedProps => ({
  gameState: state.games.noteNameGame,
  isGuessIndicatorEnabled: state.games.lastGameGuessed === 'note-name-game',
  isInputEnabled: state.games.isInputEnabled,
}))(NoteNameGamePage);
