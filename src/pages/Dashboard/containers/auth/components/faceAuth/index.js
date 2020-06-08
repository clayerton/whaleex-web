import React from 'react';
import PropTypes from 'prop-types';
import './style.less';
import { M } from 'whaleex/components';
import { Spin, Modal } from 'antd';
import QRCode from 'qrcode';
import U from 'whaleex/utils/extends';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import { AuthSuccess } from 'whaleex/components/WalModal';
let timer;
const confirm = Modal.confirm;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export default class FaceAuth extends React.Component {
  constructor(props) {
    super(props);
    const { qrcode } = props;
    this.state = {
      remainTime: 1,
      targetTime: +new Date() + 10 * 60 * 1000,
      qrcode,
    };
  }
  componentWillUnmount() {
    clearTimeout(timer);
  }
  componentWillReceiveProps(nextProps) {
    let { qrcode: _qrcode } = nextProps;
    let { qrcode } = this.props;
    if (_qrcode !== qrcode) {
      this.setState({
        qrcode: _qrcode,
        targetTime: +new Date() + 10 * 60 * 1000,
      });
    }
  }
  componentDidMount() {
    this.loop();
    // this.generateQrcode();
  }

  urlJump = path => () => {
    const { history } = this.props;
    history.push([BASE_ROUTE, prefix, path].join(''));
  };

  //face++审核状态查询
  faceStatusClick = () => {
    this.props.faceStatus(faceResult => {
      if (faceResult === 'true') {
        const confirmModal = confirm({
          content: (
            <AuthSuccess
              onCancel={() => {
                confirmModal.destroy();
              }}
              onOk={() => {
                confirmModal.destroy();
                this.urlJump('/user/setting')();
              }}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '400px',
        });
      }
    });
  };
  loop = () => {
    clearTimeout(timer);
    const { targetTime, remainTime } = this.state;
    const nowTime = +Date.now();
    const diffTime = U.diffTime(nowTime, targetTime, 'arr');
    let _remainTime = Math.max(targetTime - nowTime, 0);
    if (remainTime > 0) {
      this.setState({ diffTime, remainTime: _remainTime });
    }
    timer = setTimeout(() => {
      this.loop();
    }, 1000);
  };
  generateQrcode = () => {
    const { idCard, name, location } = this.props;
    this.props.chinaKyc({
      idCard: idCard,
      name: name,
      location: 'CN',
      callback: data => {
        const { result } = data;
        const { type, liteUrl } = result || {};
        if (type === 'bihu') {
          this.urlJump('/user/setting')();
        } else {
          QRCode.toDataURL([liteUrl].join(''), {
            width: 250,
          }).then(r => {
            this.setState({
              qrcode: r,
              targetTime: +new Date() + 10 * 60 * 1000,
              remainTime: 1,
            });
          });
        }
      },
    });
  };
  render() {
    const { faceResult } = this.props;
    const { qrcode, diffTime, remainTime } = this.state;
    if (!qrcode) {
      return (
        <div className="spin-center">
          <Spin size="large" spinning={true} />
        </div>
      );
    }
    return (
      <div className="kyc">
        <div className="indentity_lines">
          <label>
            <span>1</span>
          </label>
          <div>
            <M id="kyc.uploadInfo" />
            <span className="finished">
              <M id="kyc.finished" />
            </span>
          </div>
        </div>
        <div className="indentity_lines">
          <label>
            <span>2</span>
          </label>
          <div>
            <M id="kyc.faceInfo" />
            <span className="finished unfinished">
              <M id="kyc.unfinished" />
            </span>
            <p className="tips">
              <M id="kyc.scan" />
            </p>
            <div>
              <img src={qrcode} />
              {remainTime ? (
                <p className="tips">
                  <M
                    id="kyc.codeTime"
                    values={{ min: diffTime[2] || '0', sec: diffTime[3] }}
                  />
                </p>
              ) : (
                ''
              )}
              {!remainTime && (
                <p className="code-overdue">
                  <M id="kyc.codeOverdue" />
                  <a
                    className="code-click"
                    onClick={() => {
                      this.generateQrcode();
                    }}
                  >
                    <M id="kyc.codeClick" />
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="indentity_lines">
          <label />
          <div>
            <StyledButton type="primary" className="auth-btn">
              <a
                onClick={() => {
                  this.faceStatusClick();
                }}
              >
                <M id="kyc.completedFace" />
              </a>
            </StyledButton>
            {faceResult === 'false' ? (
              <div className="button-tips">
                <M id="kyc.buttonTips" />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}

FaceAuth.PropTypes = {
  handler: PropTypes.function,
};
