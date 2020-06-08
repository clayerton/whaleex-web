import { ScatterFinded, ScatterBind } from 'whaleex/components/WalModal';
import context from 'whaleex/utils/service';
import M from 'whaleex/components/FormattedMessage'; //step-2

import { Modal, notification, Icon } from 'antd';

const confirm = Modal.confirm;
let msgMap = undefined;
/**
 * [loadScatter description]
 * @param  config [description]
 * network, 插件网络配置等
 * withConfirm, 是否弹出插件检测提醒弹窗
 * eosAccount, 用户已在平台使用的地址
 * depositAddress, 转账目标地址
 * memo,备注信息
 * actionType 操作类型  ACTIVE  BIND UNBIND
 */
//TODO 换成eventlistener lz
export function loadScatter(config, callBack) {
  const { formatMessage } = config;
  msgMap = {
    BIND: {
      success: formatMessage({ id: 'scatter.bindSuccess' }, { min: '3' }),
      already: formatMessage({ id: 'scatter.bindAlready' }),
    },
    ACTIVE: {
      success: formatMessage({ id: 'scatter.activeSuccess' }, { min: '3' }),
      already: formatMessage({ id: 'scatter.activeAlready' }),
    },
    UNBIND: {
      success: formatMessage({ id: 'scatter.unbindSuccess' }, { min: '3' }),
      already: formatMessage({ id: 'scatter.unbindAlready' }),
    },
    userReject: formatMessage({ id: 'scatter.userReject' }),
    unknownError: 'unknownError',
    AccountNotFound: eosAccount => (
      <div>
        <p>{formatMessage({ id: 'scatter.accountNotFound' })}</p>
        <p style={{ fontWeight: 'bold' }}>{eosAccount}</p>
        <p>{formatMessage({ id: 'scatter.rePullAccount' })}</p>
      </div>
    ),
  };
  clearTimeout(window.scatterTimer);
  const { withConfirm } = config;
  if (window.scatter) {
    callBack && callBack();
    if (!withConfirm) {
      scatterASK(config);
    }
    //  else {
    //   const confirmModal = confirm({
    //     content: (
    //       <ScatterFinded
    //         onCancel={() => {
    //           confirmModal.destroy();
    //         }}
    //         onOk={() => {
    //           scatterASK(config);
    //           confirmModal.destroy();
    //         }}
    //       />
    //     ),
    //     title: null,
    //     className: 'whaleex-common-modal',
    //     iconType: true,
    //     okCancel: false,
    //     width: '400px',
    //   });
    // }
  } else {
    window.scatterTimer = setTimeout(
      loadScatter.bind(null, config, callBack),
      2000
    );
  }
}
async function scatterASK(config = {}) {
  let { eosAccount, actionType, network } = config;
  network = await getRemoteConfig();
  const { chainId } = network;
  const scatter = window.scatter;
  // window.scatter = null;
  // scatter.suggestNetwork(network);
  const identity = scatter
    .getIdentity({
      accounts: [
        {
          chainId,
        },
      ],
    })
    .then(data => {
      const { accounts } = data;
      if (!eosAccount || !!_.find(accounts, ['name', eosAccount])) {
        const confirmModal = confirm({
          content: (
            <ScatterBind
              data={data}
              eosAccount={eosAccount}
              actionType={actionType}
              onCancel={() => {
                confirmModal.destroy();
              }}
              onOk={userEosAccount => {
                scatterTransform({
                  actionType,
                  scatter,
                  userEosAccount,
                  config: Object.assign({}, config, { network }),
                });
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
      } else {
        msgNotification({
          isSuccess: false,
          msg: {
            type: 'account_notfound',
            message: msgMap.AccountNotFound(eosAccount),
          },
          actionType,
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
}
export function scatterTransform(params) {
  const { scatter, userEosAccount, config, actionType } = params;
  const { network, depositAddress, memo } = config; //eosAccount
  (async () => {
    const eos = (window.eos = scatter
      .eos(network, Eos, {})
      .contract('eosio.token')
      .then(eos => {
        eos
          .transfer(userEosAccount, depositAddress, '0.0001 EOS', memo)
          .then(res => {
            msgNotification({ isSuccess: true, actionType });
          })
          .catch(e => {
            msgNotification({ isSuccess: false, msg: e, actionType });
          });
      }));
  })();
}

function msgNotification({ isSuccess, msg = {}, actionType }) {
  let _msg = msg;
  if (typeof msg === 'string') {
    _msg = JSON.parse(msg);
  }
  const { type, message, code } = _msg; //type=signature_rejected 用户拒绝了Scatter
  if (isSuccess) {
    notification.open({
      message: <span>Scatter</span>,
      description: (
        <div>
          <p>{msgMap[actionType].success}</p>
        </div>
      ),
      icon: <Icon type="check-circle" style={{ color: 'rgb(87, 212, 170)' }} />,
    });
  } else {
    let errorMsg = msgMap[actionType].already;
    if (type === 'signature_rejected') {
      errorMsg = msgMap.userReject;
    } else if (type === 'account_notfound') {
      errorMsg = message;
    } else if (code && code !== 200) {
      errorMsg = message;
    } else {
      errorMsg = msgMap[actionType].already;
    }
    notification.open({
      message: <span>Scatter</span>,
      description: (
        <div>
          <p>{errorMsg}</p>
        </div>
      ),
      icon: (
        <Icon
          type="exclamation-circle"
          style={{ color: 'rgb(217, 242, 94)' }}
        />
      ),
    });
  }
}
function getRemoteConfig() {
  const defaultNetwork = {
    protocol: 'https',
    blockchain: 'eos',
    host: 'eosnode.whaleex.com.cn',
    port: 443,
    chainId: 'c0e5d4573873b00e93c12b76f98168b8e72db3177b27892a2c17921f29a0da66',
  };
  return new Promise(async (reslove, reject) => {
    let { data } = await context.http.get(`/BUSINESS/api/node/eos`);
    const network = _.get(data, 'result[0]', defaultNetwork);
    reslove(network);
  });
}
