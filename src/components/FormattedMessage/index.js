import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

import './style.less';

export class Msg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  richFormatIt = value => {
    let _value = value.split('\n');
    let result = _value.reduce((pre, cur, idx) => {
      pre.push(cur);
      if (idx < _value.length) {
        pre.push(<br key={idx} />);
      }
      return pre;
    }, []);

    return <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>;
  };
  render() {
    let {
      id,
      path = id,
      values,
      richFormat,
      className,
      intl: { formatMessage },
    } = this.props;
    if (richFormat) {
      let value = formatMessage({ id: path.split('_').join('.') }, values);
      return (
        <div style={{ display: 'inline-block' }}>
          {this.richFormatIt(value)}
        </div>
      );
    }
    return (
      <span className={className || ''}>
        <FormattedMessage
          id={path.split('_').join('.')}
          values={values}
          description="whaleex-intl"
          defaultMessage=""
        />
      </span>
    );
  }
}

Msg.PropTypes = {
  handler: PropTypes.function,
};

export default injectIntl(Msg);
