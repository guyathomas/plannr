/**
 * Create the store with dynamic reducers
 */

import 'rxjs/add/operator/mergeMap';
import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import createReducer from './reducers';
import epic$ from './epics';


export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. epicMiddleware: Makes redux-observables work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const rootEpic = (action$, store) => epic$.mergeMap((epic) => epic(action$, store));
  const epicMiddleware = createEpicMiddleware(rootEpic);
  const middlewares = [
    epicMiddleware,
    routerMiddleware(history),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false,
      })
      : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  // Extensions
  store.injectedReducers = {}; // Reducer registry
  store.replaceEpic = epicMiddleware.replaceEpic;
  store.injectedEpics = {}; // Epic registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
    module.hot.accept('./epics', () => {
      store.replaceEpic(epic$);
    });
  }

  return store;
}
