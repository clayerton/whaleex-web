import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QRCode from 'qrcode';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { Form, Button, notification, Icon, Modal, Alert, message } from 'antd';
import {
  M,
  Breadcrumb,
  InputWithClear,
  LayoutCT,
  CountDown,
  CodeModal,
} from 'whaleex/components';
import { injectIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import { APP_STORE, GOOGLE_PLAY } from './constants';
import { sendCode, getUserConfig } from 'whaleex/common/actions.js';
import './style.less';
import {
  LayoutItem,
  SecretKey,
  Index,
  Download,
  CopySuccess,
} from './style.js';
import { StyledButton } from '../../style.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const FormItem = Form.Item;
const confirm = Modal.confirm;
export class ResetPass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
    };
  }
  componentDidMount() {
    this.props.form.validateFields();
    this.props.actions.getSecret();
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.userConfig &&
      nextProps.store.secretCode &&
      !this.state.qrcode
    ) {
      const userPhone = _.get(nextProps, 'userConfig.phone');
      const secretCode = nextProps.store.secretCode;
      const qrcode = `otpauth://totp/${userPhone}?secret=${secretCode}&issuer=WHALEEX`;
      QRCode.toDataURL(qrcode).then(r => {
        this.setState({ qrcode: r });
      });
    }
  }
  handleSubmit = e => {
    const {
      intl: { formatMessage },
    } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { newGoogleCode } = values;
        this.props.actions.verifySecret(newGoogleCode, (r, msg) => {
          if (r) {
            notification.open({
              message: (
                <span>{formatMessage({ id: 'resetGoogle.userset' })}</span>
              ),
              description: formatMessage({ id: 'resetGoogle.googlebind' }),
              icon: (
                <Icon
                  type="check-circle"
                  style={{ color: 'rgb(87, 212, 170)' }}
                />
              ),
            });
            setTimeout(() => {
              this.props.history.push(
                [BASE_ROUTE, prefix, '/user/setting'].join('')
              );
              this.props.actions.getUserConfig();
            }, 1000);
          } else {
            message.warning(formatMessage({ id: 'resetGoogle.ggbdsb' }));
          }
        });
      }
    });
  };
  resetField = key => {
    this.props.form.setFields({
      [key]: {
        value: undefined,
      },
    });
  };

  validateCode = (rule, value, callback) => {
    callback();
  };
  onCopy = () => {
    this.setState({ qrCodeCopyed: true });
    setTimeout(() => {
      this.setState({ qrCodeCopyed: false });
    }, 1000);
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      intl: { formatMessage },
      buttonLoading,
      store,
    } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue,
    } = this.props.form;
    const secretCode = _.get(store, 'secretCode');
    const { qrcode, qrCodeCopyed } = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 18 },
    };
    const inputStyle = { width: '100%', height: 40 };
    const newGoogleCodeError =
      isFieldTouched('newGoogleCode') && getFieldError('newGoogleCode');
    return (
      <LayoutCT history={history} match={match}>
        <div className="reset-google-content">
          <LayoutItem>
            <div className="title">
              <span>
                <Index>1</Index>
              </span>
              <span>
                <M id="resetGoogle.xzgg" />
              </span>
            </div>
            <div className="guide">
              <p>
                <M id="resetGoogle.yhdr" />
                <br />
                <M id="resetGoogle.azyh" />
              </p>
            </div>
            <div className="guide-pic ">
              <div>{/* <img src={ImgPhone} height={250} /> */}</div>
              <div>
                <a href={APP_STORE} target="_blank">
                  <Download className="download-1">
                    <div>
                      <Icon type="apple" />
                    </div>
                    <div>
                      <span>Download it from</span>
                      <span>APP STORE</span>
                    </div>
                  </Download>
                </a>
                <a href={GOOGLE_PLAY} target="_blank">
                  <Download>
                    <div>
                      <Icon type="google" />
                    </div>
                    <div>
                      <span>Download it from</span>
                      <span>GOOGLE PLAY</span>
                    </div>
                  </Download>
                </a>
              </div>
            </div>
          </LayoutItem>
          <LayoutItem>
            <div className="title">
              <span>
                <Index>2</Index>
              </span>
              <span>
                <M id="resetGoogle.smewm" />
              </span>
            </div>
            <div className="guide">
              <p>
                <M id="resetGoogle.opengg" />
                <br />
                <span className="alert">
                  <M id="resetGoogle.myyy" />
                </span>
              </p>
            </div>
            <div className="guide-pic">
              <div>
                <div>
                  <img src={qrcode} width={164} />
                </div>
                <div>
                  <SecretKey className="inside">{secretCode}</SecretKey>
                  <CopyToClipboard
                    text={secretCode}
                    className="copy"
                    onCopy={this.onCopy}>
                    <span>
                      <M id="resetGoogle.copykey" />
                    </span>
                  </CopyToClipboard>
                </div>
                <CopySuccess>
                  {(qrCodeCopyed && (
                    <span>
                      <Icon type="check-circle" />
                      <M id="resetGoogle.copysuccess" />
                    </span>
                  )) ||
                    null}
                </CopySuccess>
              </div>
            </div>
          </LayoutItem>
          <LayoutItem>
            <div className="title">
              <span>
                <Index>3</Index>
              </span>
              <span>
                <M id="resetGoogle.bfkey" />
              </span>
            </div>
            <div className="guide">
              <p>
                <M id="resetGoogle.reserve" values={{ data: 16 }} />
                <br />
                <M id="resetGoogle.ggmessage" />
              </p>
            </div>
            <div className="guide-pic">
              <div>
                <SecretKey className="outside">{secretCode}</SecretKey>
              </div>
            </div>
          </LayoutItem>
          <LayoutItem>
            <div className="title">
              <span>
                <Index>4</Index>
              </span>
              <span>
                <M id="resetGoogle.bindgg" />
              </span>
            </div>
            <div className="guide-pic">
              <Form onSubmit={this.handleSubmit} className="reset-google-form">
                <FormItem
                  {...formItemLayout}
                  label={<M id="resetGoogle.sixkey" values={{ data: 16 }} />}>
                  <SecretKey>{secretCode}</SecretKey>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  validateStatus={newGoogleCodeError ? 'error' : ''}
                  label={<M id="resetGoogle.sixcode" values={{ data: 6 }} />}
                  help={newGoogleCodeError || ''}>
                  {getFieldDecorator('newGoogleCode', {
                    rules: [
                      {
                        validator: this.validateCode,
                      },
                    ],
                  })(
                    <InputWithClear
                      placeholder={formatMessage(
                        {
                          id: 'resetGoogle.sixggcode',
                        },
                        { data: 6 }
                      )}
                      resetField={this.resetField}
                      inputKey="newGoogleCode"
                      style={inputStyle}
                    />
                  )}
                </FormItem>
                <FormItem wrapperCol={{ span: 24 }}>
                  <StyledButton
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={buttonLoading}
                    disabled={!getFieldValue('newGoogleCode')}
                    style={inputStyle}>
                    <M id="resetGoogle.bindgg" />
                  </StyledButton>
                </FormItem>
              </Form>
            </div>
          </LayoutItem>
        </div>
      </LayoutCT>
    );
  }
}

ResetPass.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').resetGoogle.toJS();
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, { sendCode, getUserConfig }),
    dispatch
  ),
});
export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const ResetPassForm = Form.create()(ResetPass);
export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(ResetPassForm)
);
