import { postReportList, createTag, updateTag, deleteReport } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'report',

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
    *getReportList({ payload }, { call, put }) {
      const response = yield call(postReportList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    // *tagAdd({ payload }, { call, put }) {
    //   const response = yield call(createTag, payload);
    //   if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
    //   if (response.status) { message.success("Tag Created!", 5); }
    //   yield put({ type: 'add', ...response });
    // },
    // *tagEdit({ payload }, { call, put }) {
    //   const response = yield call(updateTag, payload);
    //   if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
    //   if (response.status) { message.success("Tag Updated!", 5); }
    //   yield put({ type: 'edit', ...response });
    // },
    *reportDelete({ payload }, { call, put }) {
      const response = yield call(deleteReport, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Report Deleted!", 5); }
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