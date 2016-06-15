import ComboGamePage from './index';
import * as React from 'react';
import {shallow, ShallowWrapper} from 'enzyme';
import createReduxStore from '../../main/createReduxStore';
import {assert} from 'chai';
import ToggleableGame from '../../components/ToggleableGame';

describe('ComboGamePage', () => {
  it('should render the games in toggleable containers', () => {
    const store = createReduxStore();
    const wrapper = shallow(
      <ComboGamePage/>,
      {context: {store}}
    ).shallow();
    const gamesWrapper = wrapper.find(ToggleableGame);
    assert.equal(gamesWrapper.length, 3, 'should render three toggleable games');
    const visibleGameCount = gamesWrapper.reduce(
      (count: number, g: ShallowWrapper<any, any>) => g.prop('isVisible') ? count + 1 : count,
      0
    );
    assert.equal(visibleGameCount, 1, 'exactly one toggleable game should be visible');
  });
});
