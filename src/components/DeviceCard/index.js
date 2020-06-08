import React from 'react';

import PropTypes from 'prop-types';
import { Card } from './style.js';
import M from 'whaleex/components/FormattedMessage';
import Loading from 'whaleex/components/Loading';

export default class DeviceCard extends React.Component {
  render() {
    const {
      info: { deviceInfo, createdTime, loginTime, addTime, pk },
      tag = {},
      isGoUnbind = true,
      superContext,
    } = this.props;
    const pks = _.get(superContext, 'props.pks');
    const localPubkeyGeneratingcard = _.get(
      superContext,
      'state.localPubkeyGeneratingcard'
    );
    /*
   createdTime（绑定/激活时间）,
   loginTime（登录时间）,
   addTime（添加时间）
   根据不同的时间戳来显示不同的时间文案
   */
    return (
      <Card className="arrow-left" arrowColor={tag.color}>
        {/* {(!_.isEmpty(tag) && (
          <div className="tag">
            <span>{tag.label}</span>
          </div>
        )) ||
          null} */}
        <div className="title">
          <div className="left-title">
            {/* {(isGoUnbind && <M id="pkAddress.bindsb" />) || (
              <M id="pkAddress.logindevice" />
            )} */}
            {deviceInfo}
          </div>
          {(isGoUnbind && (
            <span
              className="btn"
              onClick={this.props.superContext.goUnbind.bind(null, pk)}
            >
              <M id="pkAddress.goUnbind" />
            </span>
          )) || (
            <span
              className="btn primary-btn"
              onClick={this.props.superContext.goActive.bind(null, pk, 'card')}
            >
              {(localPubkeyGeneratingcard && <Loading />) || null}
              <M id="pkAddress.goBind" />
            </span>
          )}
        </div>
        <div className="body">
          {((createdTime || loginTime || addTime) && (
            <span>
              {(createdTime && <M id="pkAddress.bindtime" />) ||
                (loginTime && <M id="pkAddress.logintime" />) || (
                  <M id="pkAddress.addtime" />
                )}:
              {moment(+createdTime || +addTime || loginTime).format(
                'YYYY/MM/DD HH:mm'
              )}
            </span>
          )) || <span />}
        </div>
      </Card>
    );
  }
}

DeviceCard.PropTypes = {
  handler: PropTypes.function,
};
