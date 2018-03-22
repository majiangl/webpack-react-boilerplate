import React, {Component} from 'react';
import DemoComponent from 'app/component/DemoComponent/DemoComponent';
import './Demo.css';

class Demo extends Component {
  render() {
    return (
      <div>
        <p>For Search</p>
        <DemoComponent></DemoComponent>
      </div>
    );
  }
}

export default Demo;
