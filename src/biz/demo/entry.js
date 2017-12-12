import {Router, Route, browserHistory} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import App from 'app/component/App';
import About from 'app/component/About';
import Inbox from 'app/component/Inbox';
import './demo.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="inbox" component={Inbox}/>
    </Route>
  </Router>,
  document.getElementById('root')
);