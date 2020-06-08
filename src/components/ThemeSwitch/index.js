import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import Cookies from 'js-cookie';
import { themeDay } from './theme/themeDay.js';
import { themeNight } from './theme/themeNight.js';
export default class ThemeSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  changeTheme = check => {
    let theme;
    if (!check) {
      theme = 'themeNight';
    } else {
      theme = 'themeDay';
    }
    if (this.props.changeTheme) {
      this.props.changeTheme(theme);
    } else {
      console.error('changeTheme func is undefined');
    }
  };
  render() {
    const curTheme = Cookies.get('wal-theme');
    if (!_config.theme_switch) {
      return null;
    }
    return (
      <Switch
        checked={curTheme === 'themeDay'}
        checkedChildren="日"
        unCheckedChildren="夜"
        defaultChecked
        onChange={this.changeTheme}
      />
    );
  }
}
