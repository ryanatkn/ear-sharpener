import App from './index';
import * as React from 'react';
import {shallow} from 'enzyme';
import createReduxStore from '../../main/createReduxStore';
import {assert} from 'chai';
import AppHeader from '../../components/AppHeader';

describe('App', () => {
  it('should render the header but not the children when `isAudioLoaded` is false', () => {
    const store = createReduxStore();
    const children = <div>test children</div>;
    const wrapper = shallow(
      <App>
        {children}
      </App>,
      {context: {store}}
    ).shallow();
    assert(wrapper.find(AppHeader).length, 'should render the AppHeader');
    assert(!wrapper.contains(children), 'should not render children');
  });

  it('should render the header and children when `isAudioLoaded` is true', () => {
    const store = createReduxStore();
    // Hack to make this work without pulling in action or reducer dependencies
    store.getState().assetLoader = store.getState().assetLoader.set('isAudioLoaded', true) as any;
    const children = <div>test children</div>;
    const wrapper = shallow(
      <App>
        {children}
      </App>,
      {context: {store}}
    ).shallow();
    assert(wrapper.find(AppHeader).length, 'should render the AppHeader');
    assert(wrapper.contains(children), 'should render children');
  });
});
