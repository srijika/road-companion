import { getAllProduct, getProduct, updateProducts, createProduct, deleteProducts, uploadExcel, getSellerProducts,updateQuntityStock } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'product',

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
    *productList({ payload }, { call, put }) {
      const response = yield call(getAllProduct, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *sellerProductList({ payload }, { call, put }) {
      const response = yield call(getSellerProducts, payload);
      if (!response.status) {  message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *productAdd({ payload }, { call, put }) {
      const response = yield call(createProduct, payload);
      if (!response.status) { console.log('dfgfdg'); message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Product Created!", 5); }
      yield put({ type: 'add', ...response });
    },
    *productDetail({ payload }, { call, put }) {
      const response = yield call(getProduct, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      //if(response.status) {message.success(response.msg, 5);} 
      yield put({ type: 'detail', ...response });
    },
    *productEdit({ payload }, { call, put }) {
      const response = yield call(updateProducts, payload);
      console.log(payload)
      if (!response.status) {  message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Product Updated!", 5); }
      yield put({ type: 'edit', ...response });
    },
    *updateStock({ payload }, { call, put }) {
      const response = yield call(updateQuntityStock, payload);
     
      if (!response.status) {  message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Quantity Updated!", 5); }
      yield put({ type: 'edit', ...response });
    },

    *productDelete({ payload }, { call, put }) {
      const response = yield call(deleteProducts, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Product Deleted!", 5); }
      yield put({ type: 'del', ...response });
    },
    *uploadExcelFile({ payload }, { call, put }) {
      let formData = new FormData();
      formData.append('f', payload)
      const response = yield call(uploadExcel, formData);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Product Excel File Uploaded Sucessfully!", 5); }
      yield put({ type: 'fileUp', ...response });
    },
    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear' });
    },
  },

  reducers: {
    list(state, action) {
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

    updateStockQty(state, action) {
      action.count = state.edit.count + 1;
      return { ...state, updateStockQty: action };
    },

    fileUp(state, action) {
      action.count = state.fileUp.count + 1;
      return { ...state, fileUp: action };
    },
    del(state, action) {
      action.count = state.del.count + 1;
      return { ...state, del: action };
    },
    clear(state, action) {
      return { ...state, add: { count: 0 }, edit: { count: 0 }, del: { count: 0 }, detail: '' };
    },
  },
};