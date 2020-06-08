import * as T from './constants';
import { Modal } from 'antd';
const confirm = Modal.confirm;
import context from 'whaleex/utils/service';
import { loadKeyDecryptData } from 'whaleex/common/webCrypKey.js';
import AlreadyBindModal from 'whaleex/components/WalModal/WalletModal/AlreadyBindModal.js';
export function getUserPKs(urlJump, urlPageStatus, pk) {
  return async function(dispatch) {
    try {
      let [{ data: pkActived }, { data: pkStored }] = await Promise.all([
        context.http.get(`/BUSINESS/api/account/pk/ACTIVED`),
        context.http.get(`/BUSINESS/api/account/pk/STORED`),
      ]);
      const pks = pkActived.result || [];
      let pkAsk = pk;
      if (!pkAsk) {
        let { pubkey: pubkeyLocal } = await loadKeyDecryptData();
        pkAsk = pubkeyLocal;
      }
      dispatch({
        type: T.REFRESH_PROPS,
        data: {
          pks,
          pksNotActive: pkStored.result || [],
        },
      });
      //
      const pkObj = _.find(pks, ['pk', pkAsk]);
      if (pkObj && pkObj.status === 'ACTIVED' && urlPageStatus === 'BIND') {
        const walModal = confirm({
          content: (
            <AlreadyBindModal
              onCancel={() => {
                walModal.destroy();
              }}
              onOk={target => {
                urlJump('/user/setting');
                walModal.destroy();
              }}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '500px',
        });
        setTimeout(() => {
          walModal.destroy();
          urlJump('/user/setting');
        }, 2000);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
export function getBindHistory() {
  return async function(dispatch) {
    try {
      let [{ data: bindHistory }, { data: unbindHistory }] = await Promise.all([
        context.http.get(`/BUSINESS/api/account/bind/history`),
        context.http.get(`/BUSINESS/api/account/unbind/history`),
      ]);
      dispatch({
        type: T.REFRESH_PROPS,
        data: {
          bindHistory: _.orderBy(
            [...bindHistory.result, ...unbindHistory.result],
            ['timestamp'],
            ['desc']
          ),
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
export function getWallets() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/wallet?type=WEB`);
      dispatch({
        type: T.REFRESH_PROPS,
        data: {
          wallets: data.result || [],
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
