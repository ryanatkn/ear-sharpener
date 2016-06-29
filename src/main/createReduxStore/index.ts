import * as assign from 'lodash/assign';
import {createStore, applyMiddleware, combineReducers, compose, Middleware} from 'redux';
import {routerReducer} from 'react-router-redux';
import reducers, {getInitialState} from '../../reducers';
import actionIdMiddleware from '../../middleware/actionIdMiddleware';
import logMiddleware from '../../middleware/logMiddleware';
import thunk from 'redux-thunk';
import {Store} from '../../types';
import localStorageStoreEnhancer from '../../middleware/localStorageStoreEnhancer';
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
    !__TEST__ ? localStorageStoreEnhancer() : null,
    !__TEST__ ? getDevToolsStoreEnhancer() : null, // will this work in prod? might as well see
  ]);
}

function getMiddleware(): Middleware[] {
  return compact([
    thunk,
    actionIdMiddleware(),
    __DEV__ ? logMiddleware() : null,
  ]);
}

function getDevToolsStoreEnhancer(): Function {
  return typeof window !== 'undefined' && window.devToolsExtension
    ? window.devToolsExtension()
    : (f: any) => f;
}
