import React, {Component} from 'react';
import PropTypes from 'prop-types';

import style from './DemoComponent.less';
/**
 * React Component
 *
 * @author Ma Jianglong <rjgcmjl@163.com>
 */
class DemoComponent extends Component {

  /**
   * Create a react component
   * @param {object} props - properties passed to react component
   */
  constructor(props) {
    super(props);
  }

  render() {
    const {children} = this.props;
    return (
      <div className="DemoComponent">
        {children}
      </div>
    );
  }
}

export default DemoComponent;

DemoComponent.propTypes = {
  children: PropTypes.node
}