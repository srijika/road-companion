import {getCarsList,createCars,editCar,deleteCar,getCarDetails} 
from '../services/api'
import {message} from 'antd'; 

export default {
  namespace: 'cars',

  state: {
      list:[],
      detail:{},
      delete:false,
      add:false,
      edit:false
	},

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *carList({ payload }, { call, put }) {
      let response = {};
        response = yield call(getCarsList, payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'list', data:[...response.data] });
    },
    *deleteCar({ payload }, {call,put}) {
      let response = {};
      response = yield call(deleteCar,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'delete', message:response.status });
    },
    *AddCar({ payload }, {call,put}) {
      let response = {};
      response = yield call(createCars,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'add', message: response.status });
    },
    *EditCar({ payload }, {call,put}) {
      let response = {};
      response = yield call(editCar,payload); 
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
	    yield put({ type: 'edit', message: response.status });
    },

    *detailCar({ payload }, { call, put }) {

      const response = yield call(getCarDetails, payload);
      console.log(payload)
      if(!response.status) {message.error(response.msg || response.message || response.err, 5);}
      yield put({ type: 'detail', ...response});
    },

    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear' });
    },
  },
  
  reducers: {

    list (state, action) {
      return { ...state, list:[...action.data] };
    },
    detail(state, action) {
      return { ...state, detail: action };
    },
    delete (state, action) {
      return { ...state, delete:action };
    },
    add (state,action) {
      return { ...state, add: action };
    },
    edit (state,action) {
      return { ...state, edit: action };
    },
    clear (state,action) {
      return { ...state,  detail:{}, delete:false, add:false, edit:false };
    },
    

  },
};