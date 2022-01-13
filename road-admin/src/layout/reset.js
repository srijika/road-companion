import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import ForgotForm from './../components/forgot/forgot';
import Apploader from './../components/loader/loader'
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Divider, Checkbox, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styles from './login.less';


const AppReset = (props) => {
	const [showPassword, setShowPassword] = useState(false);
	const  handelPassword = () => {
		setShowPassword(!showPassword);
		
	}
    const onFinish = values => {		
        const email = localStorage.getItem('user_email');
        let val = {};
        if(validateEmail(email)){ 
            val = { username: email, password: values.password, otpchk: values.otp };
			props.dispatch({ type: 'auth/resetPassword', payload: val });
        }
	  };

    const validateEmail = (email) =>{
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
  }

	useEffect(() => {
		let unmounted = false;
		let resetPassword = props.auth.resetPassword;
		if(!unmounted && resetPassword && resetPassword.status){
			
			props.dispatch({ type: 'auth/resetPasswordSuccessDone' });
			props.history.push('/login');
		}
		return () => {
			unmounted = true;
		}
	},[props])


		return (
			<div>
				<Apploader show={props.loading.global} />
				<Row type="flex" className={"basicpage"} justify="space-around" align="middle" style={{ minHeight: '100vh' }}>
					<Col className="basicbox">
						<div className="mainimg"></div>
						<div className="mainform">
							<div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '600' }}>
								Reset Password
								</div>
							<Divider />


							<Form name="otp" className="login-form" initialValues={{ remember: true, }} onFinish={onFinish} >
							<Form.Item name="password" rules={[ 
									{ 	
										required: true, 
										message: 'Please input your Password!', 
									},
									{
										pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
										message: 'Minimum eight characters, at least one letter, one number and one special character:'
									}
								]} >
								<Input prefix={<LockOutlined className="site-form-item-icon" />} 
								type={showPassword ? 'text': 'password'}
								placeholder="New Password" 
								suffix = {showPassword ? <EyeTwoTone onClick={ handelPassword } /> : <EyeInvisibleOutlined onClick={ handelPassword } /> }
								/>
							</Form.Item>
								<Form.Item name="otp" rules={[{ required: true, message: 'Please input your Otp!', },]} >
									<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="OTP Enter Here!" />
								</Form.Item>
								<Form.Item style={{ textAlign: 'center' }}>
									<Button type="primary"  htmlType="submit" className="login-form-button"> Save </Button>
								</Form.Item>
							</Form>
						
								<div className="row">
									 <Link   style={{ color: "#3e1c08"  }} to={"/login"}>Back</Link>
								</div>
						
						</div>
					</Col>
				</Row>
			</div>

		);
	
}

export default connect(({ auth, loading }) => ({
	auth, loading
}))(AppReset);