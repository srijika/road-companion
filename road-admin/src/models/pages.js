import {getPagesList,pagesDetail, deletePages , createPages , editPages} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'pages',

  state: {
      list:[],
      detail:{},
      delete:false,
      add:false,
      edit:false
	},

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *pagesList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getPagesList); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *pagesDetail({ payload }, { call, put }) {
      const response = yield call(pagesDetail, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      //if(response.status) {message.success(response.msg, 5);} 
      yield put({ type: 'detail', ...response });
    },
    *deletePages({ payload }, {call,put}) {
      let response = {};
      response = yield call(deletePages,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'delete', message:response.status });
    },
    *AddPages({ payload }, {call,put}) {
      let response = {};
      response = yield call(createPages,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'add', message: response.status });
    },
    *EditPages({ payload }, {call,put}) {
      let response = {};
      response = yield call(editPages,payload); 
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
    }

  },
};