import { M } from 'whaleex/components';
import { Tooltip } from 'antd';
export const htmlFooter = that => (
  <div className="footer">
    <div className="fix-box">
      <div className="bottom-logo">
        <div>
          <i
            className="iconfont icon-logo-white-traverse"
            style={{
              color: '#fff',
              fontSize: '55px',
            }}
          />
          <div className="title">
            <M id="homePage.jjEOS" />
          </div>
          <div className="sub-title">
            Copyright©whaleex.com All Rights Reserved
          </div>
        </div>
      </div>
      <div className="right-two">
        <div className="qus">
          <p>
            <span>
              <M id="homePage.services" />
            </span>
            <a
              target="_blank"
              onClick={() => {
                _czc.push(['_trackEvent', 'API接入', '点击']);
              }}
              id="currency_apply"
              href={'https://github.com/WhaleEx/API'}
            >
              <M id="homePage.apiPage" />
            </a>
            <a
              target="_blank"
              onClick={() => {
                _czc.push(['_trackEvent', '申请上币', '点击']);
              }}
              id="currency_apply"
              href={
                (U.getUserLan() === 'zh' &&
                  'http://research.whaleex.com.cn/s/R32Urm/') ||
                'http://research.whaleex.com.cn/s/rAZVbu9/'
              }
            >
              <M id="homePage.footer1" />
            </a>
          </p>
          <p>
            <span>
              <M id="homePage.support" />
            </span>
            <a
              target="_blank"
              onClick={() => {
                _czc.push(['_trackEvent', '费率说明', '点击']);
              }}
              id="fee_detail"
              href="https://support.whaleex.com/hc/zh-cn/articles/360015324891-%E4%BA%A4%E6%98%93%E6%89%8B%E7%BB%AD%E8%B4%B9"
            >
              <M id="homePage.footer2" />
            </a>
            <a
              target="_blank"
              onClick={() => {
                _czc.push(['_trackEvent', '资产安全', '点击']);
              }}
              id="user_safe"
              href="https://support.whaleex.com/hc/zh-cn/categories/360000898432-%E8%B5%84%E4%BA%A7%E5%AE%89%E5%85%A8"
            >
              <M id="homePage.assetSafe" />
            </a>
            <a
              target="_blank"
              onClick={() => {
                _czc.push(['_trackEvent', '用户协议', '点击']);
              }}
              id="user_protocol"
              href="https://support.whaleex.com/hc/zh-cn/articles/360015645451--%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE-"
            >
              <M id="homePage.footer3" />
            </a>
          </p>
          <p>
            <span>
              <M id="homePage.intro" />
            </span>
            <a
              target="_blank"
              onClick={() => {
                _czc.push(['_trackEvent', '常见问题', '点击']);
              }}
              id="FAQ"
              href="https://support.whaleex.com/hc/zh-cn/categories/360000917011-"
            >
              <M id="homePage.footer4" />
            </a>
            <a
              target="_blank"
              onClick={() => {
                _czc.push(['_trackEvent', '新手帮助', '点击']);
              }}
              id="newer"
              href={
                (U.getUserLan() === 'zh' &&
                  'https://support.whaleex.com/hc/zh-cn/categories/360000917091-%E6%96%B0%E6%89%8B%E5%B8%AE%E5%8A%A9') ||
                'https://support.whaleex.com/hc/zh-cn/categories/360000917091-%E6%96%B0%E6%89%8B%E5%B8%AE%E5%8A%A9'
              }
            >
              <M id="homePage.footerNewer" />
            </a>
            <a
              target="_blank"
              onClick={() => {
                _czc.push(['_trackEvent', '意见反馈', '点击']);
              }}
              id="bottom_advice"
              href="https://support.whaleex.com/hc/zh-cn/requests/new"
            >
              <M id="homePage.footer5" />
            </a>
          </p>
        </div>
      </div>
      <div className="contact">
        <div className="contact-us">
          <M id="homePage.contactUs" />
        </div>
        {/* <div className="item">
          <div className="logo">
            <img src={telePng} />
          </div>
          <a href="https://t.me/WhaleExGroup" target="_blank">
            <span>Telegram</span>
          </a>
        </div> */}
        <div className="item">
          <div className="logo">
            <a
              href="mailto:hi@whaleex.com"
              onClick={() => {
                _czc.push(['_trackEvent', '邮箱', '点击']);
              }}
              id="mail"
            >
              <img src={_config.cdn_url + '/web-static/imgs/web/youjian.png'} />
            </a>
          </div>
        </div>
        <div className="item">
          <div className="logo">
            <a
              href="https://twitter.com/WhaleExchange"
              onClick={() => {
                _czc.push(['_trackEvent', 'twitter', '点击']);
              }}
              target="_blank"
              id="twitter"
            >
              <img src={_config.cdn_url + '/web-static/imgs/web/tw.png'} />
            </a>
          </div>
        </div>
        <div className="item">
          <div className="logo">
            <Tooltip
              placement="top"
              overlayClassName="deposit-tooltip"
              visible={that.state.visible}
              onVisibleChange={that.tooltipVisible}
              title={
                <div>
                  <img
                    src={_config.cdn_url + '/web-static/imgs/footQrcode.png'}
                    width="100px"
                  />
                </div>
              }
            >
              <img
                src={_config.cdn_url + '/web-static/imgs/web/wechat.png'}
                id="wechat"
              />
            </Tooltip>
          </div>
        </div>
        <div className="item">
          <div className="logo">
            <a
              href="https://t.me/WhaleExGroup"
              onClick={() => {
                _czc.push(['_trackEvent', 'telegram', '点击']);
              }}
              target="_blank"
              id="telegram"
            >
              <img src={_config.cdn_url + '/web-static/imgs/web/tele.png'} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
// <div className="wal-intro">
//   <M id="homePage.walIntro" />
// </div>
