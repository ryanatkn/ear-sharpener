import PianoGamePage from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import createReduxStore from '../../main/createReduxStore';
import {assert} from 'chai';
import PianoGame from '../../components/PianoGame';

describe('PianoGamePage', () => {
  it('should render the game component', () => {
    const store = createReduxStore();
    const wrapper = shallow(
      <PianoGamePage/>,
      {context: {store}}
    ).shallow();
    assert.equal(wrapper.find(PianoGame).length, 1, 'should render the game component');
  });
});
