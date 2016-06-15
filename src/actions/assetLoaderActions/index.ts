import {Thunk} from '../../types';
import {Dispatch} from 'redux';
import {loadAllAudio} from '../../models/Audio';
import {createAction} from '../../utils/actions';

export class AudioLoadedAction {
  static type = 'audioLoaded';
}

const audioLoaded = createAction(
  AudioLoadedAction,
  () => ({})
);

export function loadAudio(): Thunk<Promise<void>> {
  return (dispatch: Dispatch): Promise<void> => {
    return loadAllAudio()
      .then((): void => dispatch(audioLoaded()));
  };
}
