import React from 'react';
import PropTypes from 'prop-types';
import { message, Icon } from 'antd';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { DeepBreadcrumb, M } from 'whaleex/components';
import { injectIntl } from 'react-intl';

const Wrap = styled.div`
  padding: 0px 50px;
`;
const Item = styled.div`
  display: flex;
  margin: 15px 0;
  flex-direction: column;
  .user-alert {
    display: inline-block;
    color: #f27762;
    background-color: #fff;
    padding: 20px;
    font-size: 12px;
    width: 450px;
    margin-top: 30px;
  }
  .copy {
    font-size: 14px;
    color: #5d97b6;
    cursor: pointer;
    margin-left: 15px;
  }
  .inside {
    background-color: rgba(234, 239, 242, 0.48);
    border: solid 1px #eaeff2;
    display: inline-block;
    max-width: 440px;
    word-break: break-all;
    padding: 0 13px;
    color: #2a4452;
    line-height: 40px;
  }
  .section-title {
    color: #99acb6;
    font-size: 14px;
    line-height: 20px;
  }
`;
const Card = styled.div`
  position: relative;
  background-color: #ffffff;
  width: 440px;
  height: 80px;
  margin: 15px 0;
  box-shadow: 6px 10px 14px 0 rgba(18, 52, 92, 0.1),
    2px 5px 5px 0 rgba(18, 46, 93, 0.04);
  outline: solid 1px #eaeff2;
  padding: 10px 20px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &.border-left {
    border-left: 6px solid #5d97b6;
  }
  &.arrow-left {
    padding-left: 25px;
    .tag {
      position: absolute;
      top: 0px;
      left: 0px;
      font-size: 12px;
      color: #fff;
      z-index: 2;
      > span {
        transform: scale(0.7);
        display: inline-block;
        position: relative;
        white-space: nowrap;
        left: -2px;
        top: -2px;
      }
      &:after {
        content: '';
        display: inline-block;
        border: 15px solid #5d97b6;
        border-bottom-color: transparent;
        border-right-color: transparent;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
      }
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    color: #2a4452;
    font-size: 15px;
  }
  .body {
    font-size: 12px;
    color: #99acb6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn {
      color: #5d97b6;
      border: 1px solid #5d97b6;
      border-radius: 4px;
      padding: 2px 6px;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
    }
  }
  .info {
    font-size: 12px;
    color: #99acb6;
  }
  div p.inside {
    max-width: 100%;
    width: 100%;
    margin: 10px 0;
  }
`;
class AddressList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.initPage();
  }
  initPage = () => {
    const { pubKey } = this.props;
    this.setState({ pubKey });
  };
  onCopy = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    message.success(formatMessage({ id: 'pkAddress.copysuccess' }));
  };
  render() {
    const {
      eosAccount = {},
      pageStatus,
      nextStep,
      pks = [],
      depositAddress,
      currencyListObj,
    } = this.props;
    const { pubKey } = this.state;
    const { eosAccount: eosAccountName } = eosAccount;
    return (
      <div>
        <DeepBreadcrumb
          arr={[<M id="pkAddress.bind" />]}
          extend={
            <span
              onClick={this.props.nextStep.bind(null, { pageFrom: 'list' }, 2)}>
              <M id="pkAddress.zchistory" />
            </span>
          }
        />
        <Wrap>
          <Item>
            <div className="section-title" />
            <div>
              <p className="user-alert">
                <M id="pkAddress.ndzc" />
              </p>
            </div>
          </Item>
          <Item>
            <div className="section-title">
              <M id="pkAddress.eosbind" />
            </div>
            <Card className="border-left">
              <div className="title">
                <div className="left-title">
                  <M id="pkAddress.hydz" />: {depositAddress}
                </div>
              </div>
              <div className="body">
                <span>
                  <M id="pkAddress.zh" values={{ account: 'EOS' }} />:{' '}
                  {eosAccountName}
                </span>
              </div>
            </Card>
          </Item>
          <Item>
            <div className="section-title">
              <M id="pkAddress.active" />
            </div>
            <div>
              {pks.map((i, idx) => {
                const { deviceInfo, pk, status, updatedTime } = i;

                const time = `${updatedTime
                  .slice(0, 3)
                  .join('/')} ${updatedTime.slice(3, 5).join(':')}`;
                return (
                  <Card className="arrow-left" key={idx}>
                    {(pubKey === pk && (
                      <div className="tag">
                        <span>
                          <M id="pkAddress.this" />
                        </span>
                      </div>
                    )) ||
                      null}
                    <div className="title">
                      <div className="left-title">
                        <M id="pkAddress.bindsb" />: {deviceInfo}
                      </div>
                    </div>
                    <div className="body">
                      <span>
                        <M id="pkAddress.bindtime" />: {time}
                      </span>
                      <span
                        className="btn"
                        onClick={() => {
                          nextStep(i);
                        }}>
                        <M id="pkAddress.popbind" />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Item>
          <Item>
            <div className="section-title" />
            <div>
              <div className="user-alert">
                <M id="pkAddress.message" />
                <br />
                <M id="pkAddress.messageList" richFormat />
              </div>
            </div>
          </Item>
        </Wrap>
      </div>
    );
  }
}

AddressList.PropTypes = {
  handler: PropTypes.function,
};
export default injectIntl(AddressList);
