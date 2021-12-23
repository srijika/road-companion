import React, {useState, Component, useEffect } from 'react';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import moment from 'moment';
import {Row, Col, Form, Input, Button,DatePicker, Card, Radio, Modal, Upload, message, Avatar, Image  } from 'antd';
import UploadImages from '../../components/sharing/upload-images'
import { LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
const baseUrl = process.env.REACT_APP_ApiUrl;

const dateFormat = 'MM/DD/YYYY';

const Account = props => {
	const [count, setCount] = useState(0)
	const [dcount, setDcount] = useState(0)
	const [imagesList, setImagesList] = useState([]);
	const [visible, setVisible] = useState(false);
	const [userId, setUserId] = useState('');
	const [avatar, setAvatar] = useState('');
	const [detailData, setDetailData] = useState({})
	const role = useState(localStorage.getItem('role'))
	const { dispatch } = props;
	const [form] = Form.useForm();
	const [myMobileNoOTP, setMyMobileNoOTP] = useState('');

	const [modalVisible, setModalVisible] = useState(false);
	let user_data = JSON.parse(localStorage.getItem('user'));
	const [myMobileNo, setMyMobileNo] = useState('');
	const [isMobileVerify, setIsMobileVerified] = useState(false);
	const [modalVerifyVisible, setModalVerifyVisible] = useState(false);

	const openModalForVerify = () => {
		let val = { mobile_number:myMobileNo };
		dispatch({ type: 'setting/resendOTPTOUser', payload: val, });
		setModalVerifyVisible(true);
	}


	const convertToFormData = (val) => {
		const formData = new FormData();
	
		for(const key in val) {

				formData.append(key,val[key])
			
		}
		if(imagesList.length > 0 && imagesList[0].file) {
		
			formData.append("file",imagesList[0].file);
		}  
	
		return formData;
	}


	useEffect(() => {
		let mobile_verified = localStorage.getItem('isMobileVerified');
		if(mobile_verified == 'false' || mobile_verified == false) {
			setIsMobileVerified(false);
		}else {
			setIsMobileVerified(true);
		}
	}, [])


	const handleCancel = () => {
		setModalVisible(false);
		setModalVerifyVisible(false);
	}

	const changeMobileOTP = (event) =>{
		setMyMobileNoOTP(event.target.value);
	}

	const addMobileVerify = async () => {

		let data = {
			otp : myMobileNoOTP, 
			mobile: myMobileNo,
		};
		
		const res = await axios.post(`${baseUrl}/is-mobile/verified`,  data);
		if(res.data.status === true) {
			alert(res.data.message);
			localStorage.setItem('isMobileVerified', true);
			setModalVerifyVisible(false);
			setIsMobileVerified(true);
		}else {
			alert(res.data.message);
			return; 
		}
		// console.log(res);	
	}


	useEffect(() => {
		let myMobileNo = user_data.mobile;
		setMyMobileNo(myMobileNo);

		let unmounted = false;
		setTimeout(()=>document.title = 'Setting', 100);
		dispatch({type: 'account/clearAction'});
		setUserId(localStorage.getItem('userId'))
		getDetail(localStorage.getItem('userId'))
		return () => {
			unmounted = true;
		}
    },[dispatch])

	const getDetail=(id)=> dispatch({ type: 'account/getDetail',  payload: { _id:id, profile_id: id },});
	
	useEffect(() => {

		let unmounted = false;
		console.log(props)
		let detail = props.account.detail;	
		if(!unmounted && detail.count > dcount && detail.status){
			setDcount(detail.count);
			let profile_data = props.account.detail ? props.account.detail.profile : {};
			let userLoginData = props.account.detail ? props.account.detail.userLogin : {};
			setDetailData(userLoginData);
			setAvatar(userLoginData.avatar);
		
			form.setFieldsValue({
				['gender']: profile_data.gender,  ['name']: profile_data.name, ['email']: userLoginData.email, 
				['phone']: userLoginData.mobile_number,  
				// ['photo']: userLoginData.mobile_number, 
				['postal']: profile_data.postal, 
				['state']: profile_data.state, 
				['city']: profile_data.city, 
				['add1']: profile_data.add1, 
				['add2']: profile_data.add2, 
				['dob']: profile_data.dob && moment(new Date(profile_data.dob) || null, dateFormat)
			});
		}
		
		let edit = props.account.edit;		
		if(!unmounted && edit.count > count && edit.status){
			setCount(edit.count);
			getDetail(userId);
		}else if(!unmounted && edit.count > count && !edit.status){
			setCount(edit.count);
		}
		
		return () => {
			unmounted = true;
		}
    },[props.account])
	
	
	const verifyFormFun = val =>{
		getDetail(userId);
	}

	

	const onFinish = val =>{
		console.log('onFinish',val);

		let date = val.dob



		let values = {
			"name": val.name ,
			"email": val.email,
			"phone": val.phone,
			"gender": val.gender,
			"dob" : date, 
			"add1" : val.add1, 
			"add2" : val.add2, 
			"postal" : val.postal, 
			"state" : val.state, 
			"city" : val.city, 
		}

		const formData = convertToFormData(values);
		console.log("formData" , formData)
		dispatch({ type: 'account/editItem',  payload: formData , history : props});
	}
	
	const handlePostal = async (e) =>{
		let value = e.target.value;

		

		if(value.length === 6) {
			
			const res = await axios.get(`https://api.postalpincode.in/pincode/${value}`)


			if(res.data[0].PostOffice != null && res.data[0].PostOffice != undefined && res.data[0].PostOffice != "") {

				let pincode_data = res.data[0].PostOffice[0];
				form.setFieldsValue({
					city:pincode_data.District,
					state: pincode_data.State,
				});
			}
		}
	  }


  return (
	<div>
		<Apploader show={props.loading.global}/>
		<Card style={{ width: '100%' }} title="Account" bodyStyle={{padding:'20px 20px'}}>
		<Image
			width={200}
			height={200}
			src={avatar}
			fallback="data:image/png;base64,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"
			/>
			<Form name="normal_login" form={form} className="full-width-form" initialValues={{ remember: true, }} onFinish={onFinish} layout={'vertical'}>
				<Row gutter={16}>
				
					<Col  xs={24} sm={24} md={12}>
						<Form.Item name="name" label="Name" rules={[ { required: true, message: 'Please input your Name!', }, ]} >
						<Input placeholder="Name" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="email" label="Email" rules={[ { required: true, message: 'Field required!', }, ]} >
						<Input placeholder="Email" disabled/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						

							<Form.Item label="PHONE">
								<Row gutter={12}>
									<Col xs={16} span={12}>
										<Form.Item name="phone" rules={[{ required: true, message: 'Field required!', },]}  >
											<Input disabled placeholder="Phone"  />
										</Form.Item>
									</Col>
									<Col  xs={8} span={12}>	
									{ (isMobileVerify === true) ? '' :
										<Button type="primary" className="btn-w25 mobile_verify_btn" onClick={openModalForVerify} >Verify</Button>
									} 
									</Col>
								</Row>
							</Form.Item>

					</Col>
				
					<Col  xs={24} sm={24} md={12}>
						<Form.Item name="thumbnail" 
						label={<><span> Profile Image </span> </>} 

						>
							{imagesList.length >0 && imagesList.map((item, index) => 
								item.urls ? <Avatar key={index} shape="square" size={150} src={item.urls } style={{margin:5}} /> :
								<Avatar key={index} shape="square" size={150} src={process.env.REACT_APP_ApiUrl+'/'+ item.url} style={{ margin: 5 }} />
							)}
						
							{imagesList.length > 0 ? <span><br /><Button onClick={() => setImagesList([])}>Remove</Button>&nbsp;&nbsp;</span> : ''}
							{imagesList.length !== 5 && <Button onClick={() => setVisible(true)}> Upload Image </Button>}
						</Form.Item>
					</Col>
			

					
					{/* <Col xs={24} sm={24} md={12}>
						<Form.Item name="dob" label="DOB" rules={[ { required: true, message: 'Field required!', }, ]} >
							<DatePicker format="YYYY-MM-DD"/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="gender" label="Gender"  rules={[ { required: true, message: 'Please select Gender!', }, ]}>
							<Radio.Group>
							  <Radio value="Male">Male</Radio>
							  <Radio value="Female">Female</Radio>
							  <Radio value="Other">Other</Radio>
							</Radio.Group>
						</Form.Item>
					</Col> */}


					

				</Row>
{/* 
				<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="add1" label="Address 1" rules={[ { required: true, message: 'Field required!', }, ]} >
						<Input placeholder="Address 1" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="add2" label="Address 2" rules={[ { required: true, message: 'Field required!', }, ]} >
						<Input placeholder="Address 2" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="postal" label="Postal" onChange={(e) => { handlePostal(e) }} rules={[ { required: true, message: 'Field required!', },{max : 6 , message: 'Postal Code must be 6 digits'} ]} >
						<Input placeholder="Postal" type="number" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="state" label="State" rules={[ { required: true, message: 'Field required!', }, ]} >
						<Input placeholder="State" />
						</Form.Item>
					</Col>

					<Col xs={24} sm={24} md={12}>
						<Form.Item name="city" label="City" rules={[ { required: true, message: 'Field required!', }, ]} >
						<Input placeholder="City" />
						</Form.Item>
					</Col>

				</Row> */}
				
				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button">Submit</Button>
					
				</Form.Item>
				</Form>
			
        </Card>





{/* 
		<Card style={{ width: '100%' }} title="Address" bodyStyle={{padding:'20px 20px'}}>
			<Form name="normal_login" form={form} className="full-width-form" initialValues={{ remember: true, }} onFinish={onFinish} layout={'vertical'}>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="name" label="Name" rules={[ { required: true, message: 'Please input your Name!', }, ]} >
						<Input placeholder="Name" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="email" label="Email" rules={[ { required: true, message: 'Field required!', }, ]} >
						<Input placeholder="Email" disabled/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
					
					</Col>

					
				
				</Row>
				
				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button">Submit</Button>
					
				</Form.Item>
				</Form>
			
        </Card> */}




		<Modal
			width={400}
			visible={modalVerifyVisible}
			title='Verify Your Mobile'
			footer={null}
			onCancel={handleCancel} >
				
				<div style={{ textAlign:'center',marginBottom: '1rem'}}>
              		A OTP ( One Time Password ) has been sent to <b>{ myMobileNo }</b> . Please enter the OTP in the field below to verify. 
				</div>
				<Form className="login-form" >
					<Form.Item name="otp" rules={[ { required: true, message: 'Please input your Otp!', }, ]} >
						<Input prefix={<UserOutlined className="site-form-item-icon" />} onChange={(e) => changeMobileOTP(e)} placeholder="OTP Enter Here!" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" className="login-form-button" onClick={() => addMobileVerify()}> Verify </Button>
					</Form.Item>
				</Form>
		</Modal>

		{
			visible && 
			<UploadImages visible={visible} closeFun={() => setVisible(false)} 
			returnImg={
				val => 
				{ 
					setImagesList(val);
				}} 
				resetVal={imagesList} limit={5 - imagesList.length}  aspect={9/12}
			 />}
	</div>
  );
};

export default connect(({account, loading}) => ({
	account, loading
}))(Account);