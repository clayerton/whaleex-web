import Cookies from 'js-cookie';
import { Modal } from 'antd';
import GuideModal from './GuideModal.js';
import GuideModal600 from './GuideModal600.js';
import axios from 'axios';
const confirm = Modal.confirm;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
const showGuideModal = async userConfig => {
  //只在用户设置密码后显示该提示框
  let { phone, hasPassword, userEosAccount } = userConfig;
  phone = phone || '';
  let modalKey = 'walGuideModal';
  if (!userEosAccount) {
    modalKey = 'walEosGuideModal';
  }
  let suffix = phone.slice(-5);
  if (window.isPoolEmpty === undefined) {
    try {
      let { data } = await axios({
        method: 'get',
        url: _config.app_api + '/OCEAN/api/wal/invReg/poolEmpty',
      });
      window.isPoolEmpty = _.get(data, 'result', false); //达到红包硬顶
    } catch (e) {}
  }

  if (!window[modalKey + suffix] && hasPassword && !window.isPoolEmpty) {
    const { idCardVerify } = userConfig;
    let step = 1;
    if (!userEosAccount && !idCardVerify) {
      step = 1;
    } else if (!userEosAccount && idCardVerify) {
      step = 2;
    } else if (userEosAccount && !idCardVerify) {
      step = 3;
    } else {
      return;
    }
    const cookieStep = Cookies.get(modalKey + suffix);
    Cookies.set(modalKey + suffix, step, { expires: 365 });
    if ((cookieStep || '1') === `${step}` && cookieStep) {
      return;
    }
    let guideModal = (
      <GuideModal
        data={{ userConfig, step }}
        onCancel={() => {
          console.log('oncancel');
          window[modalKey + suffix].destroy();
        }}
        onOk={target => {
          const path = [BASE_ROUTE, prefix, target].join('');
          window.walHistory.push(path);
          window[modalKey + suffix].destroy();
        }}
      />
    );
    let className = 'whaleex-common-modal';
    let width = '500px';
    if (!userEosAccount) {
      guideModal = (
        <GuideModal600
          data={{ userConfig, step }}
          onCancel={() => {
            console.log('oncancel');
            window[modalKey + suffix].destroy();
          }}
          onOk={target => {
            const path = [BASE_ROUTE, prefix, target].join('');
            window.walHistory.push(path);
            window[modalKey + suffix].destroy();
          }}
        />
      );
      className = 'whaleex-common-modal transparent-bk';
      width = '600px';
    }
    // !Cookies.get(modalKey + suffix) &&
    window[modalKey + suffix] = confirm({
      content: guideModal,
      title: null,
      className,
      iconType: true,
      okCancel: false,
      width,
    });
  }
};
export default showGuideModal;
