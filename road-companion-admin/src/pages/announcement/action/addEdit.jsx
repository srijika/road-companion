import React, { useState,useEffect,Fragment} from 'react';
import {Modal,  Typography, Form,Input, Button,Select, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import axios from 'axios';

const { TextArea } = Input;
const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};

const baseUrl = process.env.REACT_APP_ApiUrl;


const AddEdit =props => {
	const [form] = Form.useForm();
	const [btnDis, setBtnDis] = useState(false)


	let id = props.match.params.id;

	useEffect(() => {
		if(id) {
			getAnnouncementData();
		}
    },[])

	const getAnnouncementData = async () => {
		const res = await axios.post(`${baseUrl}/edit/${id}/announcement`)
		let announcement = res.data.announcement;

		form.setFieldsValue({
			['title'] : announcement.title,
			['message'] : announcement.message,
			['status'] : announcement.status,
			['for_seller'] : announcement.for_seller,
			['for_customer'] : announcement.for_customer,
		})
		console.log();

	}
	
	const onFinish= async (val) =>{
		setBtnDis(true);

		if(id){
			const res = await axios.post(`${baseUrl}/update/${id}/announcement`, val)
			console.log(res);
		}
		else{
			const res = await axios.post(`${baseUrl}/create/announcement`, val)
			console.log(res);
		}
		props.history.push('/announcement');
		
	}


	// const cancelFun = ()=>{
	// 	if(!props.detail)
	// 		form.resetFields();
	// 	props.closeModel()
	// }

return (
		<>

		<div style={{ border: "1px solid silver", }}>

		<h5 style={{ padding: "0px 10px", marginTop: "10px" }}> { (id) ? "Edit" : "Add" }   Announcement </h5>
		<hr width="100%" />

		<Form style={{ padding: "10px" }} {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">

			<label> Title </label>
			<Form.Item name="title"  rules={[{ required: true, message: 'This field is required!' }]} >
				<Input type="text" placeholder="Enter Title" />
			</Form.Item>

			<label> Message </label>
			<Form.Item name="message" rules={[{ required: false, message: 'This field is required!' }]} className="mb-0">
				<TextArea placeholder="Message" />
			</Form.Item>

			<br />
			<label> Status </label>
			<Form.Item  name="status" rules={[{ required: true, message: 'This field is required!' }]}>
				<Select placeholder="Status">
					<Select.Option value={'1'} >Active</Select.Option>
					<Select.Option value={'0'} >Deactive</Select.Option>
				</Select>
			</Form.Item>


			<label> For Customer </label>
			<Form.Item  name="for_customer" rules={[{ required: true, message: 'This field is required!' }]}>
				<Select placeholder="For Customer">
					<Select.Option value={true} >Yes</Select.Option>
					<Select.Option value={false}>No</Select.Option>
				</Select>
			</Form.Item>

			<label> For Seller </label>
			<Form.Item  name="for_seller" rules={[{ required: true, message: 'This field is required!' }]}>
				<Select placeholder="For Seller">
					<Select.Option value={true} >Yes</Select.Option>
					<Select.Option value={false}>No</Select.Option>
				</Select>
			</Form.Item>


			<Button disabled={btnDis} type="primary" onClick={() => form.submit()} > Submit </Button>
		</Form>
		
</div>
		</>
)};

export default connect(({ category, global, loading }) => ({
	category:category,
	global: global
}))(AddEdit);