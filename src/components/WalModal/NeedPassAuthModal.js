import React from 'react';
import PropTypes from 'prop-types';
import { Icon, message } from 'antd';
import InputWithClear from 'whaleex/components/InputWithClear';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import Loading from 'whaleex/components/Loading';
import * as allActions from 'whaleex/common/actions.js';
import Cookies from 'js-cookie';
import { Wrap } from './style.js';
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;

export default class NeedPassAuthModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  reLogin = () => {
    this.setState({ loading: true });
    const { actions, superProps } = this.props.extendData;
    const getPermissions = _.get(
      actions,
      'actions.getPermissions',
      _.get(superProps, 'actions.getPermissions', () => {
        console.log('func not found');
      })
    );
    const { password } = this.state;
    const {
      intl: { formatMessage },
      history,
    } = superProps;
    const country = Cookies.get('country');
    const countryCode = JSON.parse(country || '{}').countryCode || 'CN';
    actions.login(
      sessionStorage.getItem('user'),
      password,
      { countryCode, formatMessage },
      history,
      {},
      r => {
        getPermissions();
        if (!r) {
          message.error(formatMessage({ id: 'login.passError' }));
        } else {
          message.success(formatMessage({ id: 'login.passSuccess' }));
          this.props.onOk();
        }
        this.setState({ loading: false });
      },
      'rePassAuth'
    );
  };
  resetField = key => {
    this.setState({ [key]: undefined });
  };
  onChange = e => {
    this.setState({ password: e.target.value });
  };
  render() {
    const { onCancel, onOk, extendData } = this.props;
    const {
      intl: { formatMessage },
      history,
      app,
    } = extendData.superProps;
    const havePass = _.get(app, 'permissions.hasPassword', 'true');
    const { password, loading } = this.state;
    return (
      <Wrap className="NeedPassAuthModal">
        <div className="content">
          <h1>{formatMessage({ id: 'components.inputPass' })}</h1>
          <div className="padding">
            <p>{formatMessage({ id: 'components.confirmPass' })}</p>
            <p>
              <InputWithClear
                type="password"
                placeholder={formatMessage({ id: 'components.passInput' })}
                className="input-field"
                resetField={this.resetField.bind(null, 'password')}
                onChange={this.onChange}
                value={password}
                withEye
              />
            </p>
            <div className="reset-pass">
              <a
                onClick={() => {
                  onCancel();
                  history.push(
                    (havePass === 'true' &&
                      [BASE_ROUTE, prefix, `/usercenter/resetPass`].join(
                        ''
                      )) ||
                      [BASE_ROUTE, prefix, `/usercenter/setPass`].join('')
                  );
                }}>
                <span className="url-style">
                  {formatMessage({
                    id:
                      (havePass === 'true' && 'components.resetPassword') ||
                      'components.setPassword',
                  })}
                </span>
              </a>
            </div>
            <StyledButton
              className="cancel-btn"
              type="primary"
              onClick={onCancel}>
              {formatMessage({ id: 'components.cancel' })}
            </StyledButton>
            <StyledButton
              className="confirm-btn"
              type="primary"
              disabled={!password || loading}
              onClick={this.reLogin}>
              {(loading && <Loading />) || null}
              {formatMessage({ id: 'components.confirm' })}
            </StyledButton>
          </div>
        </div>
      </Wrap>
    );
  }
}
