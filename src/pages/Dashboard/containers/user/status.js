import { Icon } from 'antd';
import { M } from 'whaleex/components';

import { StyledButton } from 'whaleex/pages/Dashboard/style.js';

import { StatusMsg } from './style/style.js';
export const getEosAccountStatus = (props, actionData) => {
  const { actionType, actionStatus, actionAcount, pks = [] } = actionData;
  const status = ['BINDED', 'NOTBIND', 'BINDING', 'UNBINDING', 'FAILURE'];
  //eosaccount 没有UNBINDING
  let cur = undefined;
  let msg = undefined;
  const isEosAccountBinded = !!_.get(props, 'eosAccount.eosAccount');
  if (isEosAccountBinded) {
    cur = 'BINDED';
    msg = _.get(props, 'eosAccount.eosAccount');
  } else if (
    pks.length === 0 &&
    actionStatus &&
    ['STORED', 'UNBIND', 'FAILURE'].includes(actionType)
  ) {
    cur = 'BINDING';
    msg = (
      <StatusMsg className="is-going">
        <Icon type="clock-circle" />
        <M id="user.binding" values={{ account: actionAcount }} />
      </StatusMsg>
    );
  } else if (actionType === 'FAILURE' && actionStatus === false) {
    cur = 'FAILURE';
    msg = (
      <StatusMsg className="not-active">
        <Icon type="exclamation-circle" />
        <M id="user.bindFail" values={{ account: actionAcount }} />
        <StyledButton
          style={{
            borderRadius: '50px',
            padding: '0 15px',
            marginLeft: '10px',
          }}>
          <a
            href="https://support.whaleex.com/hc/zh-cn/requests/new"
            target="_blank">
            <M id="user.contactUs" />
          </a>
        </StyledButton>
      </StatusMsg>
    );
  } else if (actionType === 'ACTIVED' && actionStatus === false) {
    cur = 'BINDED';
    msg = actionAcount;
  } else {
    cur = 'NOTBIND';
    msg = (
      <StatusMsg className="not-active">
        <Icon type="exclamation-circle" />
        <M id="user.notBind" />
      </StatusMsg>
    );
  }
  return { status, cur, msg };
};
// ACTIVED true unbinding false binded/actived
// UNBIND true binding false notbind/stored
// STORED true binding false notbind/stored
// FAILURE true binding false failure
export const getLocalPkStatus = (
  actionData,
  pks = [],
  pubkey = {},
  userPkStatus = {}
) => {
  const { actionType, actionStatus, actionAcount } = actionData;
  const status = [
    'STORED',
    'ACTIVED',
    'BINDING',
    'UNBINDING',
    'FAILURE',
    'UNBIND',
  ];
  let cur = _.get(userPkStatus, 'status', 'STORED'); //'' STORED  ACTIVED  UNBIND
  let msg = undefined;
  if (actionType === 'ACTIVED' && actionStatus) {
    cur = 'UNBINDING';
    msg = (
      <StatusMsg className="is-going">
        <Icon type="clock-circle" />
        <M id="user.deviceUnbinding" />
      </StatusMsg>
    );
  } else if (actionType === 'ACTIVED' && actionStatus === false) {
    cur = 'ACTIVED';
  } else if (
    ['UNBIND', 'STORED', 'FAILURE'].includes(actionType) &&
    actionStatus
  ) {
    cur = 'BINDING';
    msg = (
      <StatusMsg className="is-going">
        <Icon type="clock-circle" />
        <M id="user.deviceBinding" />
      </StatusMsg>
    );
  } else if (actionType === 'FAILURE' && actionStatus === false) {
    cur = 'FAILURE';
  } else if (['', 'STORED', 'UNBIND'].includes(actionType)) {
    cur = 'STORED';
  }
  return { status, cur, msg };
};
