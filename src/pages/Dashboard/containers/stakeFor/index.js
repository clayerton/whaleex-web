import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { withRouter, Route } from 'react-router-dom';
import {
  LayoutLR,
  M,
  Switch,
  Table,
  DeepBreadcrumb,
  InputWithClear,
} from 'whaleex/components';
import { ChangeStakeALertModal } from 'whaleex/components/WalModal';
import { StyledButton } from '../../style.js';
import { Form, Button, notification, Icon, Modal } from 'antd';
const confirm = Modal.confirm;
import { injectIntl } from 'react-intl';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { chainModal } from 'whaleex/common/actionsChain.js';
import { pageMap, unZip, getLevelPath, getSubPath } from 'whaleex/routeMap';
import * as allActions from 'whaleex/common/actions.js';
import './style.less';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const FormItem = Form.Item;

class StakeFor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.form.validateFields();
  }
  componentWillReceiveProps(nextProps) {}
  generatePk = async () => {
    const { userUniqKey, allPks, eosConfig } = this.props;
    const localKeys = await loadKeyDecryptData();
    const pk = await chainModal({
      userUniqKey,
      pks: allPks || [],
      eos: eosConfig,
      localKeys,
      userId: sessionStorage.getItem('userId'),
    });
    this.props.actions.loadPk();
    return pk;
  };
  handleSubmit = e => {
    this.setState({ buttonLoading: true });
    const {
      intl: { formatMessage },
    } = this.props;
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const publicKey = await this.generatePk();
        const { currentStakeFor } = this.props;
        const { stakeForAccount } = values;
        const userUniqKey = _.get(this.props, 'userUniqKey');
        const userEosAccount = _.get(this.props, 'userConfig.userEosAccount');
        const exEosAccount = _.get(this.props, 'eosConfig.result.exEosAccount');
        if (currentStakeFor === stakeForAccount) {
          this.confirmChangeStake({
            stakeForAccount,
            userUniqKey,
            userEosAccount,
            exEosAccount,
            publicKey,
          });
          return;
        }
        const confirmModal = confirm({
          content: (
            <ChangeStakeALertModal
              onCancel={() => {
                confirmModal.destroy();
                this.setState({ buttonLoading: false });
              }}
              onOk={() => {
                confirmModal.destroy();
                setTimeout(() => {
                  this.confirmChangeStake({
                    stakeForAccount,
                    userUniqKey,
                    userEosAccount,
                    exEosAccount,
                    publicKey,
                  });
                }, 300);
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
  confirmChangeStake = params => {
    const {
      intl: { formatMessage },
    } = this.props;
    const {
      stakeForAccount,
      userUniqKey,
      userEosAccount,
      exEosAccount,
      publicKey,
    } = params;
    this.props.actions.setStakeFor(
      {
        eosAccount: exEosAccount, //交易所账号
        userAccount: userEosAccount, //用户账号
        targetAccount: stakeForAccount, //接收账号
        userUniqKey,
        publicKey,
      },
      r => {
        this.setState({ buttonLoading: false });
        if (r) {
          setTimeout(() => {
            this.props.history.goBack();
          }, 500);
          //成功提示
          notification.open({
            message: (
              <span>{formatMessage({ id: 'cpuRent.setStakeForSuccess' })}</span>
            ),
            description: (
              <span>{formatMessage({ id: 'cpuRent.stakeForDetail' })}</span>
            ),
            icon: (
              <Icon
                type="check-circle"
                style={{ color: 'rgb(87, 212, 170)' }}
              />
            ),
          });
        }
      }
    );
  };
  resetField = key => {
    this.props.form.setFields({
      [key]: {
        value: undefined,
      },
    });
  };
  setMyAccountField = () => {
    const userEosAccount = _.get(this.props, 'userConfig.userEosAccount');
    this.props.form.setFields({
      stakeForAccount: {
        value: userEosAccount,
      },
    });
  };
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  checkAccountFormat = (rule, value, callback) => {
    const {
      intl: { formatMessage },
    } = this.props;
    const form = this.props.form;
    let checkReg = /(^[a-z1-5.]{1,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/;
    if (!value) {
      callback(formatMessage({ id: 'cpuRent.stakeForPlaceholder' }));
      return;
    } else if (!checkReg.test(value)) {
      callback(formatMessage({ id: 'cpuRent.accountError' }));
      return;
    } else {
      callback();
    }
  };
  urlJump = path => {
    this.props.history.push([BASE_ROUTE, prefix, path].join(''));
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
      intl: { formatMessage },
      currentStakeFor,
    } = this.props;
    const tabPath = getLevelPath(unZip(getSubPath('/user')));
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form;
    const { buttonLoading, tooltipMsg } = this.state;
    const inputStyle = { width: 300, height: 40 };
    const stakeForAccountError =
      isFieldTouched('stakeForAccount') && getFieldError('stakeForAccount');
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
    };
    return (
      <LayoutLR
        {...this.props}
        tabPath={tabPath}
        curPath="/user/setting"
        history={history}
        match={match}
      >
        <DeepBreadcrumb
          arr={[<M id="pkAddress.user" />, <M id="cpuRent.stakeFor" />]}
          actions={[this.urlJump.bind(null, '/user/setting')]}
        />
        <Form onSubmit={this.handleSubmit} className="set-cpu-form">
          <FormItem
            {...formItemLayout}
            validateStatus={stakeForAccountError ? 'error' : ''}
            label={<M id="cpuRent.stakeForAccount" />}
            help={stakeForAccountError || ''}
          >
            {getFieldDecorator('stakeForAccount', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'cpuRent.stakeForPlaceholder' }),
                },
                {
                  validator: this.checkAccountFormat,
                },
              ],
              initialValue: currentStakeFor,
            })(
              <InputWithClear
                placeholder={formatMessage({
                  id: 'cpuRent.stakeForPlaceholder',
                })}
                resetField={this.resetField}
                inputKey="stakeForAccount"
                onBlur={this.handleConfirmBlur}
                style={inputStyle}
              />
            )}
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 7 }}>
            <span className="url-style no-line setMyAccount-link">
              <span onClick={this.setMyAccountField}>
                <M id="cpuRent.setMyStakeFor" />
              </span>
            </span>
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
          <FormItem wrapperCol={{ span: 12, offset: 7 }}>
            <span className="cet-cpu-tip">
              <M id="cpuRent.tipBottom" richFormat />
            </span>
          </FormItem>
        </Form>
      </LayoutLR>
    );
  }
}

StakeFor.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').stakeFor.toJS();
}

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(allActions, dispatch),
});

export const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const StakeForForm = Form.create()(StakeFor);
export default injectIntl(
  compose(
    withRouter,
    withConnect
  )(StakeForForm)
);
