/** Copyright © 2013-2017 DataYes, All Rights Reserved. */

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import 'moment/locale/zh-cn';
import { getConfig } from 'dyc/utils/config';
import DashboardContainer from 'whaleex/pages/Dashboard';
import Login from 'whaleex/common/Login';
import Register from 'whaleex/common/Register';
import ForgetPwd from 'whaleex/common/ForgetPwd';
moment.locale('zh-cn');

const BASE_ROUTE = _config.base;
const prefix = _config.app_name;

const url_matcher = {
  '/whaleex/dash/homePage': DashboardContainer,
  '/whaleex/dash/download': DashboardContainer,
  '/whaleex/dash/eosworld': DashboardContainer,
  '/whaleex/dash/minePage': DashboardContainer,
  '/whaleex/dash/market': DashboardContainer,
  '/whaleex/dash/stakeFor': DashboardContainer,
  '/whaleex/dash/trade': DashboardContainer,
  '/whaleex/dash/user': DashboardContainer,
  '/whaleex/dash/tradeDetailAction': DashboardContainer,
  '/whaleex/dash/usercenter': DashboardContainer,
  '/whaleex/dash/assetAction': DashboardContainer,
  '/whaleex/dash/assetDepoWith': DashboardContainer,
  '/whaleex/dash/stepPage': DashboardContainer,
  '/whaleex/login': Login,
  '/whaleex/register': Register,
  '/whaleex/forgetPwd': ForgetPwd,
  '/homePage': DashboardContainer,
  '/download': DashboardContainer,
  '/eosworld': DashboardContainer,
  '/minePage': DashboardContainer,
  '/market': DashboardContainer,
  '/stakeFor': DashboardContainer,
  '/trade': DashboardContainer,
  '/user': DashboardContainer,
  '/tradeDetailAction': DashboardContainer,
  '/usercenter': DashboardContainer,
  '/assetAction': DashboardContainer,
  '/assetDepoWith': DashboardContainer,
  '/stepPage': DashboardContainer,
  '/login': Login,
  '/register': Register,
  '/forgetPwd': ForgetPwd,
};
const top_url_matcher = {
  '/notFound': DashboardContainer,
  '/download-web': DashboardContainer,
  '/maintenance': DashboardContainer,
  '/': DashboardContainer,
};
export default (
  <Switch>
    {Object.keys(url_matcher).map((path, i) => {
      const Comp = url_matcher[path];
      return (
        <Route
          key={i}
          path={[BASE_ROUTE, prefix, path].join('')}
          render={props => {
            return <Comp {...props} baseRoute={BASE_ROUTE} prefix={prefix} />;
          }}
        />
      );
    })}
    {Object.keys(top_url_matcher).map((path, i) => {
      const CompTop = top_url_matcher[path];
      return (
        <Route
          key={'top_' + i}
          exact
          path={[path].join('')}
          render={props => {
            return (
              <CompTop {...props} baseRoute={BASE_ROUTE} prefix={prefix} />
            );
          }}
        />
      );
    })}
    <Redirect to={['/'].join('')} />
  </Switch>
);
