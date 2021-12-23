import { createSubCat, updateSubCat, getallsubcategries, getSubCatbyCategory, catSubDetail, deleteSubCat } from '../services/api'
import { message } from 'antd';
export default {
  namespace: 'subcategory',

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
    *subCategoryList({ payload }, { call, put }) {
      const response = yield call(getallsubcategries, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'save', ...response });
    },
    *subCategorybyCat({ payload }, { call, put }) {
      const response = yield call(getSubCatbyCategory, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'subsave', ...response });
    },
    *subCategoryAdd({ payload }, { call, put }) {
      const response = yield call(createSubCat, payload);

      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Sub Category Created!", 5); }
      yield put({ type: 'add', ...response });
    },
    *subCategoryDetail({ payload }, { call, put }) {
      const response = yield call(catSubDetail, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err || response, 5); }
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      yield put({ type: 'detail', ...response });
    },
    *subCategoryEdit({ payload }, { call, put }) {
      const response = yield call(updateSubCat, payload);
      console.log("Sub Category Edit", JSON.stringify(payload))
      console.log(response)
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success(response.msg || response.message || 'Sub Category Updated!', 5); }
      yield put({ type: 'edit', ...response });
    },
    *subCategoryDel({ payload }, { call, put }) {
      const response = yield call(deleteSubCat, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Sub Cetagory Deleted!", 5); }
      yield put({ type: 'del', ...response });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, list: action };
    },
    subsave(state, action) {
      return { ...state, sublist: action };
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