import ToggleableGame from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import NoteNameGame from '../NoteNameGame';
import * as NoteNameGameModel from '../../models/NoteNameGame';
import {assert} from 'chai';

describe('ToggleableGame', () => {
  it('should render the given game component and display it when visible', () => {
    const wrapper = shallow(
      <ToggleableGame
        GameComponent={NoteNameGame}
        isVisible={true}
        gameState={NoteNameGameModel.create()}
        isGuessIndicatorEnabled={true}
        isInputEnabled={true}
        onGuess={(): void => null}
        onSetDifficulty={(): void => null}
        onPresent={(): void => null}
      />
    );
    assert.equal(wrapper.find(NoteNameGame).length, 1, 'should render the game component');
    assert.deepEqual(wrapper.shallow().prop('style'), {display: 'block'});
  });

  it('should render the given game component and hide it when not visible', () => {
    const wrapper = shallow(
      <ToggleableGame
        GameComponent={NoteNameGame}
        isVisible={false}
        gameState={NoteNameGameModel.create()}
        isGuessIndicatorEnabled={true}
        isInputEnabled={true}
        onGuess={(): void => null}
        onSetDifficulty={(): void => null}
        onPresent={(): void => null}
      />
    );
    assert.equal(wrapper.find(NoteNameGame).length, 1, 'should render the game component');
    assert.deepEqual(wrapper.shallow().prop('style'), {display: 'none'});
  });

  it('should forward the given props to the game component', () => {
    const props = {
      gameState: NoteNameGameModel.create(),
      isGuessIndicatorEnabled: true,
      isInputEnabled: true,
      isActive: true,
      onGuess: (): void => null,
      onSetDifficulty: (): void => null,
      onPresent: (): void => null,
    };
    const wrapper = shallow(
      <ToggleableGame
        GameComponent={NoteNameGame}
        isVisible={true}
        {...props}
      />
    );
    const gameComponent = wrapper.find(NoteNameGame);
    assert.equal(gameComponent.length, 1, 'should render the game component');
    assert.deepEqual(gameComponent.props(), props);
  });
});
