import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import * as gameActions from '../../actions/gameActions';
import * as comboGameActions from '../../actions/comboGameActions';
import {AppState} from '../../types';
import PianoGame from '../../components/PianoGame';
import NoteNameGame from '../../components/NoteNameGame';
import NoteDistanceGame from '../../components/NoteDistanceGame';
import ToggleableGame from '../../components/ToggleableGame';
import {GameName, GameGuess, GameProps} from '../../types';
import {GameState} from '../../models/Game';
import * as PianoGameModel from '../../models/PianoGame';
import * as NoteNameGameModel from '../../models/NoteNameGame';
import * as NoteDistanceGameModel from '../../models/NoteDistanceGame';

interface SelectedProps {
  activeGameName: GameName;
  isGuessIndicatorEnabled: boolean;
  isInputEnabled: boolean;
  pianoGameState: PianoGameModel.State;
  noteNameGameState: NoteNameGameModel.State;
  noteDistanceGameState: NoteDistanceGameModel.State;
}

interface Props extends SelectedProps {
  dispatch: Dispatch;
}

class ComboGamePage extends React.Component<Props, {}> {
  componentDidMount(): void {
    this.props.dispatch(gameActions.present(this.props.activeGameName));
  }

  renderToggleableGame(gameName: GameName): JSX.Element {
    const {activeGameName, isGuessIndicatorEnabled, isInputEnabled} = this.props;
    return (
      <ToggleableGame
        GameComponent={getGameComponent(gameName)}
        isVisible={gameName === activeGameName}
        gameState={getGameState(gameName, this.props)}
        isGuessIndicatorEnabled={isGuessIndicatorEnabled}
        isInputEnabled={isInputEnabled}
        onGuess={this.onGuess}
        onSetDifficulty={this.doSetDifficulty}
        onPresent={this.doPresent}
      />
    );
  }

  render(): JSX.Element {
    return (
      <div className="page">
        {this.renderToggleableGame('piano-game')}
        {this.renderToggleableGame('note-distance-game')}
        {this.renderToggleableGame('note-name-game')}
      </div>
    );
  }

  onGuess = (guess: GameGuess): void => {
    this.props.dispatch(comboGameActions.guess(this.props.activeGameName, guess));
  };

  doSetDifficulty = (level: number, step: number): void => {
    this.props.dispatch(gameActions.setDifficulty(this.props.activeGameName, level, step));
  };

  doPresent = (): void => {
    this.props.dispatch(gameActions.present(this.props.activeGameName));
  };
}

// TODO Redux decorator type is broken atm
export default connect((state: AppState): SelectedProps => ({
  activeGameName: state.comboGame.activeGame,
  isGuessIndicatorEnabled: state.comboGame.activeGame === state.games.lastGameGuessed,
  isInputEnabled: state.games.isInputEnabled,
  pianoGameState: state.games.pianoGame,
  noteNameGameState: state.games.noteNameGame,
  noteDistanceGameState: state.games.noteDistanceGame,
}))(ComboGamePage);

function getGameComponent(gameName: GameName): React.ComponentClass<GameProps<any, any>> {
  switch (gameName) {
    case 'piano-game':
      return PianoGame;
    case 'note-distance-game':
      return NoteDistanceGame;
    case 'note-name-game':
      return NoteNameGame;
    default:
      throw new Error(`Unimplemented for game name '${gameName}'`);
  }
}

function getGameState(gameName: GameName, props: Props): GameState<any> {
  switch (gameName) {
    case 'piano-game':
      return props.pianoGameState;
    case 'note-distance-game':
      return props.noteDistanceGameState;
    case 'note-name-game':
      return props.noteNameGameState;
    default:
      throw new Error(`Unimplemented for game name '${gameName}'`);
  }
}
