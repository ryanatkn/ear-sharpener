import AppHeader from './index';
import * as React from 'react';
import {assert} from 'chai';
import {shallow} from 'enzyme';
import LoadingIndicator from '../LoadingIndicator';
import GameLink from '../GameLink';
import Link from '../Link';

describe('AppHeader', () => {
  it('should render a loading indicator when `isLoading` is true', () => {
    const wrapper = shallow(<AppHeader isLoading={true}/>);
    assert.equal(wrapper.find(LoadingIndicator).length, 1);
  });

  it('should render 4 game links when `isLoading` is false', () => {
    const wrapper = shallow(<AppHeader isLoading={false}/>);
    assert.equal(wrapper.find(GameLink).length, 4);
  });

  it('should render a Link with an h1 with some text', () => {
    const wrapper = shallow(<AppHeader isLoading={false}/>);
    const link = wrapper.find(Link);
    assert.equal(link.length, 1);
    const h1 = link.find('h1');
    assert.equal(h1.length, 1);
    assert(h1.text);
  });
});
