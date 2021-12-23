import React, {useState, useEffect } from 'react';
// import {Redirect} from 'react-router';
// import { Link } from 'react-router-dom';
// import ForgotForm from './../components/forgot/forgot';
import Apploader from './../components/loader/loader'
import { connect } from 'dva';
import {Row, Col, Form, Input, Button,Divider, Checkbox, message , Modal,notification} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './login.less';

const FormItem = Form.Item;

const AppVarify = (props) => {
  const regEmail = localStorage.getItem('user_email');
  const regMobile = localStorage.getItem('mobile_number');

  

    useEffect(() => {
        let varify = props.auth.varify;
        if(varify){
            if(varify.status){
              props.dispatch({ type: 'auth/alrdregisterSuccess' });
              notification.success({message: "Account registerd sucessfully."});
              props.history.push('/login');
            }
        }   
    },[props.auth.varify]);

    const onFinish = values => {		
        const email = localStorage.getItem('user_email');
        let val = {};
        if(validateEmail(email)){
            val = { email: email, otp: values.otp };
        }else{
            val = { mobile_number: email, otp: values.otp };
        }

        props.dispatch({ type: 'auth/varifyOtp', payload: val });


	  };

    const validateEmail = (email) =>{
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
  }

  const resendOTP = () =>{
    const email = localStorage.getItem('user_email');
    let val = {email : email};
    props.dispatch({ type: 'auth/resendOtp', payload: val });
  }

  const backButtun = () => {
      props.dispatch({ type: 'auth/verifyBackNuttunSuccess' });
      props.history.push('/register');
  }

  return (
	<div>
		<Apploader show={props.loading.global}/>
		<Row type="flex" className={"basicpage"} justify="space-around" align="middle" style={{minHeight:'100vh'}}>
			<Col  className="basicbox">
				<div className="mainimg"></div>
				<div className="mainform">
					<div style={{ textAlign:'center',fontSize: '18px',fontWeight: '600'}}>
              Validate OTP ( One Time Password )
					</div>
          <Divider />
          <div style={{ textAlign:'center',marginBottom: '1rem'}}>
              A OTP ( One Time Password ) has been sent to your email address <b>{regEmail}</b> . Please enter the OTP in the field below to verify. 
					</div>
					<Form name="otp" className="login-form" initialValues={{ remember: true, }} onFinish={onFinish} >
                <Form.Item name="otp" rules={[ { required: true, message: 'Please input your Otp!', }, ]} >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="OTP Enter Here!" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button"> Verify </Button>
                </Form.Item>
					</Form>
          <div className="col-md-12" style={{width:'100%'}}>
              <div className="row">
                  <div className="col-md-6" style={{width:'50%', float:'left', textAlign:'left'}}> 
                    <Button type="link" className='resend_link' onClick={()=> backButtun()}>Back</Button>
                    {/* <Link to={"register"}>Back</Link> */}
                  </div>
                  <div className="col-md-6" style={{width:'50%', float:'left', textAlign:'center'}}>
                    <Button type="link" className='resend_link' onClick={()=> resendOTP()}>Resend OTP</Button>
                  </div>
              </div>
          </div>

				</div>
			</Col>
		</Row>
	</div>
  );
};

export default connect(({auth, loading}) => ({
	auth, loading
}))(AppVarify);