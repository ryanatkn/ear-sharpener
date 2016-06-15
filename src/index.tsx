import 'normalize.css';
import './styles/main.css';

import createReduxStore from './main/createReduxStore';
import createRoutes from './main/createRoutes';
import createHistory from './main/createHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {Provider} from 'react-redux';

/**
 * Create the Redux store and React Router history and routes.
 */
const store = createReduxStore();
const history = createHistory(store);
const routes = createRoutes();

/**
 * Mount the app.
 */
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app-wrapper')
);
