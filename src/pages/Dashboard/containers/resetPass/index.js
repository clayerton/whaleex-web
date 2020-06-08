import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { Form, Button, notification, Icon } from 'antd';
import {
  M,
  Breadcrumb,
  InputWithClear,
  LayoutLR,
  CountDown,
  DeepBreadcrumb,
} from 'whaleex/components';
import { injectIntl } from 'react-intl';
import { logout } from 'whaleex/common/actions.js';

import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import './style.less';
import { StyledButton } from '../../style.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const FormItem = Form.Item;

export class ResetPass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      verifyType: 'phoneCode', //'google'
    };
  }
  componentDidMount() {
    this.props.form.validateFields();
  }
  componentWillReceiveProps(nextProps) {}
  handleSubmit = e => {
    this.setState({ stateButtonLoading: true });
    const {
      intl: { formatMessage },
    } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const phone = _.get(this.props, 'userConfig.phone');
        const { initialSmsCode } = this.state;
        const { password, googleCode, phoneCode = initialSmsCode } = values;
        this.props.actions.confirmModify(
          {
            phone,
            password,
            googleCode,
            phoneCode,
          },
          r => {
            this.setState({ stateButtonLoading: false });
            if (r) {
              notification.open({
                message: (
                  <span>{formatMessage({ id: 'resetPass.userset' })}</span>
                ),
                description: (
                  <span>{formatMessage({ id: 'resetPass.resetmessage' })}</span>
                ),
                icon: (
                  <Icon
                    type="check-circle"
                    style={{ color: 'rgb(87, 212, 170)' }}
                  />
                ),
              });
              setTimeout(() => {
                this.props.actions.logout(this.props.history);
                // history.push([BASE_ROUTE, prefix, '/user/setting'].join(''));
              }, 1000);
            } else {
              this.setState({ initialSmsCode: '' });
            }
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
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const {
      intl: { formatMessage },
    } = this.props;
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'resetPass.notpass' }));
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
  switchVerify = verifyType => () => {
    this.setState({ verifyType });
  };
  sendSmsCode = callBack => {
    const {
      intl: { formatMessage },
    } = this.props;
    const phone = _.get(this.props, 'userConfig.phone');
    if (phone) {
      this.props.actions.sendSmsCode(
        phone,
        r => {
          callBack(r);
          if (_.get(r, 'code')) {
            this.setState({ initialSmsCode: _.get(r, 'code') });
          }
        },
        formatMessage
      );
    }
  };
  hasErrors = fieldsError => {
    console.log(fieldsError);
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  };
  urlJump = path => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
  };
  render() {
    const {
      history,
      match,
      baseRoute,
      prefix,
      buttonLoading,
      intl: { formatMessage },
    } = this.props;
    const {
      verifyType,
      stateButtonLoading,
      tooltipMsg,
      initialSmsCode,
    } = this.state;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    };
    const tabPath = getLevelPath(unZip(getSubPath('/user')));

    const googleEnable = _.get(this.props, 'userConfig.googleVerify');
    const inputStyle = { width: 300, height: 36 };
    const passwordError =
      isFieldTouched('password') && getFieldError('password');
    console.log(passwordError);
    const repasswordError =
      isFieldTouched('repassword') && getFieldError('repassword');
    const phoneCodeError =
      isFieldTouched('phoneCode') && getFieldError('phoneCode');
    const googleCodeError =
      isFieldTouched('googleCode') && getFieldError('googleCode');
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/setting"
        history={history}
        match={match}
      >
        <DeepBreadcrumb
          arr={[<M id="pkAddress.user" />, <M id="user.resetPass" />]}
          actions={[this.urlJump.bind(null, '/user/setting')]}
        />
        <Form onSubmit={this.handleSubmit} className="reset-pass-form">
          <FormItem
            {...formItemLayout}
            validateStatus={passwordError ? 'error' : ''}
            label={<M id="resetPass.newpass" />}
            help={passwordError || ''}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.validatePassword,
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(
              <InputWithClear
                placeholder={formatMessage({ id: 'resetPass.placenewpass' })}
                resetField={this.resetField}
                inputKey="password"
                type="password"
                style={inputStyle}
                tooltipMsg={tooltipMsg}
                withEye
              />
            )}
            <div className="resetpass-tips">
              <M id="resetPass.tips" values={{ data: 24 }} />
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            validateStatus={repasswordError ? 'error' : ''}
            label={<M id="resetPass.surepass" />}
            help={repasswordError || ''}
          >
            {getFieldDecorator('repassword', {
              rules: [
                {
                  required: true,
                  message: formatMessage(
                    { id: 'resetPass.againnewpass' },
                    { data: 2 }
                  ),
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <InputWithClear
                placeholder={formatMessage({ id: 'resetPass.againnewpass' })}
                resetField={this.resetField}
                inputKey="repassword"
                onBlur={this.handleConfirmBlur}
                type="password"
                style={inputStyle}
                withEye
              />
            )}
          </FormItem>
          {verifyType === 'phoneCode' && !initialSmsCode && (
            <FormItem
              {...formItemLayout}
              validateStatus={phoneCodeError ? 'error' : ''}
              label={<M id="resetPass.messagecode" />}
              help={phoneCodeError || ''}
            >
              {getFieldDecorator('phoneCode', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'resetPass.placemessagecode',
                    }),
                  },
                ],
              })(
                <InputWithClear
                  placeholder={formatMessage({
                    id: 'resetPass.placemessagecode',
                  })}
                  resetField={this.resetField}
                  inputKey="phoneCode"
                  type="wal-number"
                  addonAfter={
                    <CountDown
                      label={<M id="resetPass.sendCode" />}
                      onCount={this.sendSmsCode}
                    />
                  }
                  style={inputStyle}
                />
              )}
            </FormItem>
          )}
          {verifyType === 'google' && (
            <FormItem
              {...formItemLayout}
              validateStatus={googleCodeError ? 'error' : ''}
              label={<M id="resetPass.ggcode" />}
              help={googleCodeError || ''}
            >
              {getFieldDecorator('googleCode', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'resetPass.placeggcode',
                    }),
                  },
                ],
              })(
                <InputWithClear
                  placeholder={formatMessage({
                    id: 'resetPass.placeggcode',
                  })}
                  resetField={this.resetField}
                  inputKey="googleCode"
                  style={inputStyle}
                />
              )}
            </FormItem>
          )}
          {/* {(googleEnable && (
            <FormItem
              wrapperCol={{ span: 12, offset: 6 }}
              className="switch-btn">
              {(verifyType === 'phoneCode' && (
                <a onClick={this.switchVerify('google')}>
                  <M id="resetPass.swicthgg" />
                </a>
              )) || (
                <a onClick={this.switchVerify('phoneCode')}>
                  <M id="resetPass.switchmes" />
                </a>
              )}
            </FormItem>
          )) ||
            null} */}
          <FormItem wrapperCol={{ span: 12, offset: 7 }}>
            <StyledButton
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={buttonLoading && stateButtonLoading}
              disabled={this.hasErrors(getFieldsError()) || stateButtonLoading}
              style={inputStyle}
            >
              <M id="resetPass.submit" />
            </StyledButton>
          </FormItem>
        </Form>
      </LayoutLR>
    );
  }
}

ResetPass.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').invite.toJS();
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, { logout }),
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
