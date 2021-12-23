import {getOrders , getOrdersAdmin , orderDetails , cancelOrder, refundOrder} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'order',

  state: {
      list:[],
      cancel: {}
	},

  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {
    *orderList({ payload }, { call, put }) {
      let response = {};
      if(payload.role == "ADMIN") {
        response = yield call(getOrdersAdmin, payload);
      } else {
        response = yield call(getOrders, payload);
      }
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    
    *orderDetail({ payload }, { call, put }) {
      let response = {};
      response = yield call(orderDetails, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'detail', result:{...response.data} });
    },
    *cancelOrder({ payload }, { call, put }) {
      let response = {};
      response = yield call(cancelOrder, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'cancel', result:{...response.data} });
    },
    *refundOrder({ payload }, { call, put }) {
      let response = {};
      response = yield call(refundOrder, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      if(response.status) {message.success(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'refund', result:{...response.data} });
    }
  },
  
  reducers: {
    list(state, action) {
      return { ...state, list:[...action.data] };
    },
    detail(state, action) {
      console.log('action:',action);
      return { ...state, detail:{ ...action.result} };
    },
    cancel(state, action) {
      return { ...state, cancel:{ ...action} };
    },
    refund(state, action) {
      return { ...state, cancel:{ ...action} };
    }
  },
};