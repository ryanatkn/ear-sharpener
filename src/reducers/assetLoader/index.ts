import * as I from 'immutable';
import {AudioLoadedAction} from '../../actions/assetLoaderActions';
import {Action, isAction} from '../../utils/actions';

interface IState {
  isAudioLoaded: boolean;
}

export type State = I.Record.IRecord<IState>;

const StateRecord = I.Record<IState>({
  isAudioLoaded: false,
});

export function getInitialState(): State {
  return new StateRecord();
}

export default function assetLoader(state: State = getInitialState(), action: Action): State {
  if (isAction(action, AudioLoadedAction)) {
    return state.set('isAudioLoaded', true) as State;
  } else {
    return state;
  }
}
