import * as T from './constants';
import context from 'whaleex/utils/service';
import { getQuery } from './typeOptions.js';
export const getDepowithList = ({
  typeSelect,
  currencySelect,
  current = 1,
  size = 15,
  currencyId,
  currency,
  currencyChange,
}) => {
  return async function(dispatch) {
    let dispatchData = {
      tableLoading: true,
    };
    if (currencyChange) {
      dispatchData = {
        depositData: [],
        tableLoading: true,
      };
    }
    dispatch({
      type: T.REFRESH_STATE,
      data: dispatchData,
    });
    // let api = `/BUSINESS/api/account/balance/history`;
    let api = `/BUSINESS/api/balanceLog`;
    let params = {
      // reasons: getQuery(currencySelect, typeSelect),
      // currencyId,
      currency,
      page: current - 1,
      reasons:
        (currency === 'WAL' &&
          'DEPOSIT,WITHDRAW,MINE,REBATE,INVITE,REGISTER,GROUP,RECEIVE,AIRDROP,ACTIVITY') ||
        'DEPOSIT,WITHDRAW,AIRDROP',
      size,
    };
    if (typeSelect === 'deposit') {
      api = `/BUSINESS/api/account/deposit/history`;
      params = {
        currencyId,
        page: current - 1,
        size,
      };
    } else if (typeSelect === 'withdraw') {
      api = `/BUSINESS/api/account/withdraw/history`;
      params = {
        currencyId,
        page: current - 1,
        size,
      };
    }
    try {
      const { data } = await context.http.get(api, params);
      let _data = {};
      if (typeSelect === 'deposit') {
        const { depositRecords = [], page, size, total } = data.result || {};
        _data = {
          dataList: depositRecords.map(i => {
            return Object.assign({}, i, { reason: 'DEPOSIT' });
          }),
          page,
          size,
          total,
        };
      } else if (typeSelect === 'withdraw') {
        const { withdrawRecords = [], page, size, total } = data.result || {};
        _data = {
          dataList: withdrawRecords.map(i => {
            return Object.assign({}, i, { reason: 'WITHDRAW' });
          }),
          page,
          size,
          total,
        };
      } else {
        const { content = [], number, size, totalElements } = data || {};
        // .map(i => {
        //   if (i.depositId) {
        //     return Object.assign({}, i, { reason: 'DEPOSIT' });
        //   } else {
        //     return Object.assign({}, i, { reason: 'WITHDRAW' });
        //   }
        // })
        _data = {
          dataList: content,
          page: number,
          size,
          total: totalElements,
        };
      }
      dispatch({
        type: T.REFRESH_STATE,
        data: {
          depositData: _data,
          tableLoading: false,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};
// export const getDepowithList = (
//   p1 = { page: 0, size: 20 },
//   p2 = { page: 0, size: 20 }
// ) => {
//   return async function(dispatch) {
//     try {
//       const [{ data: depositList }, { data: withdrawList }] = await Promise.all(
//         [
//           context.http.get(`/BUSINESS/api/account/deposit/history`, p1),
//           context.http.get(`/BUSINESS/api/account/withdraw/history`, p2),
//         ]
//       );
//       dispatch({
//         type: T.REFRESH_STATE,
//         data: {
//           depositList: depositList.result,
//           withdrawList: withdrawList.result,
//         },
//       });
//     } catch (e) {
//       return Promise.reject(e);
//     }
//   };
// };
