
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import { Form, Button, notification, Icon, Modal } from 'antd';
import {
  M,
  Breadcrumb,
  InputWithClear,
  LayoutCT,
  CountDown,
  CodeModal,
} from 'whaleex/components';
import { injectIntl } from 'react-intl';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import { sendCode, getUserConfig } from 'whaleex/common/actions.js';
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
        const { email, mailCode } = values;
        this.showConfirmModal(email, mailCode);
      }
    });
  };
  showConfirmModal = (email, mailCode) => {
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
                email,
                mailCode,
                verifyType: 'emailBound',
              },
              (status, msg) => {
                //本身为 action 回调
                // callBack 来自组件回调
                if (status) {
                  confirmModal.destroy();
                  notification.open({
                    message: (
                      <span>{formatMessage({ id: 'resetMail.userset' })}</span>
                    ),
                    description: (
                      <span>
                        {formatMessage({ id: 'resetMail.emailbind' })}
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
                    history.push([BASE_ROUTE, prefix, '/user/setting'].join(''));
                    getUserConfig();
                  }, 1000);
                }
                callBack(status, msg);
              }
            );
          }}
          types={{ phoneCode: 'emailBound' }}
          codeLayout={[codeLayout]}
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
  resetField = key => {
    this.props.form.setFields({
      [key]: {
        value: undefined,
      },
    });
  };

  validateMail = (rule, value, callback) => {
    callback();
  };
  sendSmsCode = (type, callBack) => {
    const email = this.props.form.getFieldValue('email');
    if (email) {
      this.props.actions.sendCode(type, 'mailCode', email, callBack);
    }
  };
  hasErrors = fieldsError => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
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
    const inputStyle = { width: 300, height: 40 };
    const emailError = isFieldTouched('email') && getFieldError('email');
    const mailCodeError =
      isFieldTouched('mailCode') && getFieldError('mailCode');
    return (
      <LayoutCT history={history} match={match}>
        <Form onSubmit={this.handleSubmit} className="reset-phone-form">
          <FormItem
            {...formItemLayout}
            validateStatus={emailError ? 'error' : ''}
            label={<M id="resetMail.email" />}
            help={emailError || ''}>
            {getFieldDecorator('email', {
              rules: [
                {
                  validator: this.validateMail,
                },
              ],
            })(
              <InputWithClear
                placeholder={formatMessage({ id: 'resetMail.placeemail' })}
                resetField={this.resetField}
                inputKey="email"
                style={inputStyle}
              />
            )}
          </FormItem>
          <span className="new-phone-alert">
            <M id="resetMail.ifmessage" />
          </span>
          <FormItem
            {...formItemLayout}
            validateStatus={mailCodeError ? 'error' : ''}
            label={<M id="resetMail.emailcode" />}
            help={mailCodeError || ''}>
            {getFieldDecorator('mailCode', {
              // rules: [{ required: true, message: '请输入短信验证码' }],
            })(
              <InputWithClear
                placeholder={formatMessage({ id: 'resetMail.placeemailcode' })}
                resetField={this.resetField}
                inputKey="mailCode"
                addonAfter={
                  <CountDown
                    label={<M id="resetMail.sendCode" />}
                    onCount={this.sendSmsCode.bind(null, 'emailBound')}
                    disabled={!getFieldValue('email')}
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
              disabled={!getFieldValue('email') || !getFieldValue('mailCode')}
              style={inputStyle}>
              <M id="resetMail.sure" />
            </StyledButton>
          </FormItem>
        </Form>
      </LayoutCT>
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
