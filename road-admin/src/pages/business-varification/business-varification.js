import React, {useState, Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Row, Col,Alert, Form, Input, Button, Checkbox, Card, Tabs, Divider, message, Descriptions } from 'antd';
//import styles from './login.less';

const { TabPane } = Tabs;

const BusinessVarification = props => {
	const [count, setCount] = useState(0)
	const [key, setKey] = useState('tab1')
	const [verifyForm, setVerifyForm] = useState({})
	console.log();
	const [itemList, setItemList] = useState([])
	const role = localStorage.getItem('role')
	const { dispatch } = props;
	
	useEffect(() => {
		let unmounted = false;
		if(role === "SELLER"){
			getDetail()
		}
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
	
	const getDetail=()=> dispatch({ type: 'setting/getData'}); 
	
	useEffect(() => {
		let unmounted = false;
		let getBus = props.setting.getBuss;		
		if(!unmounted && getBus && getBus.status && getBus.data){

			

			setVerifyForm(getBus)
			setItemList(getBus.data)

			if(getBus?.data[0]?.loginid?.isBussinessVerified) {
				console.log('getBus.data[0].loginid.isBussinessVerified');
				console.log(getBus.data[0].loginid.isBussinessVerified);

				let user_data = JSON.parse(localStorage.getItem('user'));
				user_data['isBussinessVerified'] = true;

				let set_data = JSON.stringify(user_data);
				localStorage.setItem('user', set_data)
			}

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
			// dispatch({ type: 'auth/logoutApp'})
			props.history.push('/');

		}
		
		
		return () => {	unmounted = true;}
    },[props.setting.resetp])
	

  return (
	<div>
		{ 
		  itemList[0] && itemList[0].loginid  ?
		  	itemList[0].loginid.isBussinessVerified ? 
				<Alert
					message="Account Activated"
					description={itemList[0].loginid.note ? itemList[0].loginid.note : "congratulations galinukkad team will contact you shortly!"}
					type="success"
				/>
				:
				<Alert
				message="Account Not Activated"
				description={itemList[0].loginid.note ? itemList[0].loginid.note : "Your request is received by Galinukkad verification team, our team is verifying your details and you will notified as soon as your account will be verified."}
				type="error"
				/>
			:
			''
		}
		<Apploader show={props.loading.global}/>
		<Card style={{ width: '100%' }} title="Business Verification" bodyStyle={{padding:'0 20px 20px'}}>	
				{itemList.length == 0 ? <div style={{textAlign:'right', width:'100%', marginBottom: ''}}>
					<Button type="primary" className="btn-w25 btn-primary-light" onClick={()=>props.history.push('./business-verification/verify', localStorage.setItem('GSTStatus', 'NO'))} >Add Business Without GST</Button>
				<br/>
				<Button type="primary" style={{marginTop: '1rem'}} className="btn-w25 btn-primary-light" onClick= {()=>props.history.push('./business-verification/verify', localStorage.setItem('GSTStatus', 'YES'))}>Add Business With GST</Button>
				</div>:''}
					
				{verifyForm.isCreated === 1 ? itemList.map((item,index)=><Row key={index}>
					
					<Col sm={24} md={12}>
						<address>
							<strong>{item.storeName}</strong><br/>
							{item.address}<br/>
							<abbr title="Pancard Number">Pancard Number:</abbr> {item.panNumber}<br/>
							<abbr title="Phone">Phone Number:</abbr> {item.phone}	<br/>
							{ item?.fsaai_no ? <> <abbr title="FSAAI ">FSAAI  Number:</abbr> {item?.fsaai_no}	<br/> </> : ""}
							<a href={"mailto:"+item.bemail}>{item.bemail}</a>
						  </address>
					</Col>
					<Col sm={24} md={12}>
						<address>
						<strong>Account Detail</strong><br/>
						<abbr title="Account">Account Number:</abbr> {item.acNumber}<br/>
						<abbr title="Branch">Branch:</abbr> {item.branch}<br/>
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
							<Button onClick={()=> props.history.push('./business-verification/verify/'+ item._id)}>Edit Business</Button>
						</Col>
					</Row>
						  <Divider />
					</Col>
				</Row>): 
					<div style={{textAlign:'center'}}>
						<p>Add your business detail!</p>
					</div>
				}
        </Card>
	</div>
  );
};

export default connect(({setting, auth, loading}) => ({
	setting, auth, loading
}))(BusinessVarification);