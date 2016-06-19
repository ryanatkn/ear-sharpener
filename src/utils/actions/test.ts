import {assert} from 'chai';
import {createAction, isAction, Action} from './index';

/**
 * NOTE: This file is no longer being used. It is only being kept for posterity.
 * See `src/types.ts` for the new Action implementation that uses the discriminated union types.
 */

describe('actions', () => {
  describe('createAction', () => {
    it('should create an action that returns the expected action data', () => {
      class TestAction {
        static type = 'testAction';
        payload: {
          foo: string;
          bar: number;
        };
      }
      const testAction = createAction(
        TestAction,
        (foo: string, bar: number) => ({payload: {foo, bar}})
      );
      const testActionData = testAction('foo', 3);
      assert.deepEqual(
        testActionData,
        {type: 'testAction', payload: {foo: 'foo', bar: 3}}
      );
    });
  });

  describe('isAction', () => {
    it('should test whether an action is of a specific type, and TypeScript\'s flow analysis should understand the narrowed type', () => { // tslint:disable-line:max-line-length
      class TestAction1 {
        static type = 'testAction1';
        foo: number;
      }
      class TestAction2 {
        static type = 'testAction2';
      }
      const testAction1 = createAction(TestAction1, () => ({foo: 1}));
      const testActionData1 = testAction1();
      assert.ok(isAction(testActionData1, TestAction1));
      assert.notOk(isAction(testActionData1, TestAction2));
      // Can't automate this test, but accessing stuff on `action` inside an `isAction`-tested
      // block should autocomplete in the editor and be type safe.
      function editorTest(action: Action): void {
        if (isAction(action, TestAction1)) {
          assert.equal(action.foo, 1);
        } else {
          // action.foo should fail here
          assert.fail();
        }
        // action.foo should fail here
      }
      editorTest(testActionData1);
    });
  });
});
