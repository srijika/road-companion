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
const AddEditReview = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [Inquiry, setInquiry] = useState('');
	const [reviewId, setReviewId] = useState('');
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
		
		if(props.reviews.add){
			dispatch({ type: 'reviews/clearAction'});
			
			if(props.reviews.add.message){
				props.history.push('/reviews');
			
			}
		}
		
		if(props.reviews.edit){
			dispatch({ type: 'reviews/clearAction'});
			
			if(props.reviews.edit.message){
				props.history.push('/users/reviews/'+props.reviews.detail.data.driver_id);

			}

		}
		if(props.reviews && props.reviews.detail && props.reviews.detail.status){
			let data = props.reviews.detail.data;
			setReviewId(data._id)
			//setInquiry(HTMLDecoderEncoder.decode(data.html));
			//console.log(data.html)
			form.setFieldsValue({
				['description']: data.description, 
				['_id']: data._id,
				['status']: data.status == 'True' ? 'True' : 'False',
			})
		}else {
			form.resetFields();
		}

		return () => { unmounted = true; }
	}, [props.reviews])
	
	const DetailFun = (id) => {
		props.dispatch({ type: 'reviews/reviewDetail', payload: id });
	}

	

	
	const cancelFun = () => {
		form.resetFields();
		props.history.push('/users/reviews/'+props.reviews.detail.data.driver_id);
	}

	const onFinish = val => {
		val.html = HTMLDecoderEncoder.encode(Inquiry);
		val = convertUndefinedObjectKeysToEmptyString(val);

		if (props.match.params.id) {
			val._id = reviewId;
			dispatch({ type: 'reviews/editReview', payload: val });
		}else {
			dispatch({ type: 'reviews/AddCarType', payload: val });
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
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/reviews')} /> 
			{ reviewId ? 'Edit Review' : 'Add Review'}</span>} style={{ marginTop: "0" }}>

			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
				
				<Row gutter={15}>
					<Col sm={24} md={12}>
						<Form.Item name="description" label="Review" rules={[{ required: true, message: 'Field required!' },]}  >
							<Input placeholder="Review" />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item  name="status" valuePropName="checked" >
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

export default connect(({ reviews, global, loading }) => ({
	reviews,global
	
}))(AddEditReview);