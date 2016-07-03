import LevelMapLevelItem from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {assert} from 'chai';

describe('LevelMapLevelItem', () => {
  it('should not blow up', () => {
    shallow(
      <LevelMapLevelItem
        step={1}
        isComplete={false}
        isActive={false}
        onClick={(): void => null}
      />
    );
  });

  it('should respond to a click', () => {
    const step = 1;
    const onClick = spy();
    const wrapper = shallow(
      <LevelMapLevelItem
        step={step}
        isComplete={false}
        isActive={false}
        onClick={onClick}
      />
    );
    wrapper.simulate('click');
    assert(onClick.calledOnce);
    assert(onClick.calledWithExactly(step));
  });
});
