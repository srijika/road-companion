import {getWithdrawlist,getWithdrawDetails} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'withdrawrequests',

  state: {
      list:[],
      detail:{},
      
	},

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    
    *withdrawList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getWithdrawlist); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *withdrawDetail({ payload }, { call, put }) {
      
      const response = yield call(getWithdrawDetails, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'detail', ...response});
    },
    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear' });
    },
  },
  
  reducers: {

    list (state, action) {
      return { ...state, list:[...action.data] };
    },
    detail(state, action) {
      return { ...state, detail: action };
    },
    delete (state, action) {
      return { ...state, delete:action };
    },
    add (state,action) {
      return { ...state, add: action };
    },
    edit (state,action) {
      return { ...state, edit: action };
    },
    clear (state,action) {
      return { ...state,  detail:{}, delete:false, add:false, edit:false };
    },
    

  },
};