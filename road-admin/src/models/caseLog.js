import { getAllCaseLog, updateCaseLog, deleteCaseLog } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'caseLog',

  state: {
    list:[],
    edit: { count: 0 },
    del: { count: 0 }
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *caseLogList({ payload }, { call, put }) {
      const response = yield call(getAllCaseLog, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *updateCaseLog({ payload }, { call, put }) {
      const response = yield call(updateCaseLog, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'edit', ...response });
    },
    *deleteCaseLog({ payload }, { call, put }) {
      const response = yield call(deleteCaseLog, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success(response.message); }
      yield put({ type: 'del', ...response });
    },
    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear' });
    },
  },

  reducers: {
    list(state, action) {
      return { ...state, list: action };
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
      return { ...state, edit: { count: 0 }, del: { count: 0 }};
    },
  },
};