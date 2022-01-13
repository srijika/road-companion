import {getFrequentlyAskedQuestions, getFrequentlyAskedQuestionsByUserId, deleteFrequentlyAskedQuestion, createFrequentlyAskedQuestion,updateFrequentlyAskedQuestion } 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'FAQ',

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
    *listFAQ({ payload }, { call, put }) {
      let response = {};
      console.log("hi")
        response = yield call(getFrequentlyAskedQuestions);  
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.result] });
    },
    *listFAQBySeller({ payload }, { call, put }) {
      let response = {};
        response = yield call(getFrequentlyAskedQuestionsByUserId, payload);  
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.result] });
    },
    *createFAQ({ payload }, { call, put }) {
        let response = {};
          response = yield call(createFrequentlyAskedQuestion,payload);  
          if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
          yield put({ type: 'create', data: response.status });
      },
      *updateFAQ({ payload }, { call, put }) {
        let response = {};
          response = yield call(updateFrequentlyAskedQuestion,payload);  
          if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
          yield put({ type: 'create', data: response.status });
      },
      *deleteFAQ({ payload }, { call, put }) {
        let response = {};
          response = yield call(deleteFrequentlyAskedQuestion,payload);  
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