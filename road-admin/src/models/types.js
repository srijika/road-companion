import {getCarsTypeList,createCarType,editCarType,deleteCarType} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'types',

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
    *carTypeList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getCarsTypeList); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *deleteCarType({ payload }, {call,put}) {
      let response = {};
      response = yield call(deleteCarType,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'delete', message:response.status });
    },
    *AddCarType({ payload }, {call,put}) {
      let response = {};
      response = yield call(createCarType,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'add', message: response.status });
    },
    *EditCarType({ payload }, {call,put}) {
      let response = {};
      response = yield call(editCarType,payload); 
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