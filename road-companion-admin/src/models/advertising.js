import { getAdvPlanList,getActiveAdvPlanList, bookPlanSeller, deleteBookPlan } 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'advertising',

  state: {
      list:[],
      
	},

  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {
    *advPlanList({ payload }, { call, put }) {
      let response = {};
      if(payload.role == "ADMIN") {
        response = yield call(getActiveAdvPlanList, payload);
        yield put({ type: 'list', data:[...response.result]});
      }else{
        response = yield call(getAdvPlanList, payload);
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        let result = [];
        if(response.result.bookedPlan){
          result = response.result.advplan.map((item)=>{
              if(item._id == response.result.bookedPlan.advplan_id){
                item.activated = true;
              }
              return item;
          })
        }else{
          response.result.advplan[0].activated = true;
          result = response.result.advplan;
        }
        yield put({ type: 'list', data:[...result]});
      }
	    
    }, 
    *bookPlanSeller({ payload }, { call, put }) {
      let response = {};
      response = yield call(bookPlanSeller, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'book', result:{...response.result} });
    },
    *deleteBookPlan({ payload }, { call, put }) {
      let response = {};
      response = yield call(deleteBookPlan, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'delete', result:{...response.result} });
    }
  },

  reducers: {
    list(state, action) {
      return { ...state, list:[...action.data] };
    },
    book(state, action) {
      return { ...state, cancel:{ ...action} };
    },
    delete(state, action) {
      return { ...state, cancel:{ ...action} };
    },
  },
};