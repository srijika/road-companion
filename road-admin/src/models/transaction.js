import {updateCommunication,createBankTrn, getSellerBusinessDataList, getSellerTranDataList } from '../services/api'
import {message} from 'antd'; 
export default {
  namespace: 'transaction',

  state: {
      list:null,
      buss:null,
      add:false,
      update:false
	},
  
  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {
    *getDataList({ payload }, { call, put }) {
      let response = {};
      response = yield call(getSellerTranDataList, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data: response.data });
    },
    *getBussinessData({ payload }, { call, put }) {
      let response = {};
      response = yield call(getSellerBusinessDataList, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'buss', data: response.data });
    },
    *createBankTrn({ payload }, { call, put }) {
      let response = {};
      response = yield call(createBankTrn, payload);
      if(!response.status) { message.error(response.msg || response.message || response.err, 5); }
	    yield put({ type: 'add', data:response.status });
    },
    *updateComm({ payload }, { call, put }) {
      let response = {};
      response = yield call(updateCommunication, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'update', data:response.status });
    }
  },

  reducers: {
    list(state, action) {
      return { ...state, list:action.data, add:false };
    },
    buss(state, action) {
      return { ...state, buss:action.data, add:false };
    },
    add(state, action) {
      return { ...state, add:action.data };
    },
    update(state, action) {
      return { ...state, update:action.data };
    },
    clear(state, action) {
      return { ...state, buss:false, add:false, update:false };
    }
  },
};