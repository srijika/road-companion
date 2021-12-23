import React, { useState,useEffect,Fragment} from 'react';
import {Modal,  Typography, Form,Input, Button,Select, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './style.less';
import { ReloadOutlined } from '@ant-design/icons'; 

const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};

const AddEdit =props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [btnDis, setBtnDis] = useState(false)

	useEffect(() => {
		let unmounted = false;
		let data = props.detail;		
		if(props.detail){form.setFieldsValue({
			  ['name']: data.codeTitle, 
			  ['code']: data.code, 
			  ['expireDate']:moment(data.expiryDate),
			  ['isPercent']: data.isPercent,
			  ['amount']: data.amount,
			  ['codeDescription']:data.codeDescription
			});}
		else{ form.resetFields(); }
		console.log(props.visible)
		return () => {unmounted = true;}
    },[props.visible])
	
	
	const onFinish= val=>{
		setBtnDis(true);
		if(props.detail){
			val._id = props.detail._id
			dispatch({type: 'coupon/couponEdit',  payload: val});		}
		else{
			dispatch({type: 'coupon/couponCreate',  payload: val});
		}
		cancelFun();
		/*let str = val.listData.split('');
		let data = str.map((item, index)=>{
			//console.log(item.charCodeAt(), item.charCodeAt() === 10)
			return str[index] = item.charCodeAt() === 10?'-':item
		});		
		//console.log(str,data, data.toString(), (data.toString()).replaceAll(',','').split('-').filter(function(el) { return el; }));		
		props.returnData((data.toString()).replaceAll(',','').split('-').filter(function(el) { return el; }))*/
	}

	const cancelFun = ()=>{
		if(!props.detail)
			form.resetFields();
		props.closeModel()
	}


	const handlegenerateCoupon = () => {
		let randomNumber = Math.floor(100000 + Math.random() * 900000)
		let code = 'GN'+ randomNumber;
		form.setFieldsValue({
			['code']: code, 
		})
	}

	//onOk={()=>form.submit()} onCancel={()=>setPicModel(false)}
return (
	<Modal visible={props.visible} title={props.detail ? 'Edit Coupon' : 'Add Coupon'} onCancel={cancelFun} footer=
	
	{<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
				<Button type="primary" className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>{props.detail?'Edit Coupon':'Add Coupon'}</Button>
			</Fragment>} >
		<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			
			{/* <Form.Item name="name" rules={[{ required: true, message: 'This field is required!' }]} >
				<Input placeholder="Code Title" />
			</Form.Item> */}

			<div className="input-group " style={{ display: 'flex'}}>
			<Form.Item  name="code" rules={[{ required: true, message: 'This field is required!' }]} >
				<Input placeholder="Coupon Code" />
			</Form.Item>
				<button type="button" className="btn btn-success" style={{ height: '36px', width: '26px' }}
				 onClick={() => { handlegenerateCoupon() }}> <ReloadOutlined />  </button>
			</div>


			<div className="form-group">
				<label style={{ color: 'grey' }}> Select Expire Date </label>
				<Form.Item name="expireDate"  placeholder="Select Expire Date"   rules={[{ required: true, message: 'This field is required!' }]} >
						<DatePicker  disabledDate={d => {
							const currentDate = new Date();
							currentDate.setDate(currentDate.getDate()+1) 
							return (!d || d.isBefore(currentDate.toDateString()))} } />
				</Form.Item>
			</div>
			
			<Form.Item name="isPercent" rules={[{ required: true, message: 'This field is required!' }]}>
				<Select placeholder="Is Percent">
					<Select.Option value={true} key={1}>Yes</Select.Option>
					<Select.Option value={false} key={0}>No</Select.Option>
				</Select>
			</Form.Item>
			
			<Form.Item name="amount"  rules={[{ required: true, message: 'This field is required!' }]} >
				<Input type="number" placeholder="Amount" />
			</Form.Item>

			<Form.Item name="codeDescription" rules={[{ required: false, message: 'This field is required!' }]} className="mb-0">
				<TextArea placeholder="Description" />
			</Form.Item>
		</Form>
		
	</Modal>
)};

export default connect(({ category, global, loading }) => ({
  category:category,
  global: global
}))(AddEdit);