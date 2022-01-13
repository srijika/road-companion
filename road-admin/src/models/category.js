import { createCat, updateCat, getallcategries, catDetail, deletecat } from '../services/api'
import { message } from 'antd';
export default {
  namespace: 'category',

  state: {
    add: { count: 0 },
    edit: { count: 0 },
    del: { count: 0 },
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *categoryList({ payload }, { call, put }) {
      const response = yield call(getallcategries, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'save', ...response });
    },
    *categoryAdd({ payload }, { call, put }) {
      const response = yield call(createCat, payload);

      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Category Created!", 5); }
      yield put({ type: 'add', ...response });
    },
    *categoryDetail({ payload }, { call, put }) {
      const response = yield call(catDetail, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err || response, 5); }
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      yield put({ type: 'detail', ...response });
    },
    *categoryEdit({ payload }, { call, put }) {
      console.log('payload is');
      console.log(payload);
      const response = yield call(updateCat, payload);
      console.log("Category Edit", JSON.stringify(payload))
      console.log(response)
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success(response.msg || response.message || 'Category Updated!', 5); }
      yield put({ type: 'edit', ...response });
    },
    *categoryDel({ payload }, { call, put }) {
      const response = yield call(deletecat, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Cetagory deleted!", 5); }
      yield put({ type: 'del', ...response });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, list: action };
    },
    detail(state, action) {
      return { ...state, detail: action };
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
  },
};