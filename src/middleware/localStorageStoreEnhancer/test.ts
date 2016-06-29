import localStorageStoreEnhancer from './index';
import {assert} from 'chai';

describe('localStorageStoreEnhancer', () => {
  // Can't test in node without a fake dom, so do a basic smoke test.
  it('should not blow up', () => {
    assert(localStorageStoreEnhancer()());
  });
});
