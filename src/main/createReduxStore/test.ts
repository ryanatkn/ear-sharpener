import {assert} from 'chai';
import createReduxStore from '../createReduxStore';

describe('createReduxStore', () => {
  it('should create a Redux store that responds to actions', (done: MochaDone) => {
    const store = createReduxStore();
    const state = store.getState();
    assert.isAtLeast(Object.keys(state).length, 1);
    const unsubscribe = store.subscribe(() => done());
    store.dispatch({type: 'testAction'} as any);
    unsubscribe();
  });
});
