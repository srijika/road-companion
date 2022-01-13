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

const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const baseUrl = process.env.REACT_APP_ApiUrl
const AddEditPages = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [Inquiry, setInquiry] = useState('');
	const [PageId, setPageId] = useState('');
	const [count, setCount] = useState(0)

	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		if (props.match.params.id) {
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
		}
		return () => { unmounted = true; }
	}, [dispatch])
	
	const DetailFun = (id) => {
		props.dispatch({ type: 'pages/pagesDetail', payload: id });
	}

	useEffect(() => {
		let unmounted = false;

		if(props.pages.add){
			dispatch({ type: 'pages/clearAction'});
			props.history.push('/pages');
		}
		
		if(props.pages.edit){
			dispatch({ type: 'pages/clearAction'});
			props.history.push('/pages');
		}
		
		if(props.pages && props.pages.detail && props.pages.detail.status){
			let data = props.pages.detail.data[0];
			setPageId(data._id)
			setInquiry(HTMLDecoderEncoder.decode(data.html));
			form.setFieldsValue({
				['title']: data.title, 
				['description']: data.description, 
				['isActive']: data.isActive, 

			})
		}

		return () => { unmounted = true; }
	}, [props.pages])

	const cancelFun = () => {
		form.resetFields();
		props.history.push('/pages');
	}

	const onFinish = val => {
		val.html = HTMLDecoderEncoder.encode(Inquiry);
		val = convertUndefinedObjectKeysToEmptyString(val);

		if (props.match.params.id) {
			val._id = PageId;

			dispatch({ type: 'pages/EditPages', payload: val });
		}else {
			dispatch({ type: 'pages/AddPages', payload: val });
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
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/pages')} /> 
			{ props.detail ? 'Edit Page' : 'Add Page'}</span>} style={{ marginTop: "0" }}>

			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			
				<Row gutter={15}>
					<Col sm={24} md={12}>
						<Form.Item name="title" label="Title" rules={[{ required: true, message: 'Field required!' },]}  >
							<Input placeholder="Title" />
						</Form.Item>
					</Col>
				</Row>


				<Row gutter={15}>
					<Col sm={24} md={24}>
						<Form.Item name="html" label="html" rules={[{ required: false, message: 'This field is required!' }]} >
							<TextEditor returnVal={val => setInquiry(val)} data={Inquiry}/>
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

export default connect(({ pages, global, loading }) => ({
	pages: pages,
	global: global
}))(AddEditPages);