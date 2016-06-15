import {GameName} from '../../types';
import {Action, isAction} from '../../utils/actions';
import * as I from 'immutable';
import {SetActiveGameAction} from '../../actions/comboGameActions';

interface IState {
  activeGame: GameName;
}

export type State = I.Record.IRecord<IState>;

const StateRecord = I.Record<IState>({
  activeGame: 'piano-game',
});

export function getInitialState(): State {
  return new StateRecord();
}

export default function comboGame(state: State = getInitialState(), action: Action): State {
  if (isAction(action, SetActiveGameAction)) {
    return state.set('activeGame', action.payload.gameName) as State;
  } else {
    return state;
  }
};
