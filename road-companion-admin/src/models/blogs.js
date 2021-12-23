import {getBlogsList,blogsDetail, deleteBlogs , createBlogs , editBlogs} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'blogs',

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
    *blogsList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getBlogsList); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *blogsDetail({ payload }, { call, put }) {
      const response = yield call(blogsDetail, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      //if(response.status) {message.success(response.msg, 5);} 
      yield put({ type: 'detail', ...response });
    },
    *deleteBlogs({ payload }, {call,put}) {
      let response = {};
      response = yield call(deleteBlogs,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'delete', message:response.status });
    },
    *AddBlogs({ payload }, {call,put}) {
      let response = {};
      response = yield call(createBlogs,payload);

      console.log(response)
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}


	    yield put({ type: 'add', message: response.status });
    },
    *EditBlogs({ payload }, {call,put}) {
      let response = {}; 
      response = yield call(editBlogs,payload); 
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