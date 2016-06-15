import * as React from 'react';
import PianoGame from '../../components/PianoGame';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import * as PianoGameModel from '../../models/PianoGame';
import {Note} from '../../models/Notes';
import * as gameActions from '../../actions/gameActions';
import {AppState} from '../../types';

interface SelectedProps {
  gameState: PianoGameModel.State;
  isGuessIndicatorEnabled: boolean;
  isInputEnabled: boolean;
}

interface ContainerProps {
  dispatch: Dispatch;
}

interface Props extends SelectedProps, ContainerProps {
}

class PianoGamePage extends React.Component<Props, {}> {
  componentDidMount(): void {
    this.props.dispatch(gameActions.present('piano-game'));
  }

  render(): JSX.Element {
    const {gameState, isGuessIndicatorEnabled, isInputEnabled} = this.props;
    return (
      <div className="page">
        <PianoGame gameState={gameState}
          isGuessIndicatorEnabled={isGuessIndicatorEnabled} isInputEnabled={isInputEnabled}
          onGuess={this.doGuess} onSetDifficulty={this.doSetDifficulty}
        />
      </div>
    );
  }

  doGuess = (note: Note): void => {
    this.props.dispatch(gameActions.guess('piano-game', note));
  };

  doSetDifficulty = (level: number, step: number): void => {
    this.props.dispatch(gameActions.setDifficulty('piano-game', level, step));
  };
}

// TODO decorator type is broken atm
export default connect((state: AppState): SelectedProps => ({
  gameState: state.games.pianoGame,
  isGuessIndicatorEnabled: state.games.lastGameGuessed === 'piano-game',
  isInputEnabled: state.games.isInputEnabled,
}))(PianoGamePage);
