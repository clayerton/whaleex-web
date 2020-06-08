import { M } from 'whaleex/components';
import { CodeModal } from 'whaleex/components';
import { Icon, notification, Modal } from 'antd';
const confirm = Modal.confirm;

export const confirmPhoneToggleFunc = (enable, props) => {
  const codeType = enable ? 'enablePhoneVerify' : 'disablePhoneVerify';
  const {
    userConfig,
    history,
    intl: { formatMessage },
  } = props;
  const confirmModal = confirm({
    content: (
      <CodeModal
        onCancel={() => {
          confirmModal.destroy();
        }}
        onSend={props.sendCode}
        onConfirm={(codes, callBack) => {
          props.confirmPhoneToggle(
            {
              ...codes,
              phone: userConfig.phone,
              enable,
              verifyType: codeType,
            },
            (status, msg) => {
              //本身为 action 回调
              // callBack 来自组件回调
              if (status) {
                confirmModal.destroy();
                notification.open({
                  message: <span>{formatMessage({ id: 'user.userset' })}</span>,
                  description: (
                    <span>
                      {(enable &&
                        formatMessage({ id: 'user.phoneCodeVerifyOn' })) ||
                        formatMessage({ id: 'user.phoneCodeVerifyOff' })}
                    </span>
                  ),
                  icon: (
                    <Icon
                      type="check-circle"
                      style={{ color: 'rgb(87, 212, 170)' }}
                    />
                  ),
                });
              } else {
                notification.open({
                  message: <span>{formatMessage({ id: 'user.userset' })}</span>,
                  description: (
                    <span>
                      {formatMessage({ id: 'user.testFail' })}
                      <br />
                      {msg}
                    </span>
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
          );
        }}
        types={{ phoneCode: codeType }}
        codeLayout={['phoneCode']}
        addressList={userConfig}
      />
    ),
    title: null,
    className: 'whaleex-confirm',
    iconType: true,
    okCancel: false,
    width: 450,
  });
};
export const confirmGoogleToggleFunc = (enable, props) => {
  const codeType = enable ? 'enableGoogoleVerify' : 'disableGoogleVerify';
  const {
    userConfig,
    history,
    intl: { formatMessage },
  } = props;
  const confirmModal = confirm({
    content: (
      <CodeModal
        onCancel={() => {
          confirmModal.destroy();
        }}
        onSend={props.sendCode}
        onConfirm={(codes, callBack) => {
          props.confirmGoogleToggle(
            {
              ...codes,
              verifyType: codeType,
            },
            enable,
            (status, msg) => {
              //本身为 action 回调
              // callBack 来自组件回调
              if (status) {
                confirmModal.destroy();
                notification.open({
                  message: <span>{formatMessage({ id: 'user.userset' })}</span>,
                  description: (
                    <span>
                      {(enable &&
                        formatMessage({ id: 'user.ggtestopenSuccess' })) ||
                        formatMessage({ id: 'user.ggtestopenFail' })}
                    </span>
                  ),
                  icon: (
                    <Icon
                      type="check-circle"
                      style={{ color: 'rgb(87, 212, 170)' }}
                    />
                  ),
                });
              } else {
                notification.open({
                  message: <span>{formatMessage({ id: 'user.userset' })}</span>,
                  description: (
                    <span>
                      {formatMessage({ id: 'user.ggfail' })}
                      <br />
                      {msg}
                    </span>
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
          );
        }}
        types={{ googleCode: codeType }} //由于谷歌验证并不发送验证码 所以此处type不必要
        codeLayout={[['googleCode', 'phoneCode']]}
        addressList={userConfig}
      />
    ),
    title: null,
    className: 'whaleex-confirm',
    iconType: true,
    okCancel: false,
    width: 450,
  });
};
