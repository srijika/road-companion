import { getBlogsCategoryList, createBlogsCategoryList, updateBlogsCategory, deleteBlogsCategory } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'blogsCategory',

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
    *blogsCategoryList({ payload }, { call, put }) {
      const response = yield call(getBlogsCategoryList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *blogsCategoryAdd({ payload }, { call, put }) {
      const response = yield call(createBlogsCategoryList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("blogs Category Created!", 5); }
      yield put({ type: 'add', ...response });
    },
    *blogsCategoryEdit({ payload }, { call, put }) {
      const response = yield call(updateBlogsCategory, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("blogs Category Updated!", 5); }
      yield put({ type: 'edit', ...response });
    },
    *deleteblogsCategory({ payload }, { call, put }) {
      const response = yield call(deleteBlogsCategory, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("blogs Category Deleted!", 5); }
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