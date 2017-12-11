import React, {Component} from 'react';
import {Link} from 'react-router';
import PropTypes from 'prop-types';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/inbox">Inbox</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.array
};