import React from 'react';
import ReactDOM from 'react-dom';
import MultiPageRoot from 'app/MultiPageRoot';
import Demo from './Demo';

ReactDOM.render(
  <MultiPageRoot>
    <Demo></Demo>
  </MultiPageRoot>,
  document.getElementById('root')
);