import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { IntlProvider } from 'react-intl'; //step-1
import M from 'whaleex/components/FormattedMessage'; //step-2
import U from 'whaleex/utils/extends';
import { translationMessages } from 'i18n.js'; //step-3 引入国际化翻译文件
import { Icon } from 'antd';
import { StyledButton } from 'whaleex/pages/Dashboard/style.js';
import Styled from 'styled-components';
import { getTheme } from 'containers/LanguageProvider/actions.js';
const buttonBg =
  _config.cdn_url + '/web-static/imgs/web/invitePage/redPocket/button.png';
const logoTp =
  _config.cdn_url + '/web-static/imgs/web/invitePage/redPocket/tp.png';
const logoMeetone =
  _config.cdn_url + '/web-static/imgs/web/invitePage/redPocket/meetone.png';
const Wrap = Styled.div`
text-align: center;
height: 600px;
width: 500px;
position: relative;
margin: 0 auto;
    .list{
      position: absolute;
      top: 405px;
      width: 100%;
      height: 50px;
      z-index: 999;
      display: flex;
      justify-content: space-between;
      padding: 0 100px;
      a{
        position: relative;
        display: inline-block;
        z-index: 10000;
      }
      .signup-link-1,.signup-link-2{
        width: 140px;
        height: 50px;
        position: relative;
        img.button{
          width:100%;
        }
        img.logo{
          width: 77%;
          top: 30%;
          position: absolute;
          left: 50%;
          margin-left: -38%;
          &.logo-meetone{
            top: 17%;
            width: 60%;
            margin-left: -29%;
          }
        }
      }
    }
  .content {
    background-image: url(${props => {
      return props.imgLink;
    }});
    width:500px;
    height: 600px;
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;
    margin: 0 auto;
  }
  .whalex-logo{
    width: 130px;
    position: absolute;
    top: 110px;
    right: 180px;
  }
  .close-btn {
    width: 28px;
    cursor: pointer;
    position: absolute;
    top: 60px;
    right: 85px;
  }
  a.eos-jump-link{
    color: rgba(255, 255, 255, 0.65);
    font-size: 12px;
    margin: 0 auto;
    margin-top: 500px;
    display: inline-block;
    i{
      margin-left: 5px;
    }
  }
  a.signup-link{
    position: absolute;
    top: 405px;
    width: 155px;
    left: 230px;
    height: 50px;
    z-index: 999;
  }
`;
export default class GuideModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { onCancel, onOk, data } = this.props;
    const { userConfig, step } = data;
    console.log(userConfig);
    const lan = U.getUserLan(); //step-4 取当前语言

    // step-5 IntlProvider 包裹组件
    return (
      <IntlProvider locale={lan} messages={translationMessages[lan]}>
        <ThemeProvider
          theme={() => {
            return getTheme();
          }}
        >
          <Wrap
            className="GuideModal600"
            imgLink={`${
              _config.cdn_url
            }web-static/imgs/web/invitePage/redPocket/inviteB${
              U.getUserLan() === 'zh' ? '' : 'En'
            }.png`}
          >
            <div className="content">
              <a
                className="eos-jump-link"
                onClick={onOk.bind(
                  null,
                  '/usercenter/pkAddress/bind?force=true'
                )}
              >
                <M id="invite.haveEosAccount" />
                <Icon type="right" />
              </a>
            </div>
            <div className="list">
              <a href="https://dapp.ethte.com/invitecode/buy" target="_blank">
                <div className="signup-link-2">
                  <img src={buttonBg} className="button" />
                  <img src={logoMeetone} className="logo logo-meetone" />
                </div>
              </a>
              <a
                href="https://dapp.mytokenpocket.vip/alipay/index.html"
                target="_blank"
              >
                <div className="signup-link-1">
                  <img src={buttonBg} className="button" />
                  <img src={logoTp} className="logo" />
                </div>
              </a>
            </div>
            <img
              src={_config.cdn_url + '/web-static/imgs/walModal/close.png'}
              type="close"
              onClick={onCancel}
              className="close-btn"
            />
            <img
              src={
                _config.cdn_url +
                '/web-static/imgs/web/invitePage/redPocket/logo.png'
              }
              className="whalex-logo"
            />
          </Wrap>
        </ThemeProvider>
      </IntlProvider>
    );
  }
}
