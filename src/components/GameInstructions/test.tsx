import GameInstructions from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';

describe('GameInstructions', () => {
  it('should render the given text', () => {
    const testText = 'test text';
    const wrapper = shallow(
      <GameInstructions text={testText}/>
    );
    assert.equal(wrapper.text(), testText);
  });
});
