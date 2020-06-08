import context from 'whaleex/utils/service';
import { RESET_STATE, REFRESH_STATE } from './constants';
export const resetState = () => {
  return {
    type: RESET_STATE,
  };
};
export const getUserMessage = e => {
  return async function(dispatch) {
    try {
      let { data } = await context.http.get(`/BUSINESS/api/user/invite`);
      dispatch({
        type: REFRESH_STATE,
        data: { inviteCode: data },
      });
    } catch (e) {
      dispatch({
        type: REFRESH_STATE,
        data: {},
      });
      return Promise.reject(e);
    }
  };
};
// function flat(arrobj) {
//   return arrobj.reduce((r, cur) => {
//     r = r.concat({ ...cur, level: 1 });
//     const { lv2Invite } = cur;
//     if (lv2Invite && lv2Invite.length) {
//       r = r.concat(lv2Invite.map(i => ({ ...i, level: 2 })));
//     }
//     return r;
//   }, []);
// }
export const getInviteList = pagination => {
  return async function(dispatch) {
    const { current, pageSize } = pagination;
    try {
      dispatch({
        type: REFRESH_STATE,
        data: {
          loading: true,
        },
      });
      let { data } = await context.http.get(
        `/BUSINESS/api/user/invite/list?page=${current - 1}&size=${pageSize}`
      );
      const inviteObj = data.result;
      //必须先平铺
      let _inviteUsers = inviteObj.inviteUsers.map(i => {
        const { eosBind, kyc, inviteReward } = i;
        if (!eosBind || !kyc) {
          return { ...i, inviteReward: 0 };
        }
        return { ...i, inviteReward: +inviteReward };
      });
      let _inviteObj = Object.assign({}, inviteObj, {
        inviteUsers: _inviteUsers,
      });
      dispatch({
        type: REFRESH_STATE,
        data: {
          inviteObj: _inviteObj,
          pagination: { ...pagination, total: _inviteObj.total },
          loading: false,
        },
      });
    } catch (e) {
      dispatch({
        type: REFRESH_STATE,
        data: { loading: false },
      });
      return Promise.reject(e);
    }
  };
};
