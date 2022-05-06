import { getAllWithdrawRequests, sendDriverRequestPayment } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'withdrawRequest',

  state: {
    list: [],
  },

  subscriptions: {
    setup({ dispatch, history }) { },
  },

  effects: {
    *dataList({ payload }, { call, put }) {
      
      let response = {};
      response = yield call(getAllWithdrawRequests);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }

      yield put({ type: 'list', data: response.data });
    },

    *sendDriverRequestPayment({ payload }, { call, put }) {
      
      let response = {};
      response = yield call(sendDriverRequestPayment, payload);
     
      if (response.message) { message.error(response.msg || response.message || response.err, 5); }
      
      // yield put({ type: 'list', data: response.data });
    },


    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear' });
    },
  },

  reducers: {

    list(state, action) {
      return { ...state, list: [...action.data] };
    },

  },
};