import logMiddleware from './index';
import {Action} from '../../types';
import {spy} from 'sinon';
import {assert} from 'chai';

describe('logMiddleware', () => {
  // This doesn't log in test mode, so just do a smoke test.
  it('should forward the action correctly', () => {
    const nextSpy = spy();
    const action: Action = {type: 'testAction', meta: {actionId: 5}} as any;
    logMiddleware()(undefined)(nextSpy)(action);
    assert(nextSpy.calledOnce);
    assert(nextSpy.alwaysCalledWithExactly(action));
  });
});
