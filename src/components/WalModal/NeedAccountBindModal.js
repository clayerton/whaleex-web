import React from 'react';
import PropTypes from 'prop-types';

import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import Loading from 'whaleex/components/Loading';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import { chainModal } from 'whaleex/common/actionsChain.js';

import { Wrap } from './style.js';
import U from 'whaleex/utils/extends';

export default class NeedAccountBindModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onOk = async () => {
    const { extendData } = this.props;
    const { userUniqKey, allPks, eosConfig } = extendData.superProps.app;
    const loadPk = _.get(
      extendData,
      'actions.loadPk',
      _.get(extendData, 'actions.actions.loadPk')
    );
    this.setState({ localPubkeyGenerating: true });
    const localKeys = await loadKeyDecryptData();
    //未激活的每次进入这里都会签名  调用bindPk
    const pk = await chainModal({
      userUniqKey,
      pks: allPks || [],
      eos: eosConfig,
      localKeys,
      userId: sessionStorage.getItem('userId'),
    });
    loadPk();
    this.setState({ localPubkeyGenerating: false });
    this.props.onOk();
  };
  render() {
    const { onCancel, onOk, isActive } = this.props;
    const { localPubkeyGenerating } = this.state;
    const lan = U.getUserLan(); //step-4 取当前语言

    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <Wrap className="NeedAccountBindModal">
          <Icon type="close" onClick={onCancel} className="close-btn" />
          <div className="content">
            <h1>
              {(!isActive && <M id="components.userBind" />) || (
                <M id="pkAddress.goActive" />
              )}
            </h1>
            <div className="padding">
              <p>
                {(!isActive && <M id="components.needBind" />) || (
                  <M id="components.needActivePk" />
                )}
              </p>
              <StyledButton
                className="confirm-btn"
                type="primary"
                disabled={localPubkeyGenerating}
                onClick={this.onOk}>
                {(localPubkeyGenerating && <Loading />) || null}
                {(!isActive && <M id="components.bindStart" />) || (
                  <M id="orderInput.activeDevice" />
                )}
              </StyledButton>
            </div>
          </div>
        </Wrap>
      </IntlProvider>
    );
  }
}
