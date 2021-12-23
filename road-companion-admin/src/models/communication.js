import {createCommunication, updateCommunication, getSellerCommDataList } from '../services/api'
import {message} from 'antd'; 
export default {
  namespace: 'communication',

  state: {
      list:null,
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
      response = yield call(getSellerCommDataList, payload);
      //if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data: response.result });
    },
    *createComm({ payload }, { call, put }) {
      let response = {};
      response = yield call(createCommunication, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
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
    add(state, action) {
      return { ...state, add:action.data };
    },
    update(state, action) {
      return { ...state, update:action.data };
    },
    clear(state, action) {
      return { ...state, add:false, update:false };
    }
  },
};