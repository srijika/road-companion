import {getShippingRates, getShippingRate  ,  createShippingRate , updateShippingRate , deleteShippingRate} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'shippingRate',

  state: {
      list:[],
      single:null,
      create:null,
      update:null,
      delete:null
	},

  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {
    *shippingRateList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getShippingRates);  
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *shippingRate({ payload }, { call, put }) {
        let response = {};
          response = yield call(getShippingRate,payload);  
          if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
          yield put({ type: 'single', data: response.data });
      },
    *createRate({ payload }, { call, put }) {
        let response = {};
          response = yield call(createShippingRate,payload);  
          if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
          yield put({ type: 'create', data: response.status });
    },
    *updateRate({ payload }, { call, put }) {
        let response = {};
          response = yield call(updateShippingRate,payload);  
          if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
          yield put({ type: 'update', data: response.status });
    },
    *deleteRate({ payload }, { call, put }) {
      let response = {};
        response = yield call(deleteShippingRate,payload);  
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        yield put({ type: 'delete', data: response.status });
  }
  },
  
  reducers: {
    list(state, action) {
      return { ...state, list:[...action.data] };
    },
    single(state, action) {
        return { ...state, single:{...action.data} };
    },
    create(state, action) {
        return { ...state, create:action.data };
    },
    update(state, action) {
        return { ...state, update:action.data };
    },
    update(state, action) {
      return { ...state, delete:action.data };
  }
  },
};