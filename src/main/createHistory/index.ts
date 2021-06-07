import {Store} from 'redux';
import {hashHistory, createMemoryHistory} from 'react-router';
import {syncHistoryWithStore, ReactRouterReduxHistory} from 'react-router-redux';

/**
 * Creates the react-router-redux history object.
 */
export default function createHistory(store: Store): ReactRouterReduxHistory {
  const history = __TEST__ ? createMemoryHistory() : hashHistory;
  return syncHistoryWithStore(history, store);
}
