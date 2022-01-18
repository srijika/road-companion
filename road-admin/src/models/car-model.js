import {getCarsModels,createCarModel,editCarModel,deleteCarModel,getCarModelDetail} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'carModels',
  
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
    *carModelList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getCarsModels); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *deleteCarModel({ payload }, {call,put}) {
     
      const response = yield call(deleteCarModel,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'delete', message:response.status });
    },
    *AddCarModel({ payload }, {call,put}) {
      let response = {};
      response = yield call(createCarModel,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'add', message: response.status });
    },
    *EditCarModel({ payload }, {call,put}) {
      let response = {};
      response = yield call(editCarModel,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'edit', message: response.status });
    },

    *detailCarModel({ payload }, { call, put }) {

      const response = yield call(getCarModelDetail, payload);

      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      console.log("payload" , response)

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
    detail(state, action) {
      return { ...state, detail: action };
    },
    clear (state,action) {
      return { ...state,  detail:{}, delete:false, add:false, edit:false };
    }

  
  },
};