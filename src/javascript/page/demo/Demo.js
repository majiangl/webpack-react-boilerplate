import React, {Component, Fragment} from 'react';
import {IntlProvider, FormattedMessage} from 'react-intl';

import './Demo.less';

class Demo extends Component {
    render() {
        return (
            <IntlProvider>
                <Fragment>
                    <FormattedMessage
                        id='demo.select-language'
                        defaultMessage='Please select a language: '
                    />
                    <select>
                        <option value='en'>English</option>
                        <option value='zh'>中文</option>
                    </select>
                </Fragment>
            </IntlProvider>
        );
    }
}

export default Demo;
