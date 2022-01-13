import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Empty, Modal,Form,Input,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';

import { connect } from 'dva';

const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};

const AddEdit =props => {
	const [form] = Form.useForm();
	const { dispatch} = props;
	const [catlist, setCatlist] = useState([])
	const [count, setCount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	
	useEffect(() => {
		let unmounted = false;
		dispatch({type: 'returnPolicy/returnPolicyList'});
		return () => {unmounted = true;}
    },[dispatch])
	
	
	useEffect(() => {
		let unmounted = false;

		let data = props.detail;		
		if(props.detail){
			form.setFieldsValue({
			  ['days']: data.days, 
			});}
		else{ form.resetFields(); }
		console.log(props.visible)
		return () => {unmounted = true;}
    },[props.visible])
	
	useEffect(() => { 
		let unmounted = false;
		let {returnPolicy} = props;
		setCatlist(returnPolicy.list ? returnPolicy.list.result:[]);
		return () => {unmounted = true;}
    },[props.returnPolicy.list])
	
	const onFinish= val=>{
		console.log("on submit")
		console.log(props, val)
		setBtnDis(true);
		if(props.detail){
			val.id = props.detail.id
			console.log("props")
			console.log(val)

		
			dispatch({type: 'returnPolicy/returnPolicyEdit',  payload: val,});
		}
		else{
			console.log('add')
			dispatch({type: 'returnPolicy/returnPolicyAdd',  payload: val,});
		}
	}
	
	useEffect(() => {
		let unmounted = false;
		let add = props.returnPolicy.add
		if(!unmounted && add.count > count && add.status){
			setBtnDis(false);
		  setCount(add.count);
		  props.returnData('success');
		}else if(!unmounted && add.count > count && !add.status){
		  setBtnDis(false);
		  setCount(add.count);
		}
		
		// Edit
		let edit = props.returnPolicy.edit;
		console.log(edit)
		if(!unmounted && edit.count > dcount && edit.status){
		  setBtnDis(false);
		  setDCount(edit.count);
		  console.log('edit', edit)
		  props.returnData('success');
		}else if(!unmounted && edit.count > dcount && !edit.status){
		  setBtnDis(false);
		  setDCount(edit.count);
		}
		return () => {
			unmounted = true;
		}
	},[props.returnPolicy])
	
	const cancelFun = ()=>{
		if(!props.detail)
			form.resetFields();
		props.closeModel()
	}

	
	//onOk={()=>form.submit()} onCancel={()=>setPicModel(false)}
return (
	<Modal visible={props.visible} title={props.detail?'Edit Return Policy':'Add Return Policy'} onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>{props.detail?'Edit Return Policy':'Add Return Policy'}</Button>
			</Fragment>} >
		<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			<Form.Item name="days"  rules={[{ required: true, message: 'This field is required!' }]}  >
				<Input type="number" placeholder="Return Policy Day" />
			</Form.Item>
		</Form>
		
	</Modal>
)};

export default connect(({ returnPolicy, global, loading }) => ({
  returnPolicy:returnPolicy,
  global: global,
  loading: loading 
}))(AddEdit);