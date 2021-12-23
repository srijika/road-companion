import {getHomePageBanner,createHomePageBanner,deleteHomePageBanner,updateHomePageBanner} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'homepage',

  state: {
      list:[]
	},

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *list({ payload }, { call, put }) {
      let response = {};
        response = yield call(getHomePageBanner); 
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'list', data:[...response.data] });
    },
    *create({payload},{call,put}) {
      let response = {};
      response = yield call(createHomePageBanner,payload); 
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'created', data:response.status });
    
    },
    *delete({payload},{call,put}) {
      let response = {};
      response = yield call(deleteHomePageBanner,payload); 
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'deleted', data:response.status });    
    },
    *update({payload},{call,put}) {
      let response = {};
      response = yield call(updateHomePageBanner,payload); 
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'updated', data: response.status });
    }
  },
  
  reducers: {

    list(state, action) {
        console.log({action});
      return { ...state, list:[...action.data]};
    },
    created(state, action) {
      return { ...state, created:action.data };
    },
    deleted(state, action) {
      return { ...state, created:action.data };
    },
    updated(state, action) {
      return { ...state, updated:action.data };
    }
  }
};