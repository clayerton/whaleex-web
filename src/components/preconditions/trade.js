import { Modal } from 'antd';
import {
  NeedAuditModal,
  NeedAccountBindModal,
  NeedLoginModal,
  NeedPassAuthModal,
} from 'whaleex/components/WalModal';

const confirm = Modal.confirm;
const BASE_ROUTE = _config.base;
const prefix = _config.app_name;
export const getConditions = ({ history, extendData }) => {
  return [
    {
      key: ['trade', 'deposit', 'withdraw', 'cpuSet', 'position'],
      path: 'userConfig',
      confirm: callBack => {
        const confirmModal = confirm({
          content: (
            <NeedLoginModal
              onCancel={noMoreLoginError => {
                confirmModal.destroy();
              }}
              onOk={noMoreLoginError => {
                _czc.push(['_trackEvent', '登录后交易-登录（弹窗）', '点击']);
                confirmModal.destroy();
                history.push([BASE_ROUTE, prefix, '/login'].join(''));
              }}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '400px',
        });
      },
    },
    {
      key: ['trade', 'position'],
      path: 'permissions.byPassword',
      confirm: callBack => {
        const confirmModal = confirm({
          content: (
            <NeedPassAuthModal
              onCancel={noMoreLoginError => {
                confirmModal.destroy();
              }}
              onOk={noMoreLoginError => {
                _czc.push([
                  '_trackEvent',
                  '验证密码后操作-开始验证密码（弹窗）',
                  '点击',
                ]);
                confirmModal.destroy();
              }}
              extendData={extendData}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '400px',
        });
      },
    },
    {
      key: [
        'trade',
        'deposit',
        'withdraw',
        'cpuSet',
        'depoWithList',
        'position',
      ],
      path: 'userConfig.userEosAccount',
      confirm: callBack => {
        const confirmModal = confirm({
          content: (
            <NeedAccountBindModal
              onCancel={noMoreLoginError => {
                confirmModal.destroy();
              }}
              onOk={noMoreLoginError => {
                _czc.push([
                  '_trackEvent',
                  '绑定后操作-开始绑定（弹窗）',
                  '点击',
                ]);
                confirmModal.destroy();
                history.push(
                  [BASE_ROUTE, prefix, '/usercenter/pkAddress/bind'].join(
                    ''
                  )
                );
              }}
              extendData={extendData}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '400px',
        });
      },
    },
    {
      key: ['trade', 'withdraw'], //去除deposit WAL-1871
      path: 'userPkStatus.pkBindSuccess',
      confirm: callBack => {
        const confirmModal = confirm({
          content: (
            <NeedAccountBindModal
              onCancel={noMoreLoginError => {
                confirmModal.destroy();
              }}
              onOk={noMoreLoginError => {
                _czc.push([
                  '_trackEvent',
                  '激活后操作-开始激活（弹窗）',
                  '点击',
                ]);
                confirmModal.destroy();
                history.push(
                  [BASE_ROUTE, prefix, '/usercenter/pkAddress/bind'].join(
                    ''
                  )
                );
              }}
              extendData={extendData}
              isActive={true}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '400px',
        });
      },
    },
    {
      key: ['trade'],
      path: 'userConfig.tradeNeedVerify',
      pathValue: true,
      confirm: callBack => {
        const confirmModal = confirm({
          content: (
            <NeedAuditModal
              onCancel={noMoreLoginError => {
                confirmModal.destroy();
              }}
              onOk={noMoreLoginError => {
                _czc.push([
                  '_trackEvent',
                  '身份认证后交易-开始认证（弹窗）',
                  '点击',
                ]);
                confirmModal.destroy();
                history.push(
                  [BASE_ROUTE, prefix, '/usercenter/auth'].join('')
                );
              }}
              extendData={extendData}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '400px',
        });
      },
    },
    {
      key: ['withdraw'],
      path: 'userData.withdrawNeedVerify',
      pathValue: true,
      confirm: callBack => {
        const confirmModal = confirm({
          content: (
            <NeedAuditModal
              onCancel={noMoreLoginError => {
                confirmModal.destroy();
              }}
              onOk={noMoreLoginError => {
                _czc.push([
                  '_trackEvent',
                  '身份认证后提币-开始认证（弹窗）',
                  '点击',
                ]);
                confirmModal.destroy();
                history.push(
                  [BASE_ROUTE, prefix, '/usercenter/auth'].join('')
                );
              }}
              extendData={extendData}
            />
          ),
          title: null,
          className: 'whaleex-common-modal',
          iconType: true,
          okCancel: false,
          width: '400px',
        });
      },
    },
  ];
};
