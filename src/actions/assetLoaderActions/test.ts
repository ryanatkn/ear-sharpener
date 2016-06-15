import {assert} from 'chai';
import {loadAudio} from './index';
import createReduxStore from '../../main/createReduxStore';

describe('assetLoaderActions', () => {
  describe('loadAudio', () => {
    it('should load audio and set the flag in the store', () => {
      const store = createReduxStore();
      assert.strictEqual(
        store.getState().assetLoader.isAudioLoaded,
        false
      );
      return store.dispatch(loadAudio())
        .then(() => {
          assert.strictEqual(
            store.getState().assetLoader.isAudioLoaded,
            true
          );
        });
    });
  });
});
