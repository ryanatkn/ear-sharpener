import * as assign from 'lodash/assign';
import {createStore, applyMiddleware, combineReducers, compose, Middleware} from 'redux';
import {routerReducer} from 'react-router-redux';
import reducers, {getInitialState} from '../../reducers';
import logMiddleware from '../../middleware/logMiddleware';
import thunk from 'redux-thunk';
import {Store} from '../../types';
import localStorageMiddleware from '../../middleware/localStorageMiddleware';
import * as compact from 'lodash/compact';

/**
 * Creates the Redux store.
 */
export default function createReduxStore(): Store {
  const reducer = combineReducers(assign({}, reducers, {
    routing: routerReducer,
  }));
  return createStore(
    reducer,
    getInitialState(),
    compose(...getStoreEnhancers())
  );
}

function getStoreEnhancers(): Function[] {
  return compact([
    applyMiddleware(...getMiddleware()),
    !__TEST__ ? localStorageMiddleware() : null,
    !__TEST__ ? getDevToolsMiddleware() : null, // will this work in prod? might as well see
  ]);
}

function getMiddleware(): Middleware[] {
  return compact([
    thunk,
    __DEV__ ? logMiddleware() : null,
  ]);
}

function getDevToolsMiddleware(): Function {
  return typeof window !== 'undefined' && window.devToolsExtension
    ? window.devToolsExtension()
    : (f: any) => f;
}
