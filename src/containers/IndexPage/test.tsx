import IndexPage from './index';
import * as React from 'react';
import {shallow} from 'enzyme';

describe('IndexPage', () => {
  it('should not blow up', () => {
    shallow(<IndexPage/>);
  });
});
