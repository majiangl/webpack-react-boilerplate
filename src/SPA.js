import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import {Router} from 'react-router';
import {syncHistoryWithStore, routerReducer, routerMiddleware} from 'react-router-redux';

class SPA extends Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {reducers, initialState, history, routes} = this.props;
    const store = createStore(combineReducers({
      ...reducers,
      routing: routerReducer
    }), initialState, this.getStoreEnhancer());
    const syncHistory = syncHistoryWithStore(history, store);

    return (
      <Provider store={store}>
        <Router history={syncHistory} routes={routes} />
      </Provider>
    );
  }

  getStoreEnhancer() {
    const middlewares = [thunk, promiseMiddleware(), routerMiddleware()];
    if(process.env.NODE_ENV!='production') {
      const {default:logger} = require('redux-logger');
      middlewares.push(logger);
    }
    return applyMiddleware.apply(null, middlewares);
  }
}

SPA.propTypes = {
  history: PropTypes.object.isRequired,
  initialState: PropTypes.object,
  reducers: PropTypes.object,
  routes: PropTypes.object.isRequired
};

export default SPA;
