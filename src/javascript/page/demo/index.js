import React from 'react';
import ReactDOM from 'react-dom';
import 'style/base.less';
import MultiPageApp from 'js/MultiPageApp';
import Demo from './Demo';

ReactDOM.render(
    <MultiPageApp>
        <Demo></Demo>
    </MultiPageApp>,
    document.getElementById('root')
);