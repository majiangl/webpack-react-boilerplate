import React from 'react';
import ReactDOM from 'react-dom';

import 'style/base.less';
import SinglePageApp from 'js/SinglePageApp';
import Demo from './Demo';

ReactDOM.render(
    <SinglePageApp>
        <Demo></Demo>
    </SinglePageApp>,
    document.getElementById('root')
);