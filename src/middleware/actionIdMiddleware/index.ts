import {Middleware} from 'redux';
import {Action} from '../../types';

let currentActionId = 1;

/**
 * Mutates every action by adding `actionId` to its meta.
 * This uniquely identifies every action in the system.
 * The motivating use case was to re-enable input only on the previously associated actions.
 * For example, if we disable input when 'presenting', we only want to re-enable input
 * on 'presented' if the last action to disable input was the associated 'presenting' action.
 */
export default (): Middleware => {
  return () => (next: Function) => (action: Action) => { // tslint:disable-line:typedef
    const actionId = currentActionId++;
    if (action.meta) {
      action.meta.actionId = actionId;
    } else {
      action.meta = {actionId};
    }
    return next(action);
  };
};
