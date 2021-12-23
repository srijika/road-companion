import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'dva';

import { Alert, Form, Input, Button, Typography, Popover, Tooltip, Select, Upload, message, Avatar, Card } from 'antd';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images'
import styles from './style.less'
const { Text } = Typography;

const formItemLayout = {
  labelCol: {xs: { span: 24, },  sm: {  span: 8, },},
  wrapperCol: { xs: { span: 24,}, sm: { span: 16,}, },
};
const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0, },  sm: { span: 16, offset: 8,},},
};

const VerifySellerForm = props => {
  const [form] = Form.useForm();
  const [imagesList, setImagesList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [detail, setDetail] = useState({});
  const [count, setCount] = useState(0);
  const [ccount, setCcount] = useState(0);
  const [fieldType, setFieldType] = useState(false);
  const [btnDis, setBtnDis] = useState(false);
  const [visible, setVisible] = useState(false);
  const btnFocus = useRef();
  const { dispatch } = props;

	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);		
		if(props.match.params.id)
		{
			DetailFun()
		}else {
			form.resetFields();
			setImagesList([])
		}
		return () => { unmounted = true; }
    },[dispatch])
	
	useEffect(() => {
		let unmounted = false;
		let getBus = props.setting.getBuss;		
		if(!unmounted && props.match.params.id && getBus && getBus.status && getBus.data){
			//setVerifyForm(getBus)
			setItemList(getBus.data)
			let index = getBus.data.findIndex(item=> item._id === props.match.params.id)
			let data = getBus.data[index];
			setDetail(data);
			setImagesList(data.images);
			form.setFieldsValue({
			  ['acNumber']: data.acNumber, ['address']: data.address, ['bemail']: data.bemail, ['branch']: data.branch, gstno:data.gstno, ['idno']: data.idno, ['ifsc']: data.ifsc, ['images']: data.images, ['panNumber']: data.panNumber, ['phone']: data.phone, ['storeName']: data.storeName, ['typeSeller']: data.typeSeller
			});
		}else if(!unmounted && getBus && !getBus.status){
			setItemList([])
			form.resetFields();
		}
		
		return () => {
			unmounted = true;
		}
    },[props.match.params.id])
	
	const DetailFun=()=>{		
		// dispatch({ type: 'setting/getData', payload: {_id:props.match.params.id},});
	}
	
	const skipFun=(e)=>{		
		
	}
	
  const onFinish = values => {
	console.log(values, imagesList)
	values.images = imagesList;
	if(imagesList.length === 0){
		return message.error("GOVT ID's required!");
	}
	
	if(props.match.params.id){
		values._id = props.match.params.id;
		dispatch({ type: 'setting/updateItem', payload: values,});
	}
	else{
		dispatch({ type: 'setting/createVerify', payload: values,});
	}
	
  }

  

  useEffect(() => {
	let unmounted = false;
    //fieldFocus.current.focus();
	/*if(!unmounted &&  props.userLogin.login.count > 0){
		//dispatch({ type: 'setting/clearLogin'});
	}*/
	return () => {
	  unmounted = true;
    }
  },[dispatch])
  
  useEffect(() => {
		let unmounted = false;
		let create = props.setting.create
		if(!unmounted && create.count > count && create.status){
		  setCount(create.count);
		  setBtnDis(false);
		  props.history.push('/setting')
		}else if(!unmounted && create.count > count && !create.status){
		  setBtnDis(false);
		  setCount(create.count);
		}
		
		
		let update = props.setting.update;		
		if(!unmounted && update && create.count > ccount && update.status){
			setCcount(create.count);
			setBtnDis(false);
			props.history.push('/setting') 
		}else if(!unmounted && create && !create.status){
			setCcount(create.count);
		}
		
		return () => {unmounted = true;	}
    },[props.setting])
  
	const updateImageData= val=>{
		setImagesList(val); 
		form.setFieldsValue({images:[]});
	}
	
	const cancelFun= val=>{
		form.resetFields();
		setImagesList([]);
		props.history.push('/setting') 
	}

  return (<Fragment>
 
		<Card style={{ width: '100%' }} title={<span><LeftOutlined onClick={()=> props.history.push('/setting')}/> Business Verification Form</span>} bodyStyle={{padding:'0 20px 20px'}}>
    <Form {...formItemLayout} form={form} name="verifyForm" onFinish={onFinish} style={{maxWidth: 930, margin:'0 auto !important'}}>
		<Form.Item name="storeName" label="STORE NAME" rules={[{ required: true, message: 'Field required!' },]}  >        
			<Input placeholder="Store Name" />
		</Form.Item>
		
		<Form.Item name="bemail" label="EMAIL" rules={[{ type: 'email', message: 'The input is not valid E-mail!',},{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Email" />
		</Form.Item>
		
		<Form.Item name="phone" label="PHONE" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Phone" />
		</Form.Item>
		
		<Form.Item name="address" label="BUSINESS ADDRESS" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Business Address" />
		</Form.Item>
		
		<Form.Item name="panNumber" label="PAN NUMBER" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Pan Number" />
		</Form.Item>
		<Form.Item name="gstno" label="GST NUMBER" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="GST Number" />
		</Form.Item>
		<Form.Item name="idno" label="GOVT ID" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Select placeholder="Govt Id Type">
				<Select.Option value="Aadhar Card">Aadhar Card</Select.Option>
				<Select.Option value="Voter ID">Voter ID</Select.Option>
				<Select.Option value="Driving Licence">Driving Licence</Select.Option>
			</Select>
		</Form.Item>

		<Form.Item name="typeSeller" label="Type of Seller" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Select placeholder="Type of Seller">
				<Select.Option value="Vendor or 3rd party vendor">Vendor or 3rd party vendor</Select.Option>
				<Select.Option value="Seller">Seller</Select.Option>
				<Select.Option value="Manufacturer">Manufacturer</Select.Option>
				<Select.Option value="Brand owner">Brand owner</Select.Option>
			</Select>
		</Form.Item>
		
		
		<Form.Item name="acNumber" label="BANK ACCOUNT NUMBER" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Bank Account Number" />
		</Form.Item>
		<Form.Item name="ifsc" label="IFSC CODE" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="IFSC Code" />
		</Form.Item>
		<Form.Item name="branch" label="BANK BRANCH NAME" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Bank Branch Name" />
		</Form.Item>
		<Form.Item name="images" label={<span><span style={{color:'#ff4d4f'}}>* </span>GOVT ID's</span>} rules={[{ required: false, message: 'Field required!', }, ]}  >
			{imagesList.map((item,index)=> <Avatar key={index} shape="square" size={150} src={item.view || item} style={{margin:5}} />)}
			{imagesList.length>0?<br/>:''}
			<Button onClick={()=>setVisible(true)}> Upload Images </Button>
		</Form.Item>		
      <Form.Item {...tailFormItemLayout}>
		<Button onClick={cancelFun}>Cancel</Button>&nbsp;
        <Button type="primary" htmlType="submit" className="btn-w25" ref={btnFocus} >
          {props.buttonText ? props.buttonText : "Save"}
        </Button>
      </Form.Item>
    </Form>
	
	<UploadImages visible={visible} closeFun={()=>setVisible(false)} returnImg={val=> updateImageData(val)} resetVal={imagesList} aspect={9/12}/>
	</Card>
    </Fragment>
  );
};

export default connect(({setting, loading }) => ({
setting, loading
}))(VerifySellerForm);
