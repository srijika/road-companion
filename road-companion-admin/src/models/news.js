import { getAdvPlanList, getNewsList, createNews, updateNews, deleteNews } 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'news',

  state: {
      list:[],
      add: { count: 0 },
    edit: { count: 0 },
    del: { count: 0 }
	},
    subscriptions: {
        setup({ dispatch, history }) { 
    },
  },

  effects: {
    // *advPlanList({ payload }, { call, put }) {
    //   let response = {};
    //   if(payload.role == "ADMIN") {
    //     // response = yield call(getActiveAdvPlanList, payload);
    //     // yield put({ type: 'list', data:[...response.result]});
    //   }else{
    //     response = yield call(getAdvPlanList, payload);
    //   }
    //   if(!response.status) {message.error(response.msg, 5);}
    //   yield put({ type: 'list', data:[...response.result]});
    // },
    *newsList({ payload }, { call, put }) {
        let response = {};
        response = yield call(getNewsList, payload);
        // if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        yield put({ type: 'list', data:[...response.result]});
      },
      *addNewsList({ payload }, { call, put }) {
        let response = {};
          response = yield call(createNews, payload);
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        if (response.status) { message.success("News Created!", 5); }
        yield put({ type: 'add', data:response});
      },
      *editNewsList({ payload }, { call, put }) {
        let response = {};
          response = yield call(updateNews, payload);
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        yield put({ type: 'edit', data:[...response.result]});
      },
      *deleteNewsList({ payload }, { call, put }) {
        let response = {};
          response = yield call(deleteNews, payload);
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        if (response.status) { message.success("News Deleted!", 5); }
        yield put({ type: 'del', data:response});
      },
      *clearAction({ payload }, { call, put }) {
        yield put({ type: 'clear'});
      },
  },

  reducers: {
    list(state, action) {
      return { ...state, list:[...action.data] };
    },
    add(state, action) {
      action.count = state.add.count + 1;
      return { ...state, add: action };
    },
    edit(state, action) {
      action.count = state.edit.count + 1;
      return { ...state, edit: action };
    },
    del(state, action) {
      action.count = state.del.count + 1;
      return { ...state, del: action };
    },
    clear(state, action) {
      return { ...state, add:{count:0}, edit:{count:0}, del:{count:0}};
    },
  },
};