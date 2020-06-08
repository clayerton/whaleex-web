import context from 'whaleex/utils/service';
import * as types from './constants';
import Cookies from 'js-cookie';
/*
获取用户关注列表
 */
export function getSubscription() {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/user/subscription`);
      if (data.returnCode === '401') {
        let subscriptionList = Cookies.get('SUBSCRIPTION') || '[]';
        subscriptionList = JSON.parse(subscriptionList);
        dispatch({
          type: types.GET_SUBSCRIPTION,
          props: { subscription: subscriptionList },
        });
      } else {
        dispatch({
          type: types.GET_SUBSCRIPTION,
          props: {
            subscription: _.sortBy(data, [
              function(o) {
                return -new Date(...o.updatedTime);
              },
            ]).map(({ symbolId }) => `${symbolId}`),
          },
        });
      }
    } catch (e) {}
  };
}
/*
添加关注
 */
export function addSubscription(symbol) {
  return async function(dispatch) {
    try {
      let { data } = await context.http.post(
        `/BUSINESS/api/user/subscription`,
        { symbolId: symbol.symbolId }
      );
      if (data.returnCode === '401') {
        let subscriptionList = Cookies.get('SUBSCRIPTION') || '[]';
        subscriptionList = JSON.parse(subscriptionList);
        Cookies.set('SUBSCRIPTION', [
          `${symbol.symbolId}`,
          ...subscriptionList,
        ]);
      }
      dispatch({
        type: types.POST_SUBSCRIPTION,
      });
      dispatch(getSubscription());
    } catch (e) {
      // return Promise.reject(e);
    }
  };
}
/*
删除关注
 */
export function delSubscription(symbol) {
  return async function(dispatch) {
    try {
      let { data } = await context.http.delete(
        `/BUSINESS/api/subscription/${symbol.symbolId}`
      );
      if (data.returnCode === '401') {
        let subscriptionList = Cookies.get('SUBSCRIPTION') || '[]';
        subscriptionList = JSON.parse(subscriptionList);
        subscriptionList = subscriptionList.filter(i => {
          return `${i}` !== `${symbol.symbolId}`;
        });
        Cookies.set('SUBSCRIPTION', subscriptionList);
      }
      dispatch({
        type: types.DEL_SUBSCRIPTION,
      });
      dispatch(getSubscription());
    } catch (e) {
      // return Promise.reject(e);
    }
  };
}
