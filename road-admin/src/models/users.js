import {getUserList, getUserDetail, editUsers, deleteUser} from '../services/api'
import {message} from 'antd'; 
export default {
  namespace: 'users',

  state: {
	del:{count:0},
	add:{count:0},
	edit:{count:0}
	},

  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	  yield put({ type: 'list', ...response});
    },
    *getDetail({ payload }, { call, put }) {
      const response = yield call(getUserDetail, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'detail', ...response});
    },
    *editItem({ payload }, { call, put }) {
      const response = yield call(editUsers, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      if(response.status) {message.success(response.msg || response.message || response.err, 5);} 
      yield put({ type: 'edit', ...response});
    },
    *deleteItem({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      if(response.status) {message.success("User Deleted Successfully!", 5);} 
      yield put({ type: 'del', ...response});
    },
	*clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear'});
    },
  },

  reducers: {
    list(state, action) {
      return { ...state, list:action };
    },
    detail(state, action) {
      return { ...state, detail:action };
    },
    edit(state, action) {
		action.count = state.edit.count+1;
		return { ...state, edit:action };
    },
    del(state, action) {
		action.count = state.del.count+1;
		return { ...state, del:action };
    },
	clear(state, action) {
		return { ...state, edit:{count:0}, del:{count:0}};
    },
  },
};