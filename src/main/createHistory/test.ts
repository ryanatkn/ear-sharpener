import createHistory from './index';
import createReduxStore from '../createReduxStore';

describe('createHistory', () => {
  it('should not blow up', () => {
    createHistory(createReduxStore());
  });
});
