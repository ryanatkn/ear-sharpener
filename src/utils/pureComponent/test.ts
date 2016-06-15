import {assert} from 'chai';
import pureComponent from './index';
import * as React from 'react';

// tslint:disable:max-line-length

describe('pureComponent', () => {
  it('should mutate the provided component class with a `shouldComponentUpdate` function that performs a shallow comparison', () => {
    class TestReactComponent extends React.Component<{}, {}> {}
    // Cast to a `React.ComponentClass` because the `React.Component` type
    // does not have `.prototype.shouldComponentUpdate`.
    const Component = TestReactComponent as React.ComponentClass<{}>;
    assert.strictEqual(
      Component.prototype.shouldComponentUpdate,
      undefined,
      'should have no `shouldComponentUpdate` by default'
    );
    pureComponent(TestReactComponent);
    const shouldComponentUpdate = Component.prototype.shouldComponentUpdate;
    assert.strictEqual(
      typeof shouldComponentUpdate,
      'function',
      'should be mutated with a `shouldComponentUpdate` function'
    );
    assert.strictEqual(
      shouldComponentUpdate.call({props: {foo: 1}, state: {bar: 2}}, {foo: 1}, {bar: 2}),
      false,
      'should return false if the props and state are shallowly equal'
    );
    assert.strictEqual(
      shouldComponentUpdate.call({props: {foo: {}}, state: null}, {foo: {}}, null),
      true,
      'should return true if the props are not shallowly equal'
    );
    assert.strictEqual(
      shouldComponentUpdate.call({props: {}, state: {bar: 1}}, {}, {bar: 2}),
      true,
      'should return true if the state is not shallowly equal'
    );
  });
});
