import React from 'react';
import { FormattedMessage } from 'react-intl';
import QRCode from 'qrcode';
import { BackTop } from 'antd';
import { M } from 'whaleex/components';
import { StyledWrap, Banner } from './style.js';
import {
  addScrollListener,
  deleteScrollListener,
} from '../homePage/addScrollListener.js';
import './style.less';
export class EosWorld extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text1: false,
      text2: false,
      text3: false,
      text4: false,
    };
  }
  componentDidMount() {
    addScrollListener();
  }
  componentWillUnmount() {
    deleteScrollListener();
  }
  toogleState = key => {
    const status = this.state[key];
    this.setState({ [key]: !status });
  };
  render() {
    const { text1, text2, text3, text4 } = this.state;
    return (
      <StyledWrap>
        <Banner className="banner">
          <div>
            <div className="title">
              <M id="eosWorld.title" />
            </div>
            <div className="eosworld">
              <M id="eosWorld.world" />
            </div>
            <div className="location">
              <M id="eosWorld.location" />
            </div>
          </div>
        </Banner>
        <BackTop>
          <div className="ant-back-top-inner">TOP</div>
        </BackTop>
        <div className="us">
          <div className="item">
            <div className="item-title">
              <M id="eosWorld.organisers" />
            </div>
            <img
              className="waleex-logo"
              src={_config.cdn_url + '/web-static/imgs/eosWorld/whaleex.png'}
            />
          </div>

          <div className="item">
            <div className="item-title">
              <M id="eosWorld.partner" />
            </div>
            <img
              src={_config.cdn_url + '/web-static/imgs/eosWorld/partner.png'}
            />
          </div>

          <div className="item">
            <div className="item-title">
              <M id="eosWorld.platform" />
            </div>
            <img
              className="bihu-logo"
              src={_config.cdn_url + '/web-static/imgs/eosWorld/bihu.png'}
            />
          </div>

          <div className="item">
            <div className="item-title">
              <M id="eosWorld.eosNode" />
            </div>
            <img
              src={_config.cdn_url + '/web-static/imgs/eosWorld/eosnode.png'}
            />
          </div>

          <div className="item">
            <div className="item-title">
              <M id="eosWorld.media" />
            </div>
            <img
              className="media-logo"
              src={_config.cdn_url + '/web-static/imgs/eosWorld/media.png'}
            />
          </div>
        </div>
        <div className="introduce">
          <p>
            <i className="iconfont icon-EOS_logo" />
          </p>
          <M id="eosWorld.introduce" richFormat />
        </div>
        <div className="world">
          <div className="item">
            <div className="big-text">2018.09.16</div>
            <div
              className="big-text"
              onClick={() => {
                this.toogleState('text1');
              }}
            >
              <M id="eosWorld.Seoul" />
              {(!text1 && <i className="iconfont icon-xiala" />) || (
                <i className="iconfont icon-xiangshang" />
              )}
            </div>
            {(text1 && (
              <div className="text">
                <M id="eosWorld.SeoulText" richFormat />
              </div>
            )) ||
              ''}
            <div className="cityImg">
              <div>
                <img
                  src={_config.cdn_url + '/web-static/imgs/eosWorld/city1.png'}
                />
              </div>
              <a
                href="https://v.qq.com/x/page/y0709g4ng8v.html"
                target="_blank"
              >
                <span className="cover" />
              </a>
            </div>
          </div>
          <div className="item">
            <div className="big-text">2018.09.29</div>
            <div
              className="big-text"
              onClick={() => {
                this.toogleState('text2');
              }}
            >
              <M id="eosWorld.Xiamen" />
              {(!text2 && <i className="iconfont icon-xiala" />) || (
                <i className="iconfont icon-xiangshang" />
              )}
            </div>
            {(text2 && (
              <div className="text">
                <M id="eosWorld.XiamenText" richFormat />
              </div>
            )) ||
              ''}
            <div className="cityImg">
              <div>
                <img
                  src={_config.cdn_url + '/web-static/imgs/eosWorld/city2.png'}
                />
              </div>
              <a
                href="https://v.qq.com/x/page/r07437z3pz8.html"
                target="_blank"
              >
                <span className="cover" />
              </a>
            </div>
          </div>
          <div className="item">
            <div className="big-text">2018.10.14</div>
            <div
              className="big-text"
              onClick={() => {
                this.toogleState('text3');
              }}
            >
              <M id="eosWorld.Hangzhou" />
              {(!text3 && <i className="iconfont icon-xiala" />) || (
                <i className="iconfont icon-xiangshang" />
              )}
            </div>
            {(text3 && (
              <div className="text">
                <M id="eosWorld.HangzhouText" richFormat />
              </div>
            )) ||
              ''}
            <div className="cityImg">
              <div>
                <img
                  src={_config.cdn_url + '/web-static/imgs/eosWorld/city3.png'}
                />
              </div>
              <a
                href="https://v.qq.com/x/page/m07494b5jrn.html"
                target="_blank"
              >
                <span className="cover" />
              </a>
            </div>
          </div>
          <div className="item">
            <div className="big-text">2018.10.21</div>
            <div
              className="big-text"
              onClick={() => {
                this.toogleState('text4');
              }}
            >
              <M id="eosWorld.Shanghai" />
              {(!text4 && <i className="iconfont icon-xiala" />) || (
                <i className="iconfont icon-xiangshang" />
              )}
            </div>
            {(text4 && (
              <div className="text">
                <M id="eosWorld.ShanghaiText" richFormat />
              </div>
            )) ||
              ''}
            <div className="cityImg">
              <div>
                <img
                  src={_config.cdn_url + '/web-static/imgs/eosWorld/city4.png'}
                />
              </div>
              <a
                href="https://v.qq.com/x/page/x0785j2pmom.html"
                target="_blank"
              >
                <span className="cover" />
              </a>
            </div>
          </div>
        </div>
      </StyledWrap>
    );
  }
}
export default EosWorld;
