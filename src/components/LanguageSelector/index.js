import React from 'react';
import PropTypes from 'prop-types';
import { languages } from 'i18n.js';
import styled from 'styled-components';
import { Menu, Dropdown, Icon } from 'antd';
const zhimg = _config.cdn_url + '/web-static/imgs/country/zh.png';
const enimg = _config.cdn_url + '/web-static/imgs/country/en.png';
const koimg = _config.cdn_url + '/web-static/imgs/country/ko.png';
const jaimg = _config.cdn_url + '/web-static/imgs/country/ja.png';
const frimg = _config.cdn_url + '/web-static/imgs/country/fr.png';
const MenuItem = Menu.Item;
import './style.less';
const StyledMenuItem = styled(MenuItem)`
  .country-flag {
    display: inline-block;
    margin-right: 5px;
    img {
      width: 26px;
    }
  }
  .country-lan {
    display: inline-block;
    font-size: 14px;
    color: #658697;
  }
`;
const StyledWrap = styled.span`
  cursor: pointer;
  white-space: nowrap;
  .currentLan {
    display: inline-block;
  }
`;
const StyledIcon = styled(Icon)`
  font-size: 10px;
  position: relative;
  top: -2px;
  margin-left: 10px;
`;
const Lmap = {
  en: 'ENGLISH',
  zh: 'CHINESE',
  ko: 'KOREAN',
  ja: 'JAPANESE',
  fr: 'FRENCH',
};
const LmapR = {
  ENGLISH: 'en',
  CHINESE: 'zh',
  KOREAN: 'ko',
  JAPANESE: 'ja',
  FRENCH: 'fr',
};
export default class LanguageSelector extends React.Component {
  constructor(props) {
    super(props);
  }
  handleMenuClick = ({ key }) => {
    _czc.push(['_trackEvent', '国家语言', '选择语言', key]);
    const { updateUserConfig } = this.props;
    this.props.changeLocale(key);
    sessionStorage.getItem('userId') &&
      updateUserConfig &&
      updateUserConfig({ language: Lmap[key] }); // "CHINESE|ENGLISH"  //tmplz-1
  };
  onVisibleChange = visible => {
    if (visible) {
      _czc.push(['_trackEvent', '国家语言', 'hover']);
    }
  };
  render() {
    const { locale, changeLocale } = this.props;
    const menuItems = languages.map(({ key, label }) => {
      let img = zhimg;
      if (key == 'en') {
        img = enimg;
      }
      if (key == 'ko') {
        img = koimg;
      }
      if (key == 'ja') {
        img = jaimg;
      }
      if (key == 'fr') {
        img = frimg;
      }
      return (
        <StyledMenuItem key={key}>
          <div className="country-flag">
            <img src={img} />
          </div>
          <div className="country-lan">{label}</div>
        </StyledMenuItem>
      );
    });
    const menu = <Menu onClick={this.handleMenuClick}>{menuItems}</Menu>;
    return (
      <Dropdown overlay={menu} onVisibleChange={this.onVisibleChange}>
        <StyledWrap>
          {languages.filter(({ key }) => key === locale).map(({ key }, idx) => {
            let img = zhimg;
            if (key == 'en') {
              img = enimg;
            }
            if (key == 'ko') {
              img = koimg;
            }
            if (key == 'ja') {
              img = jaimg;
            }
            if (key == 'fr') {
              img = frimg;
            }
            return (
              <div
                style={{ display: 'inline-block' }}
                className="current-Lan"
                key={idx}>
                <img style={{ width: '26px' }} src={img} />
              </div>
            );
          })}
          <StyledIcon type="caret-down" />
        </StyledWrap>
      </Dropdown>
    );
  }
}

LanguageSelector.PropTypes = {
  handler: PropTypes.function,
};
