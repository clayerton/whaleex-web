import React from 'react';
import PropTypes from 'prop-types';

import Cookies from 'js-cookie';
import Loading from 'whaleex/components/Loading';
import { injectIntl } from 'react-intl';
import context from 'whaleex/utils/service';
import {
  Form,
  Icon,
  Button,
  Checkbox,
  Select,
  Tooltip,
  Tabs,
  Modal,
} from 'antd';
import {
  InputWithClear,
  Switch,
  PhoneInput,
  M,
  CountDown,
} from 'whaleex/components';
import { CantReceiveSMS } from 'whaleex/components/WalModal';
const confirm = Modal.confirm;
import { Maintenance } from 'whaleex/pages/Dashboard/containers';
import { shouldShowMaintenance } from 'whaleex/routeMap';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import {
  StyledLayout,
  StyledContentFlow,
  StyledButton,
} from 'whaleex/pages/Dashboard/style.js';
const logo2 = _config.cdn_url + '/web-static/imgs/logo/denglu-logo.png';
import { connect } from 'react-redux';
import msgs from 'whaleex/utils/messages';
import {
  changeLocale,
  changeTheme,
} from 'containers/LanguageProvider/actions.js';
import * as allActions from '../actions';
import Header from '../header';
import reducer from '../reducer';
const FormItem = Form.Item;
import './style.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
let smsCodeSend = 0;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loginType: '1' };
  }

  componentDidMount() {
    this.loginRedirect();
  }

  loginRedirect = async props => {
    //登录页面等 不跳转
    let isLogin = await context.user.isLogin();
    if (isLogin || sessionStorage.getItem('user')) {
      this.props.history.push(
        [BASE_ROUTE, prefix, '/trade/', U.getLastSelectSymbol()].join('')
      );
    } else if (!(isLogin || sessionStorage.getItem('user'))) {
      // this.props.history.push([BASE_ROUTE, prefix, '/login'].join(''));
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { loginType } = this.state;
      _czc.push([
        '_trackEvent',
        (loginType === '1' && '账号登录-登录') || '快速登录-登录',
        '点击',
      ]);
      if (!_.isEmpty(err) && typeof err === 'object') {
        if (loginType === '1') {
          delete err.phoneCode;
        } else if (loginType === '2') {
          delete err.password;
        }
      }
      if (_.isEmpty(err)) {
        const { initialSmsCode } = this.state;
        let {
          userPhone,
          password,
          prefix = '',
          phoneCode = initialSmsCode,
        } = values;
        const countries = _.get(this.props, 'countries', []);
        const {
          intl: { formatMessage },
        } = this.props;
        const country = Cookies.get('country');
        const curCallingCode = JSON.parse(country || '{}').countryCode || 'CN';
        let _password = loginType === '1' ? password : undefined;
        let _phoneCode = loginType === '2' ? phoneCode : undefined;
        this.props.actions.login(
          userPhone,
          _password,
          {
            countryCode: curCallingCode,
            verifyCode: _phoneCode,
            formatMessage,
            loginType,
          },
          this.props.history,
          undefined, //TODO 参数整理
          undefined,
          undefined,
          {
            passErrorCallBack: r => {
              if (r === 'passError') {
                this.setState({
                  passError: true,
                });
              }
            },
          }
        );
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
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };
  urlJump = path => () => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  changeLoginType = type => {
    if (type === '1') {
      _czc.push(['_trackEvent', '账号登录', '点击']);
    } else if (type === '2') {
      _czc.push(['_trackEvent', '快速登录', '点击']);
    }
    this.setState({ loginType: type, passError: false });
  };
  setStoreValue = (key, value) => {
    this.props.actions.setUserData(key, value);
  };
  cantReceiveSMS = () => {
    const confirmModal = confirm({
      content: (
        <CantReceiveSMS
          onCancel={noMoreLoginError => {
            confirmModal.destroy();
          }}
          onOk={noMoreLoginError => {
            confirmModal.destroy();
          }}
        />
      ),
      title: null,
      className: 'whaleex-common-modal',
      iconType: true,
      okCancel: false,
      width: '400px',
    });
  };
  sendSmsCode = callBack => {
    smsCodeSend === 0 &&
      _czc.push(['_trackEvent', '快速登录-发送验证码', '点击']);
    smsCodeSend && _czc.push(['_trackEvent', '快速登录-重发验证码', '点击']);
    smsCodeSend = smsCodeSend + 1;
    const phone = this.props.form.getFieldValue('userPhone');
    const {
      intl: { formatMessage },
    } = this.props;
    if (phone) {
      this.props.actions.sendCode(
        'login',
        'phoneCode',
        phone,
        r => {
          this.setState({ cantReceiveSMS: 'on' });
          callBack(r);
          const faceBookCode = _.get(r, 'code');
          if (faceBookCode) {
            this.setState({ initialSmsCode: faceBookCode });
            const country = Cookies.get('country');
            const curCallingCode =
              JSON.parse(country || '{}').countryCode || 'CN';
            this.props.actions.login(
              phone,
              undefined,
              {
                countryCode: curCallingCode,
                verifyCode: faceBookCode,
                formatMessage,
                loginType: '2',
              },
              this.props.history
            );
          }
        },
        this.props.history,
        undefined,
        formatMessage
      );
    }
  };
  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldValue,
    } = this.props.form;
    const {
      intl: { formatMessage },
    } = this.props;
    const { loginType, passError, cantReceiveSMS } = this.state;
    const logining = _.get(this.props, 'data.logining');
    const countrieCodes = _.get(this.props, 'countrieCodes', []);
    const country = Cookies.get('country');
    const curCallingCode = JSON.parse(country || '{}').callingCode;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: (curCallingCode && `+${curCallingCode}`) || '+86',
    })(
      <Select
        dropdownClassName="countries-dropdown"
        id="login_choose_country"
        onFocus={() => {
          _czc.push([
            '_trackEvent',
            (loginType === '1' && '账号登录-国家选择') || '快速登录-国家选择',
            '点击',
          ]);
        }}
        onChange={value => {
          _czc.push([
            '_trackEvent',
            (loginType === '1' && '账号登录-国家选择') || '快速登录-国家选择',
            '选择',
            value,
          ]);
          let [callingCode, countryCode] = value.split('_');
          Cookies.set('country', {
            countryCode,
            callingCode: callingCode.slice(1),
          });
        }}
      >
        {countrieCodes.map(({ name, callingCode, countryCode }, idx) => {
          return (
            <Option value={callingCode + '_' + countryCode} key={idx}>
              {callingCode}{' '}
              <Tooltip placement="right" title={name} key={`_${idx}`}>
                <span className="countries-dropdown-selected">{name}</span>
              </Tooltip>
            </Option>
          );
        })}
      </Select>
    );
    if (shouldShowMaintenance('/login')) {
      return (
        <StyledLayout>
          <Header {...this.props} />
          <Maintenance />
        </StyledLayout>
      );
    }
    return (
      <StyledLayout>
        <Header {...this.props} />
        <StyledContentFlow
          style={{
            padding: '0 50px',
            marginTop: 64,
            background: '#f9fdff',
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
          }}
        >
          <div className="login-wrap">
            <div className="login-title">
              <div>
                <img src={logo2} />
              </div>
              <span>{formatMessage({ id: 'common.login' })}</span>
            </div>
            <div className="login-content">
              <div className="alert-location">
                {formatMessage({ id: 'common.alert' })}
              </div>
              <div className="login-form-wrap">
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <FormItem style={{ marginBottom: '0px' }}>
                    <Tabs
                      defaultActiveKey="1"
                      onChange={this.changeLoginType}
                      className="with-baseline"
                      style={{ fontSize: 14 }}
                    >
                      <TabPane
                        tab={<M id="login.account" />}
                        key="1"
                        id="tab_login"
                      />
                      <TabPane
                        tab={<M id="login.smscode" />}
                        key="2"
                        id="tab_register"
                      />
                    </Tabs>
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('userPhone', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.phoneInput' }),
                        },
                      ],
                    })(
                      <PhoneInput
                        placeholder={formatMessage({ id: 'common.phoneInput' })}
                        resetField={this.resetField}
                        inputKey="userPhone"
                        maxLength="11"
                        addonBefore={prefixSelector}
                        onChange={e => {
                          this.setStoreValue('userPhone', e);
                        }}
                        style={{
                          width: '420px',
                          height: '40px',
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                        className="input-field-withaddon"
                      />
                    )}
                  </FormItem>
                  <FormItem
                    style={{
                      display: (loginType === '1' && 'block') || 'none',
                    }}
                  >
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.passInput' }),
                        },
                      ],
                    })(
                      <InputWithClear
                        type="password"
                        placeholder={formatMessage({ id: 'common.passInput' })}
                        resetField={this.resetField}
                        inputKey="password"
                        onChange={() => {
                          this.setState({
                            passError: false,
                          });
                        }}
                        className={
                          passError ? 'input-field err-border' : 'input-field'
                        }
                        withEye
                      />
                    )}
                  </FormItem>
                  <FormItem
                    style={{
                      display: (loginType === '2' && 'block') || 'none',
                    }}
                  >
                    {getFieldDecorator('phoneCode', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.smsInput' }),
                        },
                      ],
                    })(
                      <InputWithClear
                        placeholder={formatMessage({ id: 'common.smsInput' })}
                        resetField={this.resetField}
                        inputKey="phoneCode"
                        type="wal-number"
                        onChange={e => {
                          sessionStorage.setItem('smsCode', e.target.value);
                        }}
                        addonAfter={
                          <CountDown
                            label={formatMessage({ id: 'common.smsSend' })}
                            onCount={this.sendSmsCode}
                            disabled={!getFieldValue('userPhone')}
                          />
                        }
                        style={{
                          width: '420px',
                          height: '40px',
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                        className="input-field-withaddon"
                      />
                    )}
                  </FormItem>
                  {(loginType === '1' && (
                    <span
                      className="forgetPwd-btn"
                      onClick={this.urlJump('/forgetPwd')}
                      id="forgot_password"
                    >
                      {formatMessage({ id: 'common.passForget' })}
                    </span>
                  )) || (
                    <span>
                      {(cantReceiveSMS === 'on' && (
                        <span
                          className="forgetPwd-btn"
                          onClick={this.cantReceiveSMS}
                          id="forgot_password"
                        >
                          {formatMessage({ id: 'common.receiveSMS' })}
                        </span>
                      )) ||
                        ''}
                    </span>
                  )}

                  <FormItem>
                    <StyledButton
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      id="login"
                      disabled={
                        (loginType === '1' &&
                          !this.props.form.getFieldValue('password')) ||
                        (loginType === '2' &&
                          !this.props.form.getFieldValue('phoneCode')) ||
                        logining
                      }
                    >
                      {(logining && <Loading />) || null}
                      {formatMessage({ id: 'common.login' })}
                    </StyledButton>
                    <p className="notice">
                      <span>{formatMessage({ id: 'common.noAccount' })} </span>
                      <a
                        onClick={() => {
                          _czc.push(['_trackEvent', '去注册', '点击']);
                          this.props.history.push(
                            [BASE_ROUTE, prefix, '/register'].join('')
                          );
                        }}
                        id="register"
                      >
                        {formatMessage({ id: 'common.goReg' })}
                      </a>
                    </p>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
        </StyledContentFlow>
      </StyledLayout>
    );
  }
}
Login.PropTypes = {};
export const mapStateToProps = state => ({
  ...state.get('app'),
  language: state.get('language').toJS(),
});
export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, { changeLocale, changeTheme }),
    dispatch
  ),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ key: 'app', reducer });
const WrappedLoginForm = Form.create()(Login);
export default injectIntl(
  compose(
    withRouter,
    withReducer,
    withConnect
  )(WrappedLoginForm)
);
// export default WrappedLoginForm;
