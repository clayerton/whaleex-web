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
import {
  logout,
  getUserConfig,
  getPermissions,
} from 'whaleex/common/actions.js';

import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from './actions';
import './style.less';
import { StyledButton } from '../../style.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const FormItem = Form.Item;

export class SetPass extends React.Component {
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
    this.setState({ buttonLoading: true });
    const {
      intl: { formatMessage },
    } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const phone = _.get(this.props, 'userConfig.phone');
        const { password } = values;
        this.props.actions.confirmModify(
          {
            phone,
            password,
          },
          r => {
            this.setState({ buttonLoading: false });
            if (r) {
              //hjl-2 如果密码设置成功 在这里重新请求一遍用户config信息。
              this.props.actions.getPermissions();
              notification.open({
                message: (
                  <span>{formatMessage({ id: 'resetPass.userset' })}</span>
                ),
                description: (
                  <span>
                    {formatMessage({ id: 'resetPass.resetmessage2' })}
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
                this.urlJump('/user');
              }, 1000);
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
      intl: { formatMessage },
    } = this.props;
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
    const { buttonLoading, tooltipMsg } = this.state;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const inputStyle = { width: 300, height: 40 };
    const passwordError =
      isFieldTouched('password') && getFieldError('password');
    const repasswordError =
      isFieldTouched('repassword') && getFieldError('repassword');
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/setting"
        history={history}
        match={match}
      >
        <DeepBreadcrumb
          arr={[<M id="pkAddress.user" />, <M id="user.setPass" />]}
          actions={[this.urlJump.bind(null, '/user/setting')]}
        />
        <Form onSubmit={this.handleSubmit} className="set-pass-form">
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
                  message: formatMessage({ id: 'resetPass.againnewpass' }),
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
          <FormItem wrapperCol={{ span: 12, offset: 7 }}>
            <StyledButton
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={buttonLoading}
              disabled={this.hasErrors(getFieldsError()) || buttonLoading}
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

SetPass.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').invite.toJS();
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    Object.assign({}, allActions, { logout, getUserConfig, getPermissions }),
    dispatch
  ),
});
export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const SetPassForm = Form.create()(SetPass);
export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(SetPassForm)
);
