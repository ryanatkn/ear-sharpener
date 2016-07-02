import {Thunk, AudioLoadedAction} from '../../types';
import {Dispatch} from 'redux';
import {loadAllAudio} from '../../models/Audio';

/**
 * Loads all of the audio files.
 * Does not yet handle failures.
 */
export function loadAudio(): Thunk<Promise<void>> {
  return (dispatch: Dispatch): Promise<void> => {
    return loadAllAudio()
      .then((): void => dispatch(audioLoaded()));
  };
}

/**
 * Indicates all audio is loaded.
 */
function audioLoaded(): AudioLoadedAction {
  return {type: 'audioLoaded'};
}
