import context from 'whaleex/utils/service';
import { Icon, notification, Modal, message } from 'antd';
import {
  encryptDataSaveKey,
  loadKeyDecryptData,
  deleteStoreByKey,
  saveCustomConfig,
  getCustomConfig,
} from './webCrypKey.js';

import { ChainModal } from 'whaleex/components';
import { silentModal } from 'whaleex/components/ChainComp/silentModal.js';
const confirm = Modal.confirm;
import * as types from './constants';
export const chainModal = data => {
  return new Promise(async (resolve, reject) => {
    const { type, userUniqKey, pks = [], localKeys = {}, userId } = data;
    const mapPks = pks.map(({ pk }) => pk);
    if (mapPks.includes(localKeys.pubkey)) {
      //本地的pk已被绑定 正常跳转登录
      resolve(localKeys.pubkey);
      return;
    }
    if (window.PkSafeLock) {
      resolve();
      return;
    }
    // else if (mapPks.length >= 3) {
    //   //绑定已到3个ok
    //   data.step = 'bind3Error';
    //   message.error('您已激活3个设备，解绑任一其它设备才能在本设备登录！');
    //   resolve(false);
    //   return;
    // }
    // else if (mapPks.length === 1) {
    //   //新建pk 并绑定
    //   //新建提示框在登录页面只显示一次
    //   data.step = 'deviceNew';
    //   let config = await getCustomConfig();
    //   const { activeModalShowTimes = 0 } = config;
    //   if (localKeys.pubkey && activeModalShowTimes > 0) {
    //     resolve(localKeys.pubkey);
    //     return;
    //   } else {
    //     saveCustomConfig({ ...config, activeModalShowTimes: 1 });
    //   }
    // } else {
    //   data.step = 'chainSuccess';
    // }
    const pkR = await silentModal({ userUniqKey, userId });
    resolve((pkR && pkR.pubkey) || false);
    // const confirmModal = confirm({
    //   content: (
    //     <ChainModal
    //       data={data}
    //       onCancel={() => {
    //         confirmModal.destroy();
    //         resolve(false);
    //       }}
    //       onOk={pk => {
    //         confirmModal.destroy();
    //         resolve(pk);
    //       }}
    //     />
    //   ),
    //   title: null,
    //   className: 'whaleex-chain-modal',
    //   iconType: true,
    //   okCancel: false,
    //   width: '590px',
    // });
  });
};
export const bindPk = params => {
  return new Promise(async (reslove, reject) => {
    let { data } = await context.http.post(`/BUSINESS/api/account/pk`, params);
    if (data.returnCode !== '0') {
      // message.warning(data.message);
    }
    reslove(data.returnCode === '0');
  });
};
export const getUserEosAccount = pk => {
  return new Promise(async (reslove, reject) => {
    let { data } = await context.http.get(`/BUSINESS/api/account`);
    if (data.returnCode !== '0') {
      message.warning(data.message);
    }
    reslove(data.result);
  });
};
export const getEOScontract = () => {
  return new Promise(async (reslove, reject) => {
    let { data } = await context.http.get(`/BUSINESS/api/public/currency`);
    reslove(data);
  });
};
