import React from 'react';
import { FormattedMessage } from 'react-intl';
import QRCode from 'qrcode';
import { M } from 'whaleex/components';
import {
  StyledWrap,
  Box,
  Item,
  LeftBox,
  RightBox,
  QrcodeBox,
  BkCover,
} from './style.js';
export class AppDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appDownloadUrl: _config.static_url + '/download',
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
  render() {
    const { qrcode, appDownloadUrl } = this.state;
    const width = window.screen.availWidth;
    if (width < 800) {
      self.location.href = appDownloadUrl;
      return <BkCover />;
    }
    return (
      <StyledWrap>
        <Box className="right">
          <RightBox>
            <div>
              <img
                width="490"
                src={
                  _config.cdn_url + '/web-static/imgs/appDownload/down_photo.png'
                }
              />
            </div>
          </RightBox>
        </Box>
        <Box className="left">
          <LeftBox>
            <div className="content">
              <Item>
                <div>
                  <img
                    src={
                      _config.cdn_url + '/web-static/imgs/appDownload/img1.png'
                    }
                  />
                </div>
                <div>
                  <p>
                    <M id="appDownload.title1" />
                  </p>
                  <p>
                    <M id="appDownload.intro1" />
                  </p>
                </div>
              </Item>
              <Item>
                <div>
                  <img
                    src={
                      _config.cdn_url + '/web-static/imgs/appDownload/img2.png'
                    }
                  />
                </div>
                <div>
                  <p>
                    <M id="appDownload.title2" />
                  </p>
                  <p>
                    <M id="appDownload.intro2" />
                  </p>
                </div>
              </Item>
              <Item>
                <div>
                  <img
                    src={
                      _config.cdn_url + '/web-static/imgs/appDownload/img3.png'
                    }
                  />
                </div>
                <div>
                  <p>
                    <M id="appDownload.title3" />
                  </p>
                  <p>
                    <M id="appDownload.intro3" />
                  </p>
                </div>
              </Item>
            </div>
            <div className="download">
              <div className="download-qrcode">
                <img src={qrcode} className="qrcode" />
              </div>
              <div className="download-btns">
                <a
                  href={
                    'itms-services://?action=download-manifest&url=' +
                    _config.ios_down_url
                  }
                >
                  <M id="appDownload.ios" />
                </a>
                <a href={_config.android_down_url}>
                  <M id="appDownload.and" />
                </a>
              </div>
            </div>
          </LeftBox>
        </Box>
      </StyledWrap>
    );
  }
}
export default AppDownload;
