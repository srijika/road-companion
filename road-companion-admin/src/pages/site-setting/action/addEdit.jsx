import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Empty, Modal,Form,Input,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';
import { connect } from 'dva';
import axios from 'axios';

const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};
const baseUrl = process.env.REACT_APP_ApiUrl


const AddEdit =props => {
	const [form] = Form.useForm();
	const { dispatch} = props;
	const [catlist, setCatlist] = useState([])
	const [count, setCount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	
	useEffect(() => {
		let unmounted = false;
		return () => {unmounted = true;}
    },[dispatch])
	
	
	useEffect(() => {
		let unmounted = false;

		let data = props.detail;		
		if(props.detail){
			form.setFieldsValue({
			  ['option']: data.option, 
			  ['value']: data.value, 
			});}
		else{ form.resetFields(); }
		return () => {unmounted = true;}
    },[props.visible])
	
	
	const onFinish= async (val) =>{
		setBtnDis(true);
		if(props.detail){
			val.id = props.detail._id
			let res =  await axios.post(`${baseUrl}/api/update/${val.id}/setting`, val);
			props.returnData(val);
		}
		else{
			let res =  await axios.post(`${baseUrl}/api/create/setting`, val);
			props.returnData(val);
		}

		setBtnDis(false);
	}
	
	
	
	const cancelFun = ()=>{
		if(!props.detail)
			form.resetFields();
		props.closeModel()
	}

	
	//onOk={()=>form.submit()} onCancel={()=>setPicModel(false)}
	
return (
	<Modal visible={props.visible} title={props.detail?'Edit Setting':'Add Setting'} onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>{props.detail?'Edit Setting':'Add Setting'}</Button>
			</Fragment>} >


				<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
					<Form.Item name="option"  rules={[{ required: true, message: 'This field is required!' }]} >
						<Input placeholder="Option"  disabled={ props.detail ? true : false } />
					</Form.Item>

					{
						props?.detail?.option === "PUBLIC_WEB_UNDER_MAINTENANCE" ||  props?.detail?.option === "SELLER_WEB_UNDER_MAINTENANCE" 
						? 
						<Form.Item name="value" >	
							<Select  style={{ width: "100%" }} defaultValue={props?.detail?.value} >
							 <Select.Option value="Yes">Yes</Select.Option>
							 <Select.Option value="No">No</Select.Option>
						   </Select>
						   </Form.Item>


						: 		
						<Form.Item name="value"  rules={[{ required: true, message: 'This field is required!' }]} >
							<Input placeholder="Value" />
						</Form.Item>
						}
					
				</Form>
		
	</Modal>
)};

export default connect(({  }) => ({  
}))(AddEdit);