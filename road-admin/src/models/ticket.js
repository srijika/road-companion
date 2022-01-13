import {getOrders , getOrdersAdmin , orderDetails , getSellerTicketList ,updateTicket, closeTicket, getTicketList, getContactList,createTicket,detailTicket} 
from '../services/api'
import {message} from 'antd'; 
export default {
  namespace: 'ticket',

  state: {
      list:[],
      contactlist:[],
      add:false,
      update:false,
      close:false,
      detail:null
	},
  
  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },

  effects: {
    *ticketList({ payload }, { call, put }) {
      let response = {};
      if(payload.role == "ADMIN") {
        response = yield call(getTicketList);
      } else {
        response = yield call(getSellerTicketList, payload);
      }
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data: (response.tickets?[...response.tickets]:[]) });
    },
    *contactList({ payload }, { call, put }) {
      let response = {};
      response = yield call(getContactList);
      console.log("response" , response)


	    yield put({ type: 'contactlist', data: (response.data?[...response.data]:[]) });


      // if(payload.role == "ADMIN") {
        // response = yield call(getContactList);
      // console.log("response" , response)

      // } else {
      //   response = yield call(getSellerTicketList, payload);
      // }
      // if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    // yield put({ type: 'contactlist', data: (response.tickets?[...response.tickets]:[]) });
    },
    *createTicket({ payload }, { call, put }) {
      let response = {};
      response = yield call(createTicket, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	  yield put({ type: 'add', data:response.status });
    },
    *updateTicket({ payload }, { call, put }) {
      let response = {};
      response = yield call(updateTicket, payload);
      if(response.status) {message.success(response.msg || response.message || response.err, 5);}
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'update', data:response.status });
    },
    *closeTicket({ payload }, { call, put }) {
      let response = {};
      response = yield call(closeTicket, payload);
      if(response.status) {message.success(response.msg || response.message || response.err, 5);}
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'close', data:response.status });
    },
    *detailTicket({ payload }, { call, put }) {
      let response = {};
      response = yield call(detailTicket, payload);
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
  	  yield put({ type: 'detail', data:{...response.result} });
    }
  },

  reducers: {
    list(state, action) {
      return { ...state, list:action.data };
    },
    contactlist(state, action) {
      return { ...state, contactlist:action.data };
    },
    add(state, action) {
      return { ...state, add:action.data, update:false, close:false, detail:null };
    },
    update(state, action) {
      return { ...state, update:action.data, add:false, close:false, detail:null };
    },
    close(state, action) {
      return { ...state, close:action.data, add:false, update:false, detail:null };
    },
    detail(state, action) {
      return { ...state, detail:action.data, add:false, update:false, close:false };
    },
    clear(state, action) {
      return { ...state, add:false, update:false, close:false, detail:null };
    }
  },
};