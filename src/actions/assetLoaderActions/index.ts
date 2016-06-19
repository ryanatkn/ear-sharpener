import {Thunk, AudioLoadedAction} from '../../types';
import {Dispatch} from 'redux';
import {loadAllAudio} from '../../models/Audio';

function audioLoaded(): AudioLoadedAction {
  return {type: 'audioLoaded'};
}

export function loadAudio(): Thunk<Promise<void>> {
  return (dispatch: Dispatch): Promise<void> => {
    return loadAllAudio()
      .then((): void => dispatch(audioLoaded()));
  };
}
