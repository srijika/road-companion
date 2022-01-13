import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Empty, Modal, Card, Typography, Alert,Form,Input, Checkbox,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './style.less';

const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};


const baseUrl = process.env.REACT_APP_ApiUrl

const AddEdit =props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [catlist, setCatlist] = useState([])
	const [count, setCount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	const [image, setImage] = useState()
	const [showImage, setShowImage] = useState()
	
	useEffect(() => {
		setShowImage();
		let unmounted = false;
		let {category} = props;
		if(category.list)
		{
		setCatlist(category.list ? category.list.data:[]);
		}
		else dispatch({type: 'category/categoryList'});
		
		
		return () => {unmounted = true;}
    },[dispatch])
	
	
	useEffect(() => {
		let unmounted = false;
		let data = props.detail;		



		if(props.detail){
			form.setFieldsValue({
			  ['description']: data.description, 
			  ['name']: data.name, 
			  ['slug']: data.slug,
			  ['gst']: data.gst,
			  ['commission']: data.commission,
			});

			
			let image = `${baseUrl}/categories/${data.image}`;
			setShowImage(image);
		}
		else{ form.resetFields(); }
		console.log(props.visible)
		return () => {unmounted = true;}
    },[props.visible])
	
	useEffect(() => {
		let unmounted = false;
		let {category} = props;
		setCatlist(category.list ? category.list.data:[]);
		return () => {unmounted = true;}
    },[props.category.list])


	const imageFun = (e) => {
		setImage(e.target.files[0])
		setShowImage(URL.createObjectURL(e.target.files[0]));
	}

	
	


	const onFinish= val=>{

		val['image'] = image;
		const formData = new FormData();

		formData.append('image', image);
		formData.append('name', val.name);
		formData.append('description', val.description);
		formData.append('gst', val.gst);
		formData.append('commission', val.commission);

		setBtnDis(true);
		if(props.detail){
			formData.append('_id', props.detail._id);
			formData.append('slug', val.slug);
			dispatch({type: 'category/categoryEdit',  payload: formData,});
		}
		else{
			dispatch({type: 'category/categoryAdd',  payload: formData,});
		}

		setShowImage('');
	}
	
	useEffect(() => {
		let unmounted = false;
		let add = props.category.add
		if(!unmounted && add.count > count && add.status){
			setBtnDis(false);
		  setCount(add.count);		  
		  props.returnData('success');
		}else if(!unmounted && add.count > count && !add.status){
		  setBtnDis(false);
		  setCount(add.count);
		}
		
		// Edit
		let edit = props.category.edit
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
    },[props.category])
	
	const cancelFun = ()=>{
		if(!props.detail)
			form.resetFields();
		props.closeModel()
	}
	//onOk={()=>form.submit()} onCancel={()=>setPicModel(false)}
return (
	
	<Modal visible={props.visible} title={props.detail?'Edit Category':'Add Category'} onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>{props.detail?'Edit Category':'Add Category'}</Button>
			</Fragment>} >
		<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			<Form.Item name="slug"  label="Slug" rules={[{ required: true, message: 'This field is required!' }]} >
				<Input placeholder="Slug" type="text" />
			</Form.Item>
			<Form.Item name="name" label="Name"  rules={[{ required: true, message: 'This field is required!' }]} >
				<Input placeholder="Name"  type="text" />
			</Form.Item>
			<Form.Item name="description" label="Description" rules={[{ required: true, message: 'This field is required!' }]} >
				<TextArea placeholder="Description"  type="text" />
			</Form.Item>

			<Form.Item name="gst" label="GST %"  rules={[{ required: true, message: 'This field is required!' }]} >
				<Input placeholder="GST"  type="number" />
			</Form.Item>
			{/* <Form.Item name="commission" label="Commission"  rules={[{ required: true, message: 'This field is required!' }]} className="mb-0">
				<Input placeholder="commission" type="number" />
			</Form.Item> */}

			<div>
				<input type="file" name="image" onChange={(e) => { imageFun(e) }}  />
				<img src={showImage} style={{ height: '60px', width: "60px" }} />
			</div>
		</Form>
		
	</Modal>
)};

export default connect(({ category, global, loading }) => ({
  category:category,
  global: global
}))(AddEdit);