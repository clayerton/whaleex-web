import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { Form, Button, notification, Icon, Modal } from 'antd';
import { injectIntl } from 'react-intl';

import {
  M,
  Breadcrumb,
  PhoneInput,
  InputWithClear,
  LayoutLR,
  CountDown,
  CodeModal,
  DeepBreadcrumb,
} from 'whaleex/components';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import { sendCode, getUserConfig, logout } from 'whaleex/common/actions.js';
import './style.less';
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
      value: '',
    };
  }
  componentDidMount() {
    this.props.form.validateFields();
  }
  componentWillReceiveProps(nextProps) {}
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { newPhone, newPhoneCode } = values;
        this.showConfirmModal(newPhone, newPhoneCode);
      }
    });
  };
  showConfirmModal = (newPhone, newPhoneCode) => {
    const {
      userConfig,
      history,
      actions: { getUserConfig },
      intl: { formatMessage },
    } = this.props;
    const googleEnable = _.get(this.props, 'userConfig.googleVerify');
    let codeLayout = 'phoneCode';
    if (googleEnable) {
      codeLayout = ['phoneCode', 'googleCode'];
    }
    const confirmModal = confirm({
      content: (
        <CodeModal
          onCancel={() => {
            confirmModal.destroy();
          }}
          onSend={this.props.actions.sendCode}
          onConfirm={(codes, callBack) => {
            this.props.actions.confirmModify(
              {
                ...codes,
                newPhone,
                newPhoneCode,
                verifyType: 'phoneChange',
              },
              (status, msg) => {
                //本身为 action 回调
                // callBack 来自组件回调
                if (status) {
                  confirmModal.destroy();
                  notification.open({
                    message: (
                      <span>{formatMessage({ id: 'resetPhone.userset' })}</span>
                    ),
                    description: (
                      <span>
                        {formatMessage({ id: 'resetPhone.bindsuccess' })}
                      </span>
                    ),
                    icon: (
                      <Icon
                        type="check-circle"
                        style={{ color: 'rgb(87, 212, 170)' }}
                      />
                    ),
                  });
                  setTimeout(() => {
                    this.props.actions.logout(history);
                    // history.push([BASE_ROUTE, prefix, '/user/setting'].join(''));
                    // getUserConfig();
                  }, 1000);
                }
                callBack(status, msg);
              }
            );
          }}
          types={{ mailCode: 'phoneChange', phoneCode: 'phoneChange_old' }}
          codeLayout={[codeLayout]}
          // codeLayout={['mailCode', codeLayout]}
          addressList={userConfig}
        />
      ),
      title: null,
      className: 'whaleex-confirm',
      iconType: true,
      okCancel: false,
      width: 450,
    });
  };
  resetField = key => {};

  validatePhone = (rule, value, callback) => {
    callback();
  };
  sendSmsCode = (type, callBack) => {
    const {
      intl: { formatMessage },
    } = this.props;
    const newPhone = this.props.form.getFieldValue('newPhone');
    if (newPhone) {
      this.props.actions.sendSmsCode(newPhone, type, callBack, formatMessage);
    }
  };
  hasErrors = fieldsError => {
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
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
      getFieldValue,
    } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    };
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const inputStyle = { width: 300, height: 40 };
    const newPhoneError =
      isFieldTouched('newPhone') && getFieldError('newPhone');
    const newPhoneCodeError =
      isFieldTouched('newPhoneCode') && getFieldError('newPhoneCode');
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/setting"
        history={history}
        match={match}>
        <DeepBreadcrumb
          arr={[<M id="pkAddress.user" />, <M id="user.resetPhone" />]}
          actions={[this.urlJump.bind(null, '/user/setting')]}
        />
        <Form onSubmit={this.handleSubmit} className="reset-phone-form">
          <FormItem
            {...formItemLayout}
            validateStatus={newPhoneError ? 'error' : ''}
            label={formatMessage({ id: 'resetPhone.phone' })}
            help={newPhoneError || ''}>
            {getFieldDecorator('newPhone', {
              rules: [
                {
                  validator: this.validatePhone,
                },
              ],
            })(
              <PhoneInput
                placeholder={formatMessage({ id: 'resetPhone.placeNewPhone' })}
                resetField={this.resetField}
                inputKey="newPhone"
                style={inputStyle}
                maxLength="11"
              />
            )}
          </FormItem>
          <span className="new-phone-alert">
            <M id="resetPhone.messagebind" />
          </span>
          <FormItem
            {...formItemLayout}
            validateStatus={newPhoneCodeError ? 'error' : ''}
            label={<M id="resetPhone.messagecode" />}
            help={newPhoneCodeError || ''}>
            {getFieldDecorator('newPhoneCode', {
              // rules: [{ required: true, message: '请输入短信验证码' }],
            })(
              <InputWithClear
                placeholder={formatMessage({
                  id: 'resetPhone.placemessagecode',
                })}
                resetField={this.resetField}
                inputKey="newPhoneCode"
                type="wal-number"
                addonAfter={
                  <CountDown
                    label={<M id="resetPhone.sendCode" />}
                    onCount={this.sendSmsCode.bind(null, 'phoneChange_new')}
                    disabled={!getFieldValue('newPhone')}
                  />
                }
                style={inputStyle}
              />
            )}
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 7 }}>
            <StyledButton
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={buttonLoading}
              disabled={
                !getFieldValue('newPhone') || !getFieldValue('newPhoneCode')
              }
              style={inputStyle}>
              <M id="resetPhone.sure" />
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
    Object.assign({}, allActions, { sendCode, getUserConfig, logout }),
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
