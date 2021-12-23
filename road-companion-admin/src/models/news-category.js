import { getNewsCategoryList, createNewsCategoryList, updateNewsCategory, deleteNewsCategory } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'newsCategory',

  state: {
    add: { count: 0 },
    edit: { count: 0 },
    fileUp: { count: 0 },
    del: { count: 0 }
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *newsCategoryList({ payload }, { call, put }) {
      const response = yield call(getNewsCategoryList, payload);
      console.log("response news", response)
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *newsCategoryAdd({ payload }, { call, put }) {
      const response = yield call(createNewsCategoryList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("News Category Created!", 5); }
      yield put({ type: 'add', ...response });
    },
    *newsCategoryEdit({ payload }, { call, put }) {
      const response = yield call(updateNewsCategory, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("News Category Updated!", 5); }
      yield put({ type: 'edit', ...response });
    },
    *deleteNewsCategory({ payload }, { call, put }) {
      const response = yield call(deleteNewsCategory, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("News Category Deleted!", 5); }
      yield put({ type: 'del', ...response });
    },
    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear'});
    },
  
  },

  reducers: {
    list(state, action) {
      return { ...state, list: action };
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
      return { ...state, edit:{count:0}, del:{count:0}};
      },
  },
};