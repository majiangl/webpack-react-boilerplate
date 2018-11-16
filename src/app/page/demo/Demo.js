import React, {Component} from 'react';
import './Demo.less';
import DemoComponent from 'app/component/DemoComponent/DemoComponent';

class Demo extends Component {
    render() {
        return (
            <DemoComponent>Hello, World!</DemoComponent>
        );
    }
}

export default Demo;
