import assetLoader, {getInitialState} from './index';
import {assert} from 'chai';

/**
 * The reducers have simple smoke tests.
 * See the readme for discussion on why reducers are
 * tested along with actions rather than separately.
 */
describe('assetLoader reducer', () => {
  it('should return the same state object from an unhandled action', () => {
    const state = getInitialState();
    const newState = assetLoader(state, {type: '__UNHANDLED_TEST_ACTION__'} as any);
    assert.strictEqual(state, newState);
  });
});
