// import React, {useState, Component, useEffect } from 'react';
// import Apploader from './../../components/loader/loader'
// import { connect } from 'dva';
// import moment from 'moment';
// import {Row, Col, Form, Input, Button,DatePicker,  Checkbox, Card, Radio, Divider, Modal } from 'antd';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';
// //import styles from './login.less';
// import axios from 'axios';
// const baseUrl = process.env.REACT_APP_ApiUrl;

// const dateFormat = 'MM/DD/YYYY';

// const Account = props => {
// 	const [count, setCount] = useState(0)
// 	const [dcount, setDcount] = useState(0)
	
// 	const [userId, setUserId] = useState('')
// 	const [detailData, setDetailData] = useState({})
	
// 	const role = useState(localStorage.getItem('role'))
// 	const { dispatch } = props;
// 	const [form] = Form.useForm();
// 	const [myMobileNoOTP, setMyMobileNoOTP] = useState('');

// 	const [modalVisible, setModalVisible] = useState(false);
// 	let user_data = JSON.parse(localStorage.getItem('user'));
// 	const [myMobileNo, setMyMobileNo] = useState('');
// 	const [isMobileVerify, setIsMobileVerified] = useState(false);
// 	const [modalVerifyVisible, setModalVerifyVisible] = useState(false);

// 	const openModalForVerify = () => {
// 		let val = { mobile_number:myMobileNo };
// 		dispatch({ type: 'setting/resendOTPTOUser', payload: val, });
// 		setModalVerifyVisible(true);
// 	}





// 	useEffect(() => {
// 		let mobile_verified = localStorage.getItem('isMobileVerified');
// 		if(mobile_verified == 'false' || mobile_verified == false) {
// 			setIsMobileVerified(false);
// 		}else {
// 			setIsMobileVerified(true);
// 		}
// 	}, [])


// 	const handleCancel = () => {
// 		setModalVisible(false);
// 		setModalVerifyVisible(false);
// 	}

// 	const changeMobileOTP = (event) =>{
// 		setMyMobileNoOTP(event.target.value);
// 	}

// 	const addMobileVerify = async () => {

// 		let data = {
// 			otp : myMobileNoOTP, 
// 			mobile: myMobileNo,
// 		};
		
// 		const res = await axios.post(`${baseUrl}/is-mobile/verified`,  data);
// 		if(res.data.status === true) {
// 			alert(res.data.message);
// 			localStorage.setItem('isMobileVerified', true);
// 			setModalVerifyVisible(false);
// 			setIsMobileVerified(true);
// 		}
// 		console.log(res);	
// 	}


// 	useEffect(() => {
// 		let myMobileNo = user_data.mobile;
// 		setMyMobileNo(myMobileNo);

// 		let unmounted = false;
// 		setTimeout(()=>document.title = 'Setting', 100);
// 		dispatch({type: 'account/clearAction'});
// 		setUserId(localStorage.getItem('userId'))
// 		getDetail(localStorage.getItem('userId'))
// 		return () => {
// 			unmounted = true;
// 		}
//     },[dispatch])

// 	const getDetail=(id)=> dispatch({ type: 'account/getDetail',  payload: { _id:id, profile_id: id },});
	
// 	useEffect(() => {

// 		let unmounted = false;
// 		console.log(props)
// 		let detail = props.account.detail;	
// 		if(!unmounted && detail.count > dcount && detail.status){
// 			setDcount(detail.count);
// 			let data = props.account.detail ? props.account.detail.profile : {};
// 			setDetailData(data);
// 			console.log(data)
// 			form.setFieldsValue({
// 				['gender']: data.gender,  ['name']: data.name, ['email']: data.email, ['phone']: data.phone,  ['photo']: data.photo, ['dob']: data.dob && moment(new Date(data.dob) || null, dateFormat)
// 			});
// 		}
		
