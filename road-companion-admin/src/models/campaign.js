import { getCampaignById,getAllCampaign, campaignUpdate, updateCampaign, createCampaign, deleteCampaign, uploadExcel, getSellerCampaign, getAllProduct } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'campaign',

  state: {
    list:[],
    plist:[],
    detail:[],
    add: { count: 0 },
    update: { count: 0 },
    edit: { count: 0 },
    fileUp: { count: 0 },
    del: { count: 0 }
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *campaignList({ payload }, { call, put }) {
      const response = yield call(getAllCampaign, payload);
      // if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *sellerCampaignList({ payload }, { call, put }) {
      const response = yield call(getSellerCampaign, payload);
    //  if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *productList({ payload }, { call, put }) {
      const response = yield call(getAllProduct, payload);
    //  if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'plist', ...response });
    },
    *campaignAdd({ payload }, { call, put }) {
      const response = yield call(createCampaign, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Campaign Created!", 5); }
      yield put({ type: 'add', ...response });
    },
    *campaignUpdate({ payload }, { call, put }) {
      const response = yield call(campaignUpdate, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Campaign Updated!", 5); }
      yield put({ type: 'update', ...response });
    },
    *campaignDetail({ payload }, { call, put }) {
      const response = yield call(getCampaignById, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      //if(response.status) {message.success(response.msg || response.message || response.err, 5);} 
      yield put({ type: 'detail', ...response });
    },
    *campaignEdit({ payload }, { call, put }) {
      const response = yield call(updateCampaign, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'edit', ...response });
    },
    *campaignDelete({ payload }, { call, put }) {
      const response = yield call(deleteCampaign, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Campaign Deleted!", 5); }
      yield put({ type: 'del', ...response });
    },
    *uploadExcelFile({ payload }, { call, put }) {
      let formData = new FormData();
      formData.append('f', payload)
      const response = yield call(uploadExcel, formData);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Campaign Excel File Uploaded Sucessfully!", 5); }
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
    plist(state, action) {
      return { ...state, plist: action };
    },
    detail(state, action) {
      return { ...state, detail: action };
    },
    add(state, action) {
      action.count = state.add.count + 1;
      return { ...state, add: action };
    },
    update(state, action) {
      action.count = state.update.count + 1;
      return { ...state, update: action };
    },
    edit(state, action) {
      action.count = state.edit.count + 1;
      return { ...state, edit: action };
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
      return { ...state, add: { count: 0 }, update: { count: 0 }, edit: { count: 0 }, del: { count: 0 }, detail: '' };
    },
  },
};