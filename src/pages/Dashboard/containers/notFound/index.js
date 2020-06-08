import React from 'react';
import { FormattedMessage } from 'react-intl';
import { M } from 'whaleex/components';
const img = _config.cdn_url+'/web-static/imgs/web/system/notfound.png';
import './style.less';
export class NotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // 未登录的情况下 用户会被定位到登录页面 不会出现notfound页面
    return (
      <div className="notfoud-fault">
        <div>
          <div className="bigImg">
            <img src={img} />
            {/* <p>Page not found</p> */}
          </div>
          <div className="fault-tips">
            <span className="bigText">
              <M id="extend.notFound" />:)
            </span>
            <span>
              <M id="extend.notFoundTips" />～
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default NotFound;
