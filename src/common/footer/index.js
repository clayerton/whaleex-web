/** Copyright © 2013-2017 DataYes, All Rights Reserved. */

import React, { Component, PropTypes } from 'react';
// import config from 'src/config'
import CSSModules from 'react-css-modules';
import styles from './style.less';

@CSSModules(styles)
export default class Footer extends Component {
  render() {
    let { onlyView } = this.props;
    let view = (
      <p>
      </p>
    );
    if (_config.nativePublish) view = <p />;
    if (onlyView) return view;
    return (
      <div
        id="footer-copyright"
        styleName="global-footer"
        className="hideWhilePrint" >
        <div styleName="copyright" style={{ height: 41 }}>
          <div styleName="container">{view}</div>
        </div>
      </div>
    );
  }
}
