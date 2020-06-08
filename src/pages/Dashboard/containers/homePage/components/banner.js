import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spin } from 'antd';
import { StyledCarousel, WalSlide, BannerText } from './style.js';
import { M } from 'whaleex/components';
import U from 'whaleex/utils/extends';
export default class Banner extends React.Component {
  shouldComponentUpdate(nextProps) {
    const isChanged = U.isObjDiff([nextProps, this.props], ['activityList']);
    if (isChanged) {
      return true;
    }
    return false;
  }
  render() {
    const { activityList } = this.props;
    if (activityList === undefined) {
      return (
        <Spin spinning size="large">
          <StyledCarousel vertical autoplay />
        </Spin>
      );
    }
    if (!_.isEmpty(activityList)) {
      const carousels = (
        <StyledCarousel vertical autoplay>
          {activityList.map((i, idx) => {
            const { imageUrl, smallImageUrl, title, content, url } = i;
            return (
              <WalSlide key={idx}>
                <a href={url} rel="nofollow" target="_blank">
                  <img src={imageUrl || smallImageUrl} />
                  <BannerText>
                    <div className="title">{title}</div>
                    <div className="title sub">{content}</div>
                  </BannerText>
                </a>
              </WalSlide>
            );
          })}
        </StyledCarousel>
      );
      return carousels;
    }
    return (
      <StyledCarousel vertical autoplay>
        <WalSlide>
          <img src={_config.cdn_url + '/web-static/imgs/extend/banner1.jpg'} />
          <BannerText>
            <div className="title">
              <M id="homePage.wxzy" />
            </div>
            <div className="title sub">
              <M id="homePage.jyzxh" />
            </div>
          </BannerText>
        </WalSlide>
        <WalSlide>
          <img src={_config.cdn_url + '/web-static/imgs/extend/banner2.jpg'} />
          <BannerText>
            <div className="title">
              <M id="homePage.xsdf" />
            </div>
            <div className="title sub">
              <M id="homePage.ldxgq" />
            </div>
          </BannerText>
        </WalSlide>
        <WalSlide>
          <img src={_config.cdn_url + '/web-static/imgs/extend/banner3.jpg'} />
          <BannerText>
            <div className="title">
              <M id="homePage.cjyh" />
            </div>
            <div className="title sub">
              <M id="homePage.ydsx" values={{ month: '9' }} />
            </div>
          </BannerText>
        </WalSlide>
      </StyledCarousel>
    );
  }
}

Banner.PropTypes = {
  handler: PropTypes.function,
};
