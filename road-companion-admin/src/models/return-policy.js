import { getReturnPolicyList, createReturnPolicy, updateReturnPolicy, deleteReturnPolicy } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'returnPolicy',

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
    *returnPolicyList({ payload }, { call, put }) {
      const response = yield call(getReturnPolicyList, payload);
      console.log("response blogs", response)
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *returnPolicyAdd({ payload }, { call, put }) {
      const response = yield call(createReturnPolicy, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success(response.message, 5); }
      yield put({ type: 'add', ...response });
    },
    *returnPolicyEdit({ payload }, { call, put }) {
      const response = yield call(updateReturnPolicy, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success(response.message, 5); }
      yield put({ type: 'edit', ...response });
    },
    *deleteReturnPolicy({ payload }, { call, put }) {
      const response = yield call(deleteReturnPolicy, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success(response.message, 5); }
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