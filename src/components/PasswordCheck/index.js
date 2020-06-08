import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
const lowImg = _config.cdn_url + '/web-static/imgs/web/ruo-icon.png';
const middleImg = _config.cdn_url + '/web-static/imgs/web/zhong-icon.png';
const highImg = _config.cdn_url + '/web-static/imgs/web/qiang-icon.png';
import M from 'whaleex/components/FormattedMessage';
import Styled from 'styled-components';
import './style.less';
const Wrap = Styled.div`
  color:#92f1ff;
  padding: 10px;
  .pass-msg{
      margin: 0 10px;
  }
`;
export default class PasswordCheck extends React.Component {
  render() {
    const strengthMap = {
      '0': <M id="common.low" />,
      '1': <M id="common.low" />,
      '2': <M id="common.middle" />,
      '3': <M id="common.high" />,
    };
    const strengthIconMap = {
      '0': <img src={lowImg} style={{ width: '40px' }} />,
      '1': <img src={lowImg} style={{ width: '40px' }} />,
      '2': <img src={middleImg} style={{ width: '40px' }} />,
      '3': <img src={highImg} style={{ width: '40px' }} />,
    };
    const statusMap = {
      true: <Icon type="check-circle" style={{ color: '#32cc74' }} />,
      false: <Icon type="exclamation-circle" style={{ color: '#ef7a5b' }} />,
    };
    const { tooltipMsg } = this.props;
    const { type, status, length, format, strengthLevel } = tooltipMsg;
    return (
      <Wrap>
        <div>
          <span>{statusMap[length]}</span>
          <span className="pass-msg">
            <M id="common.pass8to16" values={{ data: '8-28' }} />
          </span>
        </div>
        <div>
          <span>{statusMap[format]}</span>
          <span className="pass-msg">
            <M id="common.passFormat" />
          </span>
        </div>
        <div>
          <span>{strengthIconMap[strengthLevel]}</span>
          <span className="pass-msg">
            <M
              id="common.passStrength"
              values={{ passStrengthLevel: strengthMap[strengthLevel] }}
            />
          </span>
        </div>
      </Wrap>
    );
  }
}

PasswordCheck.PropTypes = {
  handler: PropTypes.function,
};
