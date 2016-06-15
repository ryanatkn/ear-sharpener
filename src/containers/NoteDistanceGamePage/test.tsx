import NoteDistanceGamePage from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import createReduxStore from '../../main/createReduxStore';
import {assert} from 'chai';
import NoteDistanceGame from '../../components/NoteDistanceGame';

describe('NoteDistanceGamePage', () => {
  it('should render the game component', () => {
    const store = createReduxStore();
    const wrapper = shallow(
      <NoteDistanceGamePage/>,
      {context: {store}}
    ).shallow();
    assert.equal(wrapper.find(NoteDistanceGame).length, 1, 'should render the game component');
  });
});