// 		let edit = props.account.edit;		
// 		if(!unmounted && edit.count > count && edit.status){
// 			setCount(edit.count);
// 			getDetail(userId);
// 		}else if(!unmounted && edit.count > count && !edit.status){
// 			setCount(edit.count);
// 		}
		
// 		return () => {
// 			unmounted = true;
// 		}
//     },[props.account])
	
	
// 	const verifyFormFun = val =>{
// 		getDetail(userId);
// 	}

	

// 	const onFinish = val =>{
// 		console.log('onFinish',val);

// 		let date = val.dob



// 		let values = {
// 			"name": val.name ,
// 			"email": val.email,
// 			"phone": val.phone,
// 			"gender": val.gender,
// 			"photo": detailData.photo || 'new image',
// 			"dob" : date

// 		}


// 		dispatch({ type: 'account/editItem',  payload: values , history : props});
// 	}
// 	console.log(props)


//   return (
// 	<div>
// 		<Apploader show={props.loading.global}/>
// 		<Card style={{ width: '100%' }} title="Account" bodyStyle={{padding:'20px 20px'}}>
// 			<Form name="normal_login" form={form} className="full-width-form" initialValues={{ remember: true, }} onFinish={onFinish} layout={'vertical'}>
// 				<Row gutter={16}>
// 					<Col sm={24} md={12}>
// 						<Form.Item name="name" label="Name" rules={[ { required: true, message: 'Please input your Name!', }, ]} >
// 						<Input placeholder="Name" />
// 						</Form.Item>
// 					</Col>
// 					<Col sm={24} md={12}>
// 						<Form.Item name="email" label="Email" rules={[ { required: true, message: 'Field required!', }, ]} >
// 						<Input placeholder="Email" disabled/>
// 						</Form.Item>
// 					</Col>
// 					<Col sm={24} md={12}>
// 						{/* <Form.Item name="phone" label="Phone" rules={[ { required: true, message: 'Field required!', }, ]} >
// 						<Input placeholder="Phone" disabled/>
// 						</Form.Item> */}

// 							{/* <div style={{ display: 'flex' }}>
// 							<Form.Item name="phone" label="Phone" rules={[ { required: true, message: 'Field required!', }, ]} >
// 									<Input placeholder="Phone" disabled/>
// 							</Form.Item>
// 								<Button type="primary" className="btn-w25" onClick={openModalForVerify} >Verify</Button>
// 							</div> */}

// 							<Form.Item label="PHONE">
// 								<Row gutter={12}>
// 									<Col span={12}>
// 										<Form.Item name="phone" rules={[{ required: true, message: 'Field required!', },]}  >
// 											<Input disabled placeholder="Phone"  />
// 										</Form.Item>
// 									</Col>
// 									<Col span={12}>	
// 									{ (isMobileVerify === true) ? '' :
// 										<Button type="primary" className="btn-w25" onClick={openModalForVerify} >Verify</Button>
// 									} 
// 									</Col>
// 								</Row>
// 							</Form.Item>

// 					</Col>

					
// 					<Col sm={24} md={12}>
// 						<Form.Item name="dob" label="DOB" rules={[ { required: true, message: 'Field required!', }, ]} >
// 							<DatePicker format="YYYY-MM-DD"/>
// 						</Form.Item>
// 					</Col>
// 					<Col sm={24} md={12}>
// 						<Form.Item name="gender" label="gender"  rules={[ { required: true, message: 'Please select Gender!', }, ]}>
// 							<Radio.Group>
// 							  <Radio value="Male">Male</Radio>
// 							  <Radio value="Female">Female</Radio>
// 							  <Radio value="Other">Other</Radio>
// 							</Radio.Group>
// 						</Form.Item>
// 					</Col>
// 				</Row>
				
// 				<Form.Item>
// 					<Button type="primary" htmlType="submit" className="login-form-button">Address</Button>
// 				</Form.Item>
// 				</Form>
			
//         </Card>

// 	</div>
//   );
// };

// export default connect(({account, loading}) => ({
// 	account, loading
// }))(Account);