import {getDashboardData, getprofile, updateprofile, deleteUser} from '../services/api'
import {message} from 'antd'; 
export default {
  namespace: 'account',

  state: {
    dashborddetail:{count:0},
    detail:{count:0},
    del:{count:0},
    add:{count:0},
    edit:{count:0}
	},

  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {
    *getDashbordDetail({ payload }, { call, put }) {
      const response = yield call(getDashboardData, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'dashborddetail', ...response});
    },
    *getDetail({ payload }, { call, put }) {
      const response = yield call(getprofile, payload);
      // console.log(payload._id)
      if(payload._id){
        if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
        yield put({ type: 'detail', ...response});
      }

     
    },
    *editItem({ payload , history }, { call, put }) {
      console.log(history.history)
      const response = yield call(updateprofile, payload); 
      if(!response.status) {message.error(response.msg || response.message || "Account Updated!", 5);}
      if(response.status) {message.success("Profile Updated Successfull" || response.message || response.err, 5);
      history.history.push('/')
    } 
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
    dashborddetail(state, action) {
      action.count = state.dashborddetail.count+1;
      return { ...state, dashborddetail:action };
    },
    list(state, action) {
      return { ...state, list:action };
    },
    detail(state, action) {
		action.count = state.detail.count+1;
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