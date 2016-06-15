import * as React from 'react';
import pureComponent from '../../utils/pureComponent';
import {GameProps} from '../../types';

import './style.css';

interface Props extends GameProps<any, any> {
  GameComponent: React.ComponentClass<GameProps<any, any>>;
  isVisible: boolean;
}

/**
 * This class is an unnecessary but useful performance optimization.
 * The combo game switches between games rapidly, and they can be expensive to
 * render the first time, so this higher-order component renders them once 
 * and then swaps them out with `display: none`.
 */
@pureComponent
export default class ToggleableGame extends React.Component<Props, {}> {
  render(): JSX.Element {
    const {GameComponent, isVisible, gameState, isGuessIndicatorEnabled, isInputEnabled, onGuess,
      onSetDifficulty} = this.props;
    // Passing certain values only if the game is visible prevents unnecessary re-renders.
    return (
      <div className="toggleable-game" style={{display: isVisible ? 'block' : 'none'}}>
        <GameComponent gameState={gameState} isActive={isVisible}
          isGuessIndicatorEnabled={isVisible ? isGuessIndicatorEnabled : false}
          isInputEnabled={isVisible ? isInputEnabled : false}
          onGuess={onGuess} onSetDifficulty={onSetDifficulty}
        />
      </div>
    );
  }
}
