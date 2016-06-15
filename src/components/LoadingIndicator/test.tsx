import LoadingIndicator from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';

// tslint:disable:max-line-length

describe('LoadingIndicator', () => {
  it('should start an interval to animate on mount and clear the interval on unmount', (done: MochaDone) => {
    const wrapper = shallow(<LoadingIndicator/>);
    const instance = wrapper.instance() as LoadingIndicator;
    let tickCount = 0;
    let lastText: any = null;
    const onTick = instance.onTick;
    instance.onTick = () => {
      tickCount++;
      if (tickCount === 5) {
        instance.componentWillUnmount();
        assert.strictEqual(instance.tickIntervalId, null, 'should clear the interval on unmount');
        done();
      } else {
        onTick();
        wrapper.update(); // needed to make the newly rendered contents appear in `wrapper`
        const text = wrapper.text();
        assert.notEqual(lastText, text, 'should change the text every tick');
        lastText = text;
      }
    };
    assert.strictEqual(instance.tickIntervalId, null, 'should have no interval before mounting');
    instance.componentDidMount();
    assert.notStrictEqual(instance.tickIntervalId, null, 'should set an interval on mount');
  });
});
