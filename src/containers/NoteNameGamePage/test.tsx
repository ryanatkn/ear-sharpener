import NoteNameGamePage from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import createReduxStore from '../../main/createReduxStore';
import {assert} from 'chai';
import NoteNameGame from '../../components/NoteNameGame';

describe('NoteNameGamePage', () => {
  it('should render the game component', () => {
    const store = createReduxStore();
    const wrapper = shallow(
      <NoteNameGamePage/>,
      {context: {store}}
    ).shallow();
    assert.equal(wrapper.find(NoteNameGame).length, 1, 'should render the game component');
  });
});
