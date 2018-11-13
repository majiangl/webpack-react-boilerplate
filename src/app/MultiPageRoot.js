import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

class MultiPageRoot extends Component {

  render() {
    const {reducers, initialState, children} = this.props;
    const rootReducer = reducers ? combineReducers(reducers) : state => state;
    const store = createStore(rootReducer, initialState, this.getStoreEnhancer());

    return (
      <Provider store={store}>{children}</Provider>
    );
  }

  getStoreEnhancer() {
    const middlewares = [thunk, promiseMiddleware()];
    if(process.env.NODE_ENV!=='production') {
      const {default:logger} = require('redux-logger');
      middlewares.push(logger);
    }
    return applyMiddleware.apply(null, middlewares);
  }
}

MultiPageRoot.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.object,
  reducers: PropTypes.object
};

export default MultiPageRoot;
