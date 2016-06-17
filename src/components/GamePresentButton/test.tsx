import GamePresentButton from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {assert} from 'chai';

describe('GamePresentButton', () => {
  it('should render children', () => {
    const children = <div>test children</div>;
    const wrapper = shallow(
      <GamePresentButton isEnabled={true} onClick={() => null}>
        {children}
      </GamePresentButton>
    );
    assert(wrapper.contains(children), 'expected GamePresentButton to render its children');
  });

  it('should respond to a click when enabled', () => {
    const onClick = spy();
    const wrapper = shallow(
      <GamePresentButton isEnabled={true} onClick={onClick}/>
    );
    wrapper.simulate('click');
    assert(onClick.calledOnce);
    assert(onClick.calledWithExactly());
  });

  it('should not respond to a click when disabled', () => {
    const onClick = spy();
    const wrapper = shallow(
      <GamePresentButton isEnabled={false} onClick={onClick}/>
    );
    wrapper.simulate('click');
    assert.strictEqual(onClick.callCount, 0);
  });
});
