import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * React Component
 *
 * @author Ma Jianglong <rjgcmjl@163.com>
 */
class DemoComponent extends Component {
  /**
   * Properties passed to react component.
   *
   * @alias DemoComponent#props
   * @property text {string} - Required. Text to display
   */
  static propTypes = {
    text: PropTypes.string.isRequired
  }

  /**
   * Create a react component
   * @param {object} props - properties passed to react component
   */
  constructor(props) {
    super(props);
  }

  render() {
    const {text} = this.props;
    return (
      <div>
        {text}
      </div>
    );
  }
}

export default DemoComponent;
