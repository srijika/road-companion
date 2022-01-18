import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Row, Col, Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Space, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, InputNumber } from 'antd';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images'
import CropImage from '../../../components/sharing/crop-image'
import TextEditor from '../../../components/sharing/text-editor'
import moment from 'moment';
import { connect } from 'dva'; 
import styles from './style.less'; 
import { getSubCatbyCategory } from '../../../services/api';
// import { RMIUploader } from "react-multiple-image-uploader";
import MultiImageInput from 'react-multiple-image-input';
import HTMLDecoderEncoder from 'html-encoder-decoder';
import cars from '../../../models/cars';

const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const baseUrl = process.env.REACT_APP_ApiUrl
const AddEditCar = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [Inquiry, setInquiry] = useState('');
	const [carId, setCarId] = useState('');
	const [count, setCount] = useState(0)


	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		//props.dispatch({ type: 'blogsCategory/blogsCategoryList' });
		// props.dispatch({ type: 'category/categoryList' });
		
		if (props.match.params.id) {
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
		}
		return () => { unmounted = true; }
	}, [dispatch])


	useEffect(() => {
		let unmounted = false;

		// if(props.blogs.add){
		// 	dispatch({ type: 'blogs/clearAction'});
		// 	props.history.push('/blogs');
		// }
		
		// if(props.blogs.edit){
		// 	dispatch({ type: 'blogs/clearAction'});
		// 	props.history.push('/blogs');
		// }

		

		
		if(props.cars.add){
			dispatch({ type: 'cars/clearAction'});
			console.log(props.cars.add.message)
			if(props.cars.add.message){
				props.history.push('/car-brands');
			
			}
		}
		
		if(props.cars.edit){
			dispatch({ type: 'cars/clearAction'});
			console.log("props")
			console.log(props.cars.edit.message)

			console.log(props)
			if(props.cars.edit.message){
				props.history.push('/car-brands');

			}

		}


			
		if(props.cars && props.cars.detail && props.cars.detail.status){
			let data = props.cars.detail.data[0];
			setCarId(data._id)
			//setInquiry(HTMLDecoderEncoder.decode(data.html));
			//console.log(data.html)
			form.setFieldsValue({
				['brand_name']: data.brand_name, 
				['_id']: data._id,
				['isActive']: data.status === "true" ? true : false,
			})

			
		}else {
			form.resetFields();
		}

		return () => { unmounted = true; }
	}, [props.cars])


	
	const DetailFun = (id) => {
		props.dispatch({ type: 'cars/detailCar', payload: id });
	}

	

	
	const cancelFun = () => {
		form.resetFields();
		props.history.push('/car-brands');
	}

	const onFinish = val => {
		val.html = HTMLDecoderEncoder.encode(Inquiry);
		val = convertUndefinedObjectKeysToEmptyString(val);

		if (props.match.params.id) {
			val._id = carId;
			dispatch({ type: 'cars/EditCar', payload: val });
		}else {
			dispatch({ type: 'cars/AddCar', payload: val });
		}
	}

	const convertUndefinedObjectKeysToEmptyString = (object) => {
		var output = {};
		for(let i in object) {
			if(!object[i]) {
				output[i] = "";
			} else {
				output[i] = object[i];
			}	
		}
		return output;
	}

	return (
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/car-brands')} /> 
			{ props.cars.detail ? 'Edit Car' : 'Add Car'}</span>} style={{ marginTop: "0" }}>

			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
				
				<Row gutter={15}>
					<Col sm={24} md={12}>
						<Form.Item name="brand_name" label="Brand Name" rules={[{ required: true, message: 'Field required!' },]}  >
							<Input placeholder="Brand Name" />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item  name="isActive" valuePropName="checked" >
                  <Checkbox>isActive</Checkbox>
             	 </Form.Item>

				<Form.Item className="mb-0">
					<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
					<Button type="primary" className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
				</Form.Item>
			</Form>

		</Card>
	)
};

export default connect(({ cars, global, loading }) => ({
	cars: cars,
	global: global
}))(AddEditCar);