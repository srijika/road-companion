import {getColorList,createColor,editColor,deleteColor,getColorDetail} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'colors',

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
    *colorList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getColorList); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *deleteColor({ payload }, {call,put}) {
      let response = {};
      response = yield call(deleteColor,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'delete', message:response.status });
    },
    *AddColor({ payload }, {call,put}) {
      let response = {};
      response = yield call(createColor,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'add', message: response.status });
    },
    *EditColor({ payload }, {call,put}) {
      let response = {};
      response = yield call(editColor,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'edit', message: response.status });
    },
    *detailColor({ payload }, { call, put }) {

      const response = yield call(getColorDetail, payload);
      console.log(payload)
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
    detail(state, action) {
      return { ...state, detail: action };
    },

  },
};