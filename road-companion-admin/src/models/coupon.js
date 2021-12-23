import {getCoupons, deleteCoupon , createCoupon , editCoupon} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'coupon',

  state: {
      list:[],
      deleted:false,
      created:false
	},

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *couponList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getCoupons); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *couponDelete({ payload }, {call,put}) {
      let response = {};
      response = yield call(deleteCoupon,payload); 
      console.log('del',response);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'deleted', message:response.message });
    },
    *couponCreate({ payload }, {call,put}) {
      let response = {};
      response = yield call(createCoupon,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'created', message: response.status });
    },
    *couponEdit({ payload }, {call,put}) {
      let response = {};
      response = yield call(editCoupon,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'edit', message: response.status });
    }
  },
  
  reducers: {

    list (state, action) {
      return { ...state, list:[...action.data], deleted:false };
    },

    deleted (state, action) {
      return { ...state, deleted:action.message?true:false };
    },

    created (state,action) {
      return { ...state, created: action.message };
    },

    edit (state,action) {
      return { ...state, created: action.message };
    }

  },
};