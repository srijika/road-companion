import {getQAnsByProductIds, deleteQAns, updateQAns } 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'QAns',

  state: {
      list:[],
      create:null,
      delete:null
	},

  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {
    *listQAns({ payload }, { call, put }) {
      let response = {};
        response = yield call(getQAnsByProductIds, payload);  
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        
	    yield put({ type: 'list', data:[...response.data.quesAns] });
    },
    *updateQAns({ payload }, { call, put }) {
      let response = {};
        response = yield call(updateQAns,payload);  
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        yield put({ type: 'create', data: response.status });
    },
    *deleteQAns({ payload }, { call, put }) {
      let response = {};
        response = yield call(deleteQAns,payload);  
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        yield put({ type: 'delete', data: response.status });
    }
  },
  
  reducers: {
    list(state, action) {
      return { ...state, list:[...action.data] };
    },
    create(state, action) {
        return { ...state, create:action.data, delete:null };
    },
    delete(state, action) {
      return { ...state, delete:action.data, create:null };
    },
    clear(state, action) {
      return { ...state, delete:null, create:null };
    }
  },
};