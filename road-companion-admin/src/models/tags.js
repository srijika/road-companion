import { tagList, createTag, updateTag, deleteTag } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'tag',

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
    *tagList({ payload }, { call, put }) {
      const response = yield call(tagList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *tagAdd({ payload }, { call, put }) {
      const response = yield call(createTag, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Tag Created!", 5); }
      yield put({ type: 'add', ...response });
    },
    *tagEdit({ payload }, { call, put }) {
      const response = yield call(updateTag, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Tag Updated!", 5); }
      yield put({ type: 'edit', ...response });
    },
    *tagDelete({ payload }, { call, put }) {
      const response = yield call(deleteTag, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Tag Deleted!", 5); }
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