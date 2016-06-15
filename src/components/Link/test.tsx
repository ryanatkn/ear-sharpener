import Link from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import createReduxStore from '../../main/createReduxStore';

describe('Link', () => {
  it('should render children', () => {
    const store = createReduxStore();
    // Hack to make this work without mocking the world
    const key = 'testRouterKey';
    store.getState().routing.locationBeforeTransitions = {key};
    const children = <div>test children</div>;
    const wrapper = shallow(
      <Link to="/foo">
        {children}
      </Link>,
      {context: {store}}
    );
    assert(wrapper.contains(children), 'expected Link to render its children');
    assert.equal(wrapper.props().routerKeyRerenderHack, key);
  });
});
