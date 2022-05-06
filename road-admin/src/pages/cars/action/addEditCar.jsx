import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Input, Checkbox, Button, Select } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import HTMLDecoderEncoder from 'html-encoder-decoder';
import axios from 'axios'

const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };

const { Option } = Select;
const baseUrl = process.env.REACT_APP_ApiUrl;

const AddEditCar = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [Inquiry, setInquiry] = useState('');
	const [carId, setCarId] = useState('');
	const [carTypes, setCarTypes] = useState([])


	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		getCarTypes();
		if (props.match.params.id) {
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
		}
		return () => { unmounted = true; }
	}, [dispatch])


	useEffect(() => {
		let unmounted = false;

		if (props.cars.add) {
			dispatch({ type: 'cars/clearAction' });
			if (props.cars.add.message) {
				props.history.push('/car-brands');
			}
		}

		if (props.cars.edit) {
			dispatch({ type: 'cars/clearAction' });
			if (props.cars.edit.message) {
				props.history.push('/car-brands');
			}
		}

		if (props.cars && props.cars.detail && props.cars.detail.status) {
			let data = props.cars.detail.data[0];
			setCarId(data._id)
			form.setFieldsValue({
				['brand_name']: data.brand_name,
				['_id']: data._id,
				['isActive']: data.status === "true" ? true : false,
			})

		} else {
			form.resetFields();
		}

		return () => { unmounted = true; }
	}, [props.cars])


	const DetailFun = (id) => {
		props.dispatch({ type: 'cars/detailCar', payload: id });
	}

	const getCarTypes = async () => {
		const types_result = await axios.post(`${baseUrl}/api/get-cars-type`)
		console.log('types_result', types_result.data)
		let types = types_result?.data?.data;
		setCarTypes(types)
	}

	const cancelFun = () => {
		form.resetFields();
		props.history.push('/car-brands');
	}

	const onFinish = val => {
		console.log('val.status', val.status)
		if(['', undefined,'undefined', null].includes(val.status)) {
			val['status'] = false;
		}

		if (props.match.params.id) {
			val._id = carId;
			dispatch({ type: 'cars/EditCar', payload: val });
		} else {
			dispatch({ type: 'cars/AddCar', payload: val });
		}
	}

	const convertUndefinedObjectKeysToEmptyString = (object) => {
		var output = {};
		for (let i in object) {
			if (!object[i]) {
				output[i] = "";
			} else {
				output[i] = object[i];
			}
		}
		return output;
	}

	return (
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/car-brands')} />
			{props.cars.detail ? 'Edit Car' : 'Add Car'}</span>} style={{ marginTop: "0" }}>

			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
				<Row gutter={15}>
					<Col sm={24} md={12}>
						<Form.Item name="type_id" label="Type" rules={[{ required: true, message: 'Field required!' }]}  >
							<Select
								showSearch
								placeholder="Search to Select"
								onChange={(val) => {
									console.log('val', val)
								}}
							>
								{
									carTypes.map((item) => {
										return (
											<Option value={item._id}> {item.title} </Option>
										)
									})
								}
							</Select>
						</Form.Item>
					</Col>

				</Row>

				<Row gutter={15}>
					<Col sm={24} md={12}>
						<Form.Item name="brand_name" label="Car Brand Name" rules={[{ required: true, message: 'Field required!' },]}  >
							<Input placeholder="Brand Name" />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name="status" valuePropName="checked" >
					<Checkbox defaultChecked={false} >Status</Checkbox>
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