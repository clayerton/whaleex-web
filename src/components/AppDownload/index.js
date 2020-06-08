import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Menu, Dropdown, Icon } from 'antd';
const MenuItem = Menu.Item;
const MenuDivider = Menu.Divider;
import QRCode from 'qrcode';
import M from 'whaleex/components/FormattedMessage';
const StyledMenuItem = styled(MenuItem)`
  .appDownload {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 113px;
      height: 113px;
      margin: 6px 0;
    }
    .downloadleft {
      text-align: center;
      width: 120px;
      font-size: 14px;
      color: #658697;
      a,
      span.aLink {
        width: 100%;
        display: block;
        letter-spacing: 0.3px;
        color: #658697;
        font-size: 12px;
        margin-bottom: 4px;
      }
    }
    .downloadright {
      text-align: center;
      .title {
        margin-bottom: 15px;
        color: #658697;
        font-size: 12px;
      }
      .clickDownload {
        a {
          width: 100%;
          display: block;
          letter-spacing: 0.3px;
          color: #658697;
          font-size: 12px;
          margin-bottom: 4px;
          img {
            margin-right: 5px;
            width: 23px;
            height: 23px;
          }
        }
      }
    }
  }
`;
const StyledWrap = styled.span`
  cursor: pointer;
  white-space: nowrap;
`;
const StyledIcon = styled(Icon)`
  font-size: 10px;
  position: relative;
  top: -2px;
  margin-left: 10px;
`;
export default class AppDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appDownloadUrl: _config.static_url + '/download', //点击下载的链接
      downloadPageUrl: '/download-web', //下载介绍
      visible: false,
    };
  }
  componentDidMount() {
    const { appDownloadUrl } = this.state;
    QRCode.toDataURL([appDownloadUrl].join(''), {
      width: 250,
    }).then(r => {
      this.setState({ qrcode: r });
    });
  }
  handleVisibleChange = flag => {
    flag && _czc.push(['_trackEvent', 'app下载', '二维码显示']);
    this.setState({ visible: flag });
  };
  handleMenuClick = ({ key }) => {
    this.setState({ visible: true });
  };
  goDownload = () => {
    _czc.push(['_trackEvent', 'app下载', '点击']);
    const { urlJump } = this.props;
    const { downloadPageUrl } = this.state;
    urlJump(downloadPageUrl, true)();
  };
  render() {
    const { appDownloadUrl, visible, qrcode } = this.state;
    let menuItems = (
      <StyledMenuItem>
        <div className="appDownload">
          <div className="downloadleft">
            <div>
              <M id="components.codeDownload" />
            </div>
            <img src={qrcode} onClick={this.goDownload} />
            <div>
              <span className="aLink" onClick={this.goDownload}>
                <M id="components.download" />
              </span>
              {/* <a href={appDownloadUrl} target="_blank">
                <M id="components.download" />
              </a> */}
            </div>
          </div>
          {/* <div className="downloadright">
            <div className="title">
              <M id="components.download" />
            </div>
            <div className="clickDownload">
              <a href="https://whaleex.com/download" target="_blank">
                <img src={androidimg} />
                <M id="components.AndroidDownload" />
              </a>
              <a href="https://whaleex.com/download" target="_blank">
                <img src={iosimg} />
                <M id="components.iosDownload" />
              </a>
            </div>
          </div> */}
        </div>
      </StyledMenuItem>
    );
    const menu = <Menu onClick={this.handleMenuClick}>{menuItems}</Menu>;
    return (
      <Dropdown
        overlay={menu}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}>
        <StyledWrap onClick={this.goDownload}>
          <M id="components.appDownload" />
          {/* {menuMap
            .filter(({ key }) => key === curSelect)
            .map(({ key, label, url }, idx) => {
              return (
                <div style={{ display: 'inline-block' }} key={idx}>
                  {label}
                </div>
              );
            })} */}
          <StyledIcon type="caret-down" />
        </StyledWrap>
      </Dropdown>
    );
  }
}

AppDownload.PropTypes = {
  handler: PropTypes.function,
};
