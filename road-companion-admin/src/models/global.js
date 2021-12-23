import {uploadFiles} from '../services/api'
import {message} from 'antd'; 
export default {
  namespace: 'global',
  state:{
	  toggleval:false,
	  upload:{count:0},
	  uploadsingle:{count:0}
	 },
  subscriptions: {
    setup({ dispatch, history }) { 
    },
  },
  effects: {
	*uploadFile({ payload }, { call, put }) {
		console.log('file', payload)
		  const response = {}; 
      const fileList = payload.map( (item) =>  item.image ); 
      yield put({ type: 'upload', ...{...response, file: fileList}});
    },
	*uploadFileSingle({ payload }, { call, put }) {
		    const response = {};
        yield put({ type: 'uploadsingle', ...{...response, file: payload[0].image }});
    },
	*clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear',});
    },
  },
  reducers: {
    toggle(val) { 
      console.log(val);
      return {toggleval:!val.toggleval};
    },
    minus(count) { return count - 1 },
	
	upload(state, action) {
		action.count = state.upload.count+1;
		return { ...state, upload:action };
    },
	uploadsingle(state, action) {
		action.count = state.uploadsingle.count+1;
		return { ...state, uploadsingle:action };
    },
	clear(state, action) {
		return { ...state, upload:{count:0}, uploadsingle:{count:0} };
    },
	
  },
};
