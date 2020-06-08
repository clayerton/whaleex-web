import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { Form, Icon, Button, Checkbox, Select, Tooltip } from 'antd';
import { InputWithClear, CountDown, PhoneInput } from 'whaleex/components';
import { withRouter } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import { injectIntl } from 'react-intl';
import {
  StyledLayout,
  StyledContentFlow,
  StyledButton,
} from 'whaleex/pages/Dashboard/style.js';
import { connect } from 'react-redux';
import { Maintenance } from 'whaleex/pages/Dashboard/containers';
import { shouldShowMaintenance } from 'whaleex/routeMap';
import msgs from 'whaleex/utils/messages';
import { changeLocale } from 'containers/LanguageProvider/actions.js';

import * as allActions from '../actions';
import Header from '../header';
import reducer from '../reducer';
const FormItem = Form.Item;
import './style.less';
const Option = Select.Option;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const logo2 = _config.cdn_url + '/web-static/imgs/logo/denglu-logo.png';
class ForgetPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    _czc.push(['_trackEvent', '忘记密码', '点击']);
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { initialSmsCode } = this.state;
        const { userPhone, password, phoneCode = initialSmsCode } = values;
        const {
          intl: { formatMessage },
        } = this.props;
        this.props.actions.forgetPwdUser(
          { phone: userPhone, password, verifyCode: phoneCode },
          this.props.history,
          undefined,
          formatMessage
        );
      }
    });
  };
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  sendSmsCode = callBack => {
    const phone = this.props.form.getFieldValue('userPhone');
    const {
      intl: { formatMessage },
    } = this.props;
    if (phone) {
      this.props.actions.sendCode(
        'pwdForget',
        'phoneCode',
        phone,
        r => {
          callBack(r);
          if (_.get(r, 'code')) {
            this.setState({ initialSmsCode: _.get(r, 'code') });
          }
        },
        undefined,
        undefined,
        formatMessage
      );
    }
  };
  compareToFirstPassword = (rule, value, callback) => {
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
  setStoreValue = (key, value) => {
    this.props.actions.setUserData(key, value);
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
  render() {
    const { tooltipMsg, initialSmsCode } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue,
    } = this.props.form;
    const {
      intl: { formatMessage },
    } = this.props;
    const forgetPwding = _.get(this.props, 'data.logining');
    const passwordError =
      isFieldTouched('password') && getFieldError('password');
    const repasswordError =
      isFieldTouched('repassword') && getFieldError('repassword');
    const phoneCodeError =
      isFieldTouched('phoneCode') && getFieldError('phoneCode');
    const userPhoneError =
      isFieldTouched('userPhone') && getFieldError('userPhone');
    const country = Cookies.get('country');
    const curCallingCode = JSON.parse(country || '{}').callingCode;
    const countrieCodes = _.get(this.props, 'countrieCodes', []);
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: (curCallingCode && `+${curCallingCode}`) || '+86',
    })(
      <Select
        dropdownClassName="countries-dropdown"
        id="login_choose_country"
        onFocus={() => {
          _czc.push(['_trackEvent', '忘记密码-国家选择', '点击']);
        }}
        onChange={value => {
          _czc.push(['_trackEvent', '忘记密码-国家选择', '选择', value]);
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
    if (shouldShowMaintenance('/forgetPwd')) {
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
          <div className="forgetPwd-wrap">
            <div className="forgetPwd-title">
              <div>
                <img src={logo2} />
              </div>
              <span>{formatMessage({ id: 'common.passForget' })}</span>
            </div>
            <div className="forgetPwd-content">
              {/* <div className="alert-location">
                {formatMessage({ id: 'common.alert' })}
              </div> */}
              <div className="forgetPwd-form-wrap">
                <Form onSubmit={this.handleSubmit} className="forgetPwd-form">
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
                  )) ||
                    null}

                  <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                  >
                    {getFieldDecorator('password', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'common.passNewSet' }),
                        },
                        {
                          validator: this.validatePassword,
                        },
                        {
                          validator: this.validateToNextPassword,
                        },
                      ],
                    })(
                      <InputWithClear
                        placeholder={formatMessage({ id: 'common.passNewSet' })}
                        resetField={this.resetField}
                        inputKey="password"
                        type="password"
                        className="input-field"
                        tooltipMsg={tooltipMsg}
                        onChange={e => {
                          this.setStoreValue('password', e.target.value);
                        }}
                        withEye
                      />
                    )}
                    <div className="resetpass-tips">
                      {formatMessage({ id: 'resetPass.tips' }, { data: 24 })}
                    </div>
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
                    })(
                      <InputWithClear
                        placeholder={formatMessage({ id: 'common.passreSet' })}
                        resetField={this.resetField}
                        inputKey="repassword"
                        onBlur={this.handleConfirmBlur}
                        type="password"
                        className="input-field"
                        withEye
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    <StyledButton
                      type="primary"
                      htmlType="submit"
                      className="forgetPwd-form-button"
                      loading={forgetPwding}
                      disabled={
                        this.hasErrors(getFieldsError()) || forgetPwding
                      }
                    >
                      {formatMessage({ id: 'common.resetPass' })}
                    </StyledButton>
                    {/* <p className="notice">
                      {formatMessage({ id: 'common.autoRegister' })}
                    </p> */}
                    <p className="notice">
                      {formatMessage({ id: 'common.haveAccount' })}{' '}
                      <a
                        onClick={() =>
                          this.props.history.push(
                            [BASE_ROUTE, prefix, '/login'].join('')
                          )
                        }
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
ForgetPwd.PropTypes = {};
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
const WrappedForgetPwdForm = Form.create()(ForgetPwd);
export default injectIntl(
  compose(
    withRouter,
    withReducer,
    withConnect
  )(WrappedForgetPwdForm)
);
// export default WrappedForgetPwdForm;
