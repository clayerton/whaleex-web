import React from 'react';
import PropTypes from 'prop-types';

import Cookies from 'js-cookie';
import context from 'whaleex/utils/service';
import Loading from 'whaleex/components/Loading';
import {
  Form,
  Icon,
  Button,
  Checkbox,
  Select,
  Tooltip,
  Modal,
  message,
} from 'antd';
import { InputWithClear, CountDown, PhoneInput } from 'whaleex/components';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import { Maintenance } from 'whaleex/pages/Dashboard/containers';
import { shouldShowMaintenance } from 'whaleex/routeMap';
import { injectIntl } from 'react-intl';
import injectReducer from 'utils/injectReducer';
import UserProtocolModal from 'whaleex/components/WalModal/UserProtocolModal.js';
import { CantReceiveSMS } from 'whaleex/components/WalModal';
import {
  StyledLayout,
  StyledContentFlow,
  StyledButton,
} from 'whaleex/pages/Dashboard/style.js';
const logo2 = _config.cdn_url + '/web-static/imgs/logo/denglu-logo.png';
import { connect } from 'react-redux';
import msgs from 'whaleex/utils/messages';
import { changeLocale } from 'containers/LanguageProvider/actions.js';
import U from 'whaleex/utils/extends';
import * as allActions from '../actions';
import Header from '../header';
import reducer from '../reducer';
const FormItem = Form.Item;
import './style.less';
const confirm = Modal.confirm;
const Option = Select.Option;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
let smsCodeSend = 0;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProtocolChecked: false,
      initialSmsCode:
        (['forgetPwd', 'smsLogin'].includes(U.getSearch('from')) &&
          sessionStorage.getItem('smsCode')) ||
        '',
      initialUserPhone:
        (['forgetPwd', 'smsLogin'].includes(U.getSearch('from')) &&
          _.get(props, 'userData.userPhone')) ||
        '',
      initialPassword:
        (['forgetPwd'].includes(U.getSearch('from')) &&
          _.get(props, 'userData.password')) ||
        '',
    };
  }
  componentDidMount() {
    this.props.actions.getTestCodeStatus(); //稳一点
    this.props.form.validateFields();
  }
  checkboxChange = e => {
    this.setState({ userProtocolChecked: e.target.checked });
  };
  handleSubmit = e => {
    _czc.push(['_trackEvent', '注册-注册butten', '点击']);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { initialSmsCode, initialUserPhone, initialPassword } = this.state;
      if (!err) {
        const {
          intl: { formatMessage },
          isAlphaTest,
        } = this.props;
        let {
          userPhone = initialUserPhone,
          password = initialPassword,
          phoneCode = initialSmsCode,
          testCode,
          prefix = '',
        } = values;
        const country = Cookies.get('country');
        const curCallingCode = JSON.parse(country || '{}').countryCode || 'CN';
        this.props.actions.registerUser(
          {
            phone: userPhone,
            password,
            verifyCode: phoneCode,
            countryCode: curCallingCode || 'CN',
            testCode: (isAlphaTest && testCode) || '',
          },
          this.props.history,
          undefined,
          r => {
            if (r === 'testCodeInvalid' && isAlphaTest) {
              this.resetField('testCode');
              this.setState({ showError: true });
              this.props.form.validateFields();
              // this.props.form.getFieldError('testCode');
              message.warning(
                formatMessage({ id: 'common.testCodeNotAvailable' })
              );
            }
            if (r === 'smsCodeInvalid') {
              this.resetField('phoneCode');
              message.warning(formatMessage({ id: 'common.smsCodeInvalid' }));
              setTimeout(() => {
                this.setState({ initialSmsCode: '' });
              }, 2000);
            }
          }
        );
      }
    });
  };
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
  sendSmsCode = async callBack => {
    smsCodeSend === 0 && _czc.push(['_trackEvent', '注册-发送验证码', '点击']);
    smsCodeSend && _czc.push(['_trackEvent', '注册-重发验证码', '点击']);
    smsCodeSend = smsCodeSend + 1;
    const {
      intl: { formatMessage },
      isAlphaTest,
    } = this.props;
    const testCode = this.props.form.getFieldValue('testCode');
    if (isAlphaTest) {
      if (!testCode) {
        message.warning(formatMessage({ id: 'common.testCode' }));
        return;
      }
      const { data: testCodeData } = await context.http.get(
        `/BUSINESS/api/public/testCode/isValid`,
        {
          testCode,
        }
      );
      if (testCodeData.returnCode === '1') {
        this.resetField('testCode');
        this.props.form.validateFields();
        // this.props.form.getFieldError('testCode');
        message.warning(formatMessage({ id: 'common.testCodeNotAvailable' }));
        return;
      }
    }
    const phone = this.props.form.getFieldValue('userPhone');
    if (phone) {
      this.props.actions.sendCode(
        'register',
        'phoneCode',
        phone,
        r => {
          this.setState({ cantReceiveSMS: 'on' });
          callBack(r);
          if (_.get(r, 'code')) {
            this.setState({ initialSmsCode: _.get(r, 'code') });
          }
        },
        this.props.history,
        { checkReg: 'sendIfReg' },
        formatMessage
      );
    }
  };
  compareToFirstPassword = (rule, value = '', callback) => {
    const {
      intl: { formatMessage },
    } = this.props;
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'common.passNotSame' }));
    } else {
      callback();
    }
  };
  validatePassword = (rule, value = '', callback) => {
    const {
      intl: { formatMessage },
    } = this.props;
    let tooltipMsg = {
      type: 'password',
      status: 'success',
      length: true, //长度正确
      format: true, //包含2种
      strengthLevel: 0,
    };
    // const pw1 = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,28}$/;
    // const pw2 = /^(?=.*\d)(?=.*[a-zA-Z]).{8,28}$/;
    // const pw3 = /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,28}$/;
    // const pw4 = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,28}$/;
    const pw = /^.{8,28}$/;
    const pw2 = /[a-z]/;
    const pw2Upper = /[A-Z]/;
    const pw3 = /[0-9]/;
    const pwSpecial = /[^A-Za-z0-9]/;
    const pwOther = /[^0-9]/;
    if (!pw.test(value)) {
      //校验长度
      callback(formatMessage({ id: 'common.passALert' }, { data: '8-28' }));
    } else if (!(pw3.test(value) && pwOther.test(value))) {
      //校验包含数字和其它字符
      callback(formatMessage({ id: 'common.passALert' }, { data: '8-28' }));
    }
    //密码强度校验
    if (!pw.test(value)) {
      tooltipMsg.status = 'error';
      tooltipMsg.length = false;
    }
    if (!(pw3.test(value) && pwOther.test(value))) {
      tooltipMsg.status = 'error';
      tooltipMsg.format = false;
    }
    let strengthLevelArr = [
      pw3.test(value),
      pw2.test(value),
      pw2Upper.test(value),
      pwSpecial.test(value),
    ];
    tooltipMsg.strengthLevel = Math.min(
      strengthLevelArr.filter(i => i).length,
      3
    );
    // if (!pwF.test(value)) {
    //   tooltipMsg.status = 'error';
    //   tooltipMsg.format = false;
    // }

    this.setState({ tooltipMsg });
    callback();
  };
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['repassword'], { force: true });
    }
    callback();
  };
  resetField = (key, errors) => {
    this.props.form.setFields({
      [key]: {
        value: undefined,
        errors,
      },
    });
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };
  render() {
    const {
      tooltipMsg,
      userProtocolChecked,
      initialSmsCode,
      initialUserPhone,
      initialPassword,
      showError,
      cantReceiveSMS,
    } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue,
    } = this.props.form;
    const {
      intl: { formatMessage },
      isAlphaTest,
    } = this.props;
    const registering = _.get(this.props, 'data.logining');
    const passwordError =
      isFieldTouched('password') && getFieldError('password');
    const testCodeError =
      (showError || isFieldTouched('testCode')) && getFieldError('testCode');
    const repasswordError =
      isFieldTouched('repassword') && getFieldError('repassword');
    const phoneCodeError =
      isFieldTouched('phoneCode') && getFieldError('phoneCode');
    const userPhoneError =
      isFieldTouched('userPhone') && getFieldError('userPhone');
    const countrieCodes = _.get(this.props, 'countrieCodes', []);
    const country = Cookies.get('country');
    const curCallingCode = JSON.parse(country || '{}').callingCode;
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: (curCallingCode && `+${curCallingCode}`) || '+86',
    })(
      <Select
        dropdownClassName="countries-dropdown"
        id="register_country"
        onChange={value => {
          _czc.push(['_trackEvent', '注册-国家选择', '选择', value]);
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    if (shouldShowMaintenance('/register')) {
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
          <div className="register-wrap">
            <div className="register-title">
              <div>
                <img src={logo2} />
              </div>
              <span>{formatMessage({ id: 'common.reg' })}</span>
            </div>
            <div className="register-content">
              <div className="alert-location">
                {formatMessage({ id: 'common.alert' })}
              </div>
              <div className="register-form-wrap">
                <Form onSubmit={this.handleSubmit} className="register-form">
                  <FormItem
                    validateStatus={userPhoneError ? 'error' : ''}
                    help={userPhoneError || ''}
                  >
                    {getFieldDecorator('userPhone', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.phoneInput' }),
                        },
                      ],
                      initialValue: initialUserPhone,
                    })(
                      <PhoneInput
                        placeholder={formatMessage({ id: 'common.phoneInput' })}
                        resetField={this.resetField}
                        inputKey="userPhone"
                        maxLength="11"
                        addonBefore={prefixSelector}
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
                  {(isAlphaTest && (
                    <FormItem
                      validateStatus={testCodeError ? 'error' : ''}
                      help={testCodeError || ''}
                    >
                      {getFieldDecorator('testCode', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'common.testCode' }),
                          },
                        ],
                      })(
                        <InputWithClear
                          placeholder={formatMessage({ id: 'common.testCode' })}
                          resetField={this.resetField}
                          inputKey="testCode"
                          className="input-field"
                        />
                      )}
                    </FormItem>
                  )) ||
                    null}
                  {(!initialSmsCode && (
                    <FormItem
                      validateStatus={phoneCodeError ? 'error' : ''}
                      help={phoneCodeError || ''}
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
                  )) ||
                    null}
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
                  <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                  >
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.passSet' }),
                        },
                        {
                          validator: this.validatePassword,
                        },
                        {
                          validator: this.validateToNextPassword,
                        },
                      ],
                      initialValue: initialPassword,
                    })(
                      <InputWithClear
                        placeholder={formatMessage({ id: 'common.passSet' })}
                        resetField={this.resetField}
                        inputKey="password"
                        type="password"
                        className="input-field"
                        tooltipMsg={tooltipMsg}
                        withEye
                      />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={repasswordError ? 'error' : ''}
                    help={repasswordError || ''}
                  >
                    {getFieldDecorator('repassword', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.passreSet' }),
                        },
                        {
                          validator: this.compareToFirstPassword,
                        },
                      ],
                      initialValue: initialPassword,
                    })(
                      <InputWithClear
                        placeholder={formatMessage({ id: 'common.passreSet' })}
                        resetField={this.resetField}
                        inputKey="repassword"
                        onBlur={this.handleConfirmBlur}
                        type="password"
                        maxLength="28"
                        className="input-field"
                        withEye
                      />
                    )}
                  </FormItem>
                  <FormItem className="no-margin">
                    <Checkbox onChange={this.checkboxChange} />
                    <span
                      style={{
                        color: '#658697',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        const confirmModal = confirm({
                          content: (
                            <UserProtocolModal
                              onCancel={() => {
                                confirmModal.destroy();
                              }}
                              onOk={() => {
                                confirmModal.destroy();
                              }}
                            />
                          ),
                          title: null,
                          className: 'whaleex-common-modal',
                          iconType: true,
                          okCancel: false,
                          width: '750px',
                        });
                      }}
                    >
                      {formatMessage({ id: 'common.userProtocol' })}
                    </span>
                  </FormItem>
                  <FormItem>
                    <StyledButton
                      type="primary"
                      htmlType="submit"
                      className="register-form-button"
                      id="register_register"
                      disabled={
                        this.hasErrors(getFieldsError()) ||
                        !userProtocolChecked ||
                        registering
                      }
                    >
                      {(registering && <Loading />) || null}
                      {formatMessage({ id: 'common.reg' })}
                    </StyledButton>
                    <p className="notice">
                      <span>
                        {formatMessage({ id: 'common.haveAccount' })}{' '}
                      </span>
                      <a
                        onClick={() => {
                          _czc.push(['_trackEvent', '去登录', '点击']);
                          this.props.history.push(
                            [BASE_ROUTE, prefix, '/login'].join('')
                          );
                        }}
                      >
                        {formatMessage({ id: 'common.goLogin' })}
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
Register.PropTypes = {};
export const mapStateToProps = state => ({
  ...state.get('app'),
  language: state.get('language').toJS(),
});
export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, { changeLocale }),
    dispatch
  ),
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ key: 'app', reducer });
const WrappedRegisterForm = Form.create()(Register);
export default injectIntl(
  compose(
    withRouter,
    withReducer,
    withConnect
  )(WrappedRegisterForm)
);
// export default WrappedRegisterForm;
