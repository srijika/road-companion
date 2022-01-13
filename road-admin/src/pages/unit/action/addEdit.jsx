import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Empty, Modal,Form,Input,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';
import { connect } from 'dva';

import axios from 'axios';


const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};
const baseUrl =  process.env.REACT_APP_ApiUrl;

const AddEdit = props => {
	const [form] = Form.useForm();
	const { dispatch} = props;
	const [btnDis, setBtnDis] = useState(false)
	
	
	
	useEffect(() => {
		let unmounted = false;

		let data = props.detail;		
		console.log('datasdfsdfsdf');
		console.log(data);
		if(props.detail){
			form.setFieldsValue({
			  ['name']: data.name, 
			});}
		else{ form.resetFields(); }
		console.log(props.visible)
		return () => {unmounted = true;}
    },[props.visible])
	

	const onFinish= async (val) => {
		// setBtnDis(true);
		let res;
		if(props.detail){
			val.id = props.detail.id
			res = await axios.post(`${baseUrl}/update/${props.detail.id}/unit`, val);
		}
		else{
			res = await axios.post(`${baseUrl}/create/unit`, val);
			console.log(res);
		}
		if(res.data.status === true) {	
			window.location.reload();
		}
		// props.updateDataToChild(val);
		// props.biRef.updateDataToChild(val);
	}
	

	const cancelFun = ()=>{
		if(!props.detail)
			form.resetFields();
		props.closeModel()
	}

	
return (
	<Modal visible={props.visible} title={props.detail?'Edit Unit':'Add Unit'} onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>
					{props.detail?'Edit Unit':'Add Unit'}
				</Button>
			</Fragment>} >
		<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			<Form.Item name="name"  rules={[{ required: true, message: 'This field is required!' }]} >
				<Input placeholder="Name" />
			</Form.Item>
		</Form>		
	</Modal>
)};

export default connect(({ blogsCategory, global, loading }) => ({
  blogsCategory:blogsCategory,
  global: global,
  loading: loading 
}))(AddEdit);