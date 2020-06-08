import * as T from './constants';
import context from 'whaleex/utils/service';
import U from 'whaleex/utils/extends';
import { message } from 'antd';
export const initHomePage = () => {
  return async function(dispatch) {
    try {
      const { data: activity } = await context.http.get(
        `/BUSINESS/api/publisher/public/activity`
      );
      const { data: notice } = await context.http.get(
        `/BUSINESS/api/publisher/public/announcement`
      );
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          activityList: activity.result || [],
          noticeList: notice.result || [],
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
export function getQuotable() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/public/currency/quotable`
      );
      dispatch({
        type: T.REFRESH_STATE,
        data: { publicQuotable: data.result },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
/*
获取当前币种分类
 */
export function getPartition() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/public/symbol/partition`
      );
      dispatch({
        type: T.REFRESH_STATE,
        data: { symbolPartition: data.result },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
window.getCurrentDataTimer = undefined;
export const getCurrentData = () => {
  clearTimeout(window.getCurrentDataTimer);
  return async function(dispatch) {
    try {
      const { data } = await context.http.get(`/BUSINESS/api/whale/user`);
      dispatch({
        type: T.REFRESH_STATE,
        data: { currData: data.result },
      });
      window.getCurrentDataTimer = setTimeout(() => {
        dispatch(getCurrentData());
      }, 5000);
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
window.getCurrentExChanggeTimer = undefined;
export const getCurrentExChangge = () => {
  clearTimeout(window.getCurrentExChanggeTimer);
  return async function(dispatch) {
    try {
      const { data } = await context.http.get(
        `/BUSINESS/api/whale/public/exchange`
      );
      dispatch({
        type: T.REFRESH_STATE,
        data: { exChange: data.result },
      });
      window.getCurrentExChanggeTimer = setTimeout(() => {
        dispatch(getCurrentExChangge());
      }, 5000);
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
window.getCurrentListTimer = undefined;
export function getCurrentList() {
  clearTimeout(window.getCurrentListTimer);

  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/public/symbol`);
      const publicSymbolObj = data.reduce((pre, cur, idx) => {
        const { id } = cur;
        pre[`${id}`] = cur;
        return pre;
      }, {});
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          publicSymbol: data,
          publicSymbolObj,
        },
      });
      window.getCurrentListTimer = setTimeout(() => {
        dispatch(getCurrentList());
      }, 2000);
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function getCoinList() {
  return new Promise(async reslove => {
    let { data } = await context.http.get(`/BUSINESS/api/public/currency`);
    let _data = data.filter(({ status }) => status === 'ON');
    reslove(_data);
  });
}
window.getWhaleexEosTimer = undefined;

export function getWhaleexEos() {
  clearTimeout(window.getWhaleexEosTimer);

  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/account/public/exchange`
      );
      if (data.returnCode !== '0') {
        message.warning(data.message);
      }
      //将时间戳变成HH:mm格式
      let t1 = _.get(data, 'result.mineConfig.feeResetCronTabInput');
      let t2 = _.get(data, 'result.mineConfig.mineCronTabInput');
      let t3 = _.get(data, 'result.mineConfig.releaseCronTabInput');
      _.set(data, 'result.mineConfig.feeResetCronTabInput', U.convert2Time(t1));
      _.set(data, 'result.mineConfig.mineCronTabInput', U.convert2Time(t2));
      _.set(data, 'result.mineConfig.releaseCronTabInput', U.convert2Time(t3));
      dispatch({
        type: T.REFRESH_STATE,
        data: { eosConfig: data },
      });
      window.getWhaleexEosTimer = setTimeout(() => {
        dispatch(getWhaleexEos());
      }, 5000);
    } catch (e) {
      dispatch({
        type: T.REFRESH_STATE,
        data: { eosConfig: { result: { mineConfig: {} } } },
      });
      return Promise.reject(e);
    }
  };
}
export function convertMap(legalTender) {
  //TODO 汇率轮询！
  return async function(dispatch) {
    try {
      const currencyList = await getCoinList();
      // for (let i = 0; i < coin.length; i++) {
      let [{ data }, { data: data2 }] = await Promise.all([
        context.http.get('/BUSINESS/api/public/global/price', {
          currency: currencyList.map(({ shortName }) => shortName).join(','),
          convert: 'EOS',
        }),
        context.http.get('/BUSINESS/api/public/global/price', {
          currency: 'EOS',
          convert: legalTender,
        }),
      ]);
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          convertMap: data2,
          convertMap_digital: data,
          currencyList,
          currencyListObj: currencyList.reduce((pre, cur) => {
            const { id, shortName } = cur;
            pre[id] = cur;
            pre[shortName.toUpperCase()] = cur;
            return pre;
          }, {}),
          legalTender,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
export const getBackMineDetailData = (params, callback) => {
  const { key, startTime, lastData = [], page = 0, size = 50 } = params;
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/public/whale/repo/trade`,
        {
          page,
          size,
          startTime,
        }
      );
      let tmpList = lastData.concat(_.get(data.result, `content`, []));
      tmpList = _.sortBy(tmpList, [
        function(o) {
          return -o.timestamp;
        },
      ]);
      let pageNumber = _.get(data.result, `pageable.pageNumber`, 0);
      tmpList = _.uniqBy(tmpList, 'execId');
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          [`mineBackData.${key}`]: { content: tmpList, pageNumber: pageNumber },
        },
      });
      callback && callback();
    } catch (e) {
      callback && callback();
      return Promise.reject(e);
    }
  };
};
window.getmineDataTimer = undefined;
export function getmineData(tabKey, pagination, convertMap_digital, noloading) {
  clearTimeout(window.getmineDataTimer);
  const { current, pageSize } = pagination;
  //insert into mineData
  /*
  tabkey :
  mineData 交易对挖矿数据
  mineHistoryData 历史挖矿数据
  mineBackData 平台回购报告
  mineUserData 个人挖矿数据
   */
  const tabData = {
    mineData: 'public/whale/mine/symbol',
    mineHistoryData: 'public/whale/mine/exchange',
    mineBackData: 'public/v2/whale/repo/exchange',
    mineUserData: 'whale/mine/user',
  };

  return async function(dispatch) {
    try {
      let { data } = await context.http.get(
        `/BUSINESS/api/${tabData[tabKey]}?page=${current - 1}&size=${pageSize}`
      );
      let { result } = data;
      result = result || {};
      if (!noloading) {
        dispatch({
          type: T.REFRESH_STATE,
          data: {
            loading: true,
          },
        });
      }
      // get data
      // _data=data.map(i=>{
      //   const {x,y}=i;
      //   return {
      //     xx:x,
      //     yy:y
      //   }
      // })
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          [`mineData.${tabKey}`]: {
            pagination: { ...pagination, total: result.totalElements },
            list: result.content.map(i => {
              const { feeDetails } = i;
              //当前折合
              if (!_.isEmpty(feeDetails)) {
                let sum = Object.keys(feeDetails).reduce((pre, cur) => {
                  const curency = cur;
                  const arr2 =
                    feeDetails[curency] * convertMap_digital[curency];
                  pre += arr2;
                  return pre;
                }, 0);
                return { ...i, sum };
              } else {
                return i;
              }
            }),
          },
          loading: false,
        },
      });
      window.getmineDataTimer = setTimeout(() => {
        dispatch(
          getmineData(tabKey, pagination, convertMap_digital, 'noloading')
        );
      }, 5000);
    } catch (e) {
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          loading: false,
        },
      });
      return Promise.reject(e);
    }
  };
}
