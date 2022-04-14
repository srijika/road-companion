import {getReviewList,editReview,deleteReview,reviewDetail} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'reviews',

  state: {
      list:[],
      detail:{},
      delete:false,
      edit:false
	},

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {

    *reviewList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getReviewList,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *deleteReview({ payload }, {call,put}) {
      let response = {};
      response = yield call(deleteReview,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'delete', message:response.status });
    },

    *reviewDetail({ payload }, { call, put }) {
      const response = yield call(reviewDetail, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'detail', ...response});
    },
    
    *editReview({ payload }, {call,put}) {
      let response = {};
      response = yield call(editReview,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'edit', message: response.status });
    },
    
    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear' });
    },
  },
  
  reducers: {

    list (state, action) {
      return { ...state, list:[...action.data] };
    },
    delete (state, action) {
      return { ...state, delete:action };
    },
    edit (state,action) {
      return { ...state, edit: action };
    },
    clear (state,action) {
      return { ...state,  detail:{}, delete:false, add:false, edit:false };
    },
    detail(state, action) {
      return { ...state, detail: action };
    },

  
  },
};