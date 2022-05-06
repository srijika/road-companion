import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Row, Col, Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Space, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, InputNumber } from 'antd';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images'
import CropImage from '../../../components/sharing/crop-image'
import TextEditor from '../../../components/sharing/text-editor'
import moment from 'moment';
import { connect } from 'dva'; 
import styles from './style.less'; 
import { getSubCatbyCategory } from '../../../services/api'
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
const AddEditCarModel = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [Inquiry, setInquiry] = useState('');
	const [carId, setCarId] = useState('');
	const [count, setCount] = useState(0)


	let brandList = [];
	if(props.cars.list !== undefined){
		
		let data = props.cars.list ;
		brandList = data ? data : ''  ;
		console.log(brandList) ;
	}

	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		 props.dispatch({ type: 'cars/carList' });
		
		if (props.match.params.id) {
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
		}
		return () => { unmounted = true; }
	}, [dispatch])


	useEffect(() => {
		let unmounted = false;

		if(props.carModels.add){
			dispatch({ type: 'carModels/clearAction'});
			props.history.push('/car-models');
			
		}
		
		if(props.carModels.edit){
			dispatch({ type: 'carModels/clearAction'});
			
			if(props.carModels.edit.message){
				props.history.push('/car-models');

			}

		}


			
		if(props.carModels && props.carModels.detail && props.carModels.detail.data ){
			console.log("details" , props.carModels.detail.data[0])

			let data = props.carModels.detail.data[0];
			setCarId(data._id)

			form.setFieldsValue({
				['car_model']: data.car_model, 
				['car_id']: data.car_id,
				['_id']: data._id,
				['isActive']: data.isActive == true ? true : false,
			})

			
		}else {
			form.resetFields();
		}

		return () => { unmounted = true; }
	}, [props.carModels])


	
	const DetailFun = (id) => {
		props.dispatch({ type: 'carModels/detailCarModel', payload: id });
	}
	const cancelFun = () => {
		form.resetFields();
		props.history.push('/car-models');
	}

	const onFinish = val => {
		val.html = HTMLDecoderEncoder.encode(Inquiry);
		val = convertUndefinedObjectKeysToEmptyString(val);

		if (props.match.params.id) {
			val._id = carId;
			dispatch({ type: 'carModels/EditCarModel', payload: val });
		}else {
			dispatch({ type: 'carModels/AddCarModel', payload: val });
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
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/car-models')} /> 
			{ carId ? 'Edit Car Model' : 'Add Car Model'}</span>} style={{ marginTop: "0" }}>
			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			<Col sm={24} md={12}>
						<Form.Item name="car_id" label="Car Brand" rules={[{ required: true, message: 'This field is required!' }]}>
							<Select placeholder="Car Brand">
								{brandList.map((item, index) => <Select.Option key={index} value={item._id}>{item.brand_name}</Select.Option>)}
							</Select>
						</Form.Item>
			</Col>
				<Row gutter={15}>
					<Col sm={24} md={12}>
						<Form.Item name="car_model" label="Model Name" rules={[{ required: true, message: 'Field required!' },]}  >
							<Input placeholder="Model Name" />
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

export default connect(({ carModels, global,cars, loading }) => ({
	carModels: carModels,
	global: global,
	cars:cars 
}))(AddEditCarModel);