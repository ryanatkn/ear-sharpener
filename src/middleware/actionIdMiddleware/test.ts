import actionIdMiddleware from './index';
import {Action} from '../../types';
import {spy} from 'sinon';
import {assert} from 'chai';

describe('actionIdMiddleware', () => {
  it('should add an action id to the action meta and create the meta as necessary', () => {
    const nextSpy = spy();
    const action: Action = {type: 'testAction'} as any;
    actionIdMiddleware()(undefined)(nextSpy)(action);
    assert(action.meta, 'should add meta to the action');
    assert.typeOf(action.meta.actionId, 'number');
    assert(nextSpy.calledOnce);
    assert(nextSpy.alwaysCalledWithExactly(action));
  });

  it('should add an action id to the action meta and preserve the existing meta', () => {
    const nextSpy = spy();
    const meta = {foo: 'foo'};
    const action: Action = {type: 'testAction', meta} as any;
    actionIdMiddleware()(undefined)(nextSpy)(action);
    assert.equal((action.meta as any).foo, meta.foo, 'should preserve the existing meta');
    assert.typeOf(action.meta.actionId, 'number');
    assert(nextSpy.calledOnce);
    assert(nextSpy.alwaysCalledWithExactly(action));
  });
});
