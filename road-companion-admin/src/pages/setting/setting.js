import React, {useState, Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Row, Col, Form, Input, Button, Checkbox, Card, Tabs, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ChangePassword from './../../components/sharing/change-password';
import VerifySellerForm from './verify-seller-form';
//import styles from './login.less';

const { TabPane } = Tabs;

const Setting = props => {
	const [count, setCount] = useState(0)
	const [key, setKey] = useState('tab1')
	const [verifyForm, setVerifyForm] = useState({})
	const [itemList, setItemList] = useState([])
	const role = localStorage.getItem('role')
	const userId = localStorage.getItem('userId')

	
	const { dispatch } = props;
	
	useEffect(() => {
		let unmounted = false;
		if(role === "SELLER"){getDetail()}
		setTimeout(()=>document.title = 'Setting', 100);
		dispatch({type: 'setting/clearAction'})
		return () => {
			unmounted = true;
		}
    },[dispatch])
	
	useEffect(() => {
		let unmounted = false; 
		console.log(role)
		return () => {unmounted = true;}
    },[])
	
	// const getDetail=()=> dispatch({ type: 'setting/getData' , });
	const getDetail=()=> dispatch({ type: 'account/getDetail',  payload: { _id:userId, profile_id: userId },});

	
	useEffect(() => {
		let unmounted = false;
		let getBus = props.setting.getBuss;		
		if(!unmounted && getBus && getBus.status && getBus.data){
			setVerifyForm(getBus)
			setItemList(getBus.data)
		}else if(!unmounted && getBus && !getBus.status){
			setVerifyForm({})
		}
		
		return () => {
			unmounted = true;
		}
    },[props.setting.getBuss])
	
	const onTabChange=(key)=> { setKey(key);}
	
	const verifyFormFun = val =>{
		getDetail();
	}
	const changePass = val =>{
		console.log('setting',val);
		dispatch({ type: 'setting/changePassword', payload: val})
	}

	useEffect(() => {
		let unmounted = false;
		let resetp = props.setting.resetp
		if(!unmounted && resetp.count > count && resetp.status){
			setCount(resetp.count);
			// message.success('Password Changed successfully!');
			props.history.push('/');

			// dispatch({ type: 'auth/logoutApp'})
		}
		
		
		return () => {	unmounted = true;}
    },[props.setting.resetp])
	

  return (
	<div>
		<Apploader show={props.loading.global}/>
		<Card style={{ width: '100%' }} title="SETTING" bodyStyle={{padding:'0 20px 20px'}}>
          <Tabs defaultActiveKey="1" onChange={onTabChange}>
			<TabPane tab="Change Password" key="1">
			  <ChangePassword {...props} successCall={(val)=>changePass(val)} cancelBtn={true} skip={()=>console.log('skip')}/>
			  </TabPane>
			  {/* {role === "SELLER" && 
			<TabPane tab="Business Verification" key="2">
				{verifyForm.isCreated > 0 ? <div style={{textAlign:'right', width:'100%'}}><Button type="primary" className="btn-w25 btn-primary-light" onClick={()=>props.history.push('/setting/business-verify')}>Add Business</Button></div>:''}
				
				{verifyForm.isCreated === 1 ? itemList.map((item,index)=><Row key={index}>
					<Col sm={24} md={12}>
						<address>
							<strong>{item.storeName}</strong><br/>
							{item.address}<br/>
							<abbr title="Phone">Phone:</abbr> {item.panNumber}<br/>
							<a href={"mailto:"+item.bemail}>{item.bemail}</a>
						  </address>
					</Col>
					<Col sm={24} md={12}>
						<address>
						<strong>Account Detail</strong><br/>
						<abbr title="Account">AC:</abbr> {item.acNumber}<br/>
						<abbr title="Branch">B:</abbr> {item.branch}<br/>
						<abbr title="IFSC">IFSC:</abbr> {item.ifsc}<br/>
					  </address>
					</Col>
					<Col sm={24} md={24}>
					<Row>
						<Col sm={24} md={12}>
							<address>
								<abbr>Account Verified by Admin:</abbr> <strong>{item.loginid.isBussinessVerified?'Yes':'No'}</strong>
							</address>
						</Col>
						<Col sm={24} md={12}>
							<Button onClick={()=> props.history.push('/setting/business-verify/'+ item._id)}>Edit Business</Button>
						</Col>
					</Row>
						  <Divider />
					</Col>
				</Row>): 
					<div style={{textAlign:'center'}}>
						<p>Add your business detail for active you products</p>
						<Button type="primary" className="btn-w25 btn-primary-light" onClick={()=>props.history.push('/setting/business-verify')}>Add Business</Button>
					</div>
				}
				
			</TabPane>
			  } */}
			{/*<TabPane tab="Payments" key="3">
			  Content of Tab Pane 3
			</TabPane>*/}
		  </Tabs>
        </Card>
	</div>
  );
};

export default connect(({setting, auth, loading}) => ({
	setting, auth, loading
}))(Setting);