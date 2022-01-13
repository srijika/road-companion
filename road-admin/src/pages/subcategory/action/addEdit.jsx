import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';
import { connect } from 'dva';
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';


const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };

const baseUrl = process.env.REACT_APP_ApiUrl;

const SubCatAddEdit = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [catlist, setCatlist] = useState([])
	const [count, setCount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)

	const [attribute, setAttribute] = useState([]);  
	const [dataAttribute, setDataAttribute] = useState([]);

	useEffect(() => {

		getAttributes();
		let unmounted = false;
		let { category } = props;
		if (category.list) {
			setCatlist(category.list ? category.list.data : []);
		}
		else dispatch({ type: 'category/categoryList' });

		return () => { unmounted = true; }
	}, [dispatch])


	const getAttributes = async () => {

		const res = await axios.post(`${baseUrl}/list/attribute`);
		setAttribute(res.data.attribute);
	}

	useEffect(() => {
		let unmounted = false;
		let data = props.detail;
		if (props.detail) {

			let resultAttrribute= [];
			attribute.map((item) => {
				data.attributes.map((data_item)=> {					
					if(data_item == item._id) {
						resultAttrribute.push({ name: item.name, _id: item._id})
						return resultAttrribute;
					}
				})
			})
			console.log(resultAttrribute);
			setDataAttribute(resultAttrribute)
			

			form.setFieldsValue({
				['description']: data.description, ['parent_category']: data.parent_category._id, ['subcat']: data.subcategory, ['name']: data.name, ['slug']: data.slug,
			});
		}
		else { form.resetFields(); }
		console.log(props.visible)
		return () => { unmounted = true; }
	}, [props.visible])

	useEffect(() => {
		let unmounted = false;
		let { category } = props;
		setCatlist(category.list ? category.list.data : []);
		return () => { unmounted = true; }
	}, [props.category.list])

	const onFinish = val => {
		
		
		
		let attributesArr = [];
		dataAttribute.map((item) => {
			return attributesArr.push(item._id)
		})
		
		val['attributes'] = attributesArr;

		setBtnDis(true);
		if (props.detail) {
			val._id = props.detail._id
			dispatch({ type: 'subcategory/subCategoryEdit', payload: val, });
		}
		else {
			console.log('add')
			dispatch({ type: 'subcategory/subCategoryAdd', payload: val, });
		}

		setDataAttribute([]);
		/*let str = val.listData.split('');
		let data = str.map((item, index)=>{
			//console.log(item.charCodeAt(), item.charCodeAt() === 10)
			return str[index] = item.charCodeAt() === 10?'-':item
		});		
		//console.log(str,data, data.toString(), (data.toString()).replaceAll(',','').split('-').filter(function(el) { return el; }));		
		props.returnData((data.toString()).replaceAll(',','').split('-').filter(function(el) { return el; }))*/
	}

	useEffect(() => {
		let unmounted = false;
		let add = props.subcategory.add
		if (!unmounted && add.count > count && add.status) {
			setBtnDis(false);
			setCount(add.count);
			props.returnData('success');
		} else if (!unmounted && add.count > count && !add.status) {
			setBtnDis(false);
			setCount(add.count);
		}

		// Edit
		let edit = props.subcategory.edit
		if (!unmounted && edit.count > dcount && edit.status) {
			setBtnDis(false);
			setDCount(edit.count);
			console.log('edit', edit)
			props.returnData('success');
		} else if (!unmounted && edit.count > dcount && !edit.status) {
			setBtnDis(false);
			setDCount(edit.count);
		}
		return () => {
			unmounted = true;
		}
	}, [props.subcategory])

	const cancelFun = () => {
		if (!props.detail)
			form.resetFields();
		props.closeModel()
	}


	const onSelect = (selectedList, selectedItem) => {
		console.log(selectedList);
		setDataAttribute(selectedList);
	}

	const onRemove = (selectedList, removedItem) => {
		setDataAttribute(selectedList);
	}
	//onOk={()=>form.submit()} onCancel={()=>setPicModel(false)}
	return (
		<Modal visible={props.visible} title={props.detail ? 'Edit Sub-Category' : 'Add Sub-Category'} onCancel={cancelFun} footer={<Fragment>
			<Button onClick={cancelFun}>Cancel</Button>
			<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={() => form.submit()}>{props.detail ? 'Edit Sub-Category' : 'Add Sub-Category'}</Button>
		</Fragment>} >
			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
				<Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'This field is required!' }]} >
					<Input placeholder="Slug"  type="text" />
				</Form.Item>
				<Form.Item name="name" label="Name" rules={[{ required: true, message: 'This field is required!' }]} >
					<Input placeholder="Name" type="text" />
				</Form.Item>
				<Form.Item name="parent_category"  label="Parent Category" rules={[{ required: true, message: 'This field is required!' }]}>
					<Select placeholder="Parent Category">
						{catlist.map((item, index) => <Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
					</Select>
				</Form.Item>
				{/* <Form.Item name="subcat" rules={[{ required: false, message: 'This field is required!' }]}>
				<Select placeholder="Sub Category"  mode="multiple">
					{catlist.map((item,index)=><Select.Option value={item.id} key={index}>{item.name}</Select.Option>)}
				</Select>
			</Form.Item> */}
				<Form.Item name="description" label="Description" rules={[{ required: false, message: 'This field is required!' }]} className="mb-0">
					<TextArea placeholder="Description" type="text" />
				</Form.Item>


				<Form.Item name="attributes" label="Attributes" style={{ marginTop: "10px" }} rules={[{ required: false, message: 'This field is required!' }]}>
					{/* <Select placeholder="Select Attributes">
						{attribute.map((item, index) => <Select.Option value={item._id} key={index}>{item.name}</Select.Option>)}
					</Select> */}

						<Multiselect
							options={attribute} // Options to display in the dropdown
							selectedValues={dataAttribute} // Preselected value to persist in dropdown
							onSelect={onSelect} // Function will trigger on select event
							onRemove={onRemove} // Function will trigger on remove event
							displayValue="name" // Property name to display in the dropdown options
						/>

				</Form.Item>
			</Form>

		</Modal>
	)
};

export default connect(({ category, subcategory, global, loading }) => ({
	category: category,
	subcategory: subcategory,
	global: global
}))(SubCatAddEdit);