import {Action} from '../../types';
import * as I from 'immutable';

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
  switch (action.type) {
    case 'audioLoaded': {
      return state.set('isAudioLoaded', true) as State;
    }
    default: {
      return state;
    }
  }
}
