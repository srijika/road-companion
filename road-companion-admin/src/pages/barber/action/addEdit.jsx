import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Row, Col, Empty, Modal, Card, Typography, Alert,Form,Input, Checkbox,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, Descriptions } from 'antd';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined} from '@ant-design/icons';
import CropImage from '../../../components/sharing/crop-image'
import moment from 'moment';
import { connect } from 'dva';



const dateFormat = 'YYYY/MM/DD';

const AddEditBarber =props => {
	const [form] = Form.useForm();
	const { dispatch, category } = props;
	const [visible, setVisible] = useState(false);
	const [detail, setDetail] = useState({});
	const [itemId, setItemId] = useState()
	const [imageUrl, setImageUrl] = useState('');
	const [picModel, setPicModel] = useState(false);
	const [loading, setLoading] = useState(false);
	const [InquiryData, setInquiryData] = useState(''); 
	const [Inquiry, setInquiry] = useState('');
	const [count, setCount] = useState(0)
	const [ecount, setECount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	
	
	const [verifyForm, setVerifyForm] = useState({})
	const [itemList, setItemList] = useState([])
	
	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		console.log(props)
		if(props.match && props.match.params.id)
		{
			setItemId(props.match.params.id)
			DetailFun(props.match.params.id)
		}else {
			form.resetFields();
			setImageUrl('');
		}
		return () => { unmounted = true; }
    },[dispatch])
	
	
	const DetailFun=(id)=>{
		dispatch({type: 'seller/getDetail', payload: { _id:id, profile_id: id }});
		// dispatch({ type: 'setting/getData'})
	}
	
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
	
	const onFinish= val=>{
		console.log(props, val)

		// if(!val.images || val.images.length === 0){
		// 	return message.error('View thumbnail Images required!');
		// }
		setBtnDis(true);
		if(props.match &&  props.match.params.id){
			val._id = props.match.params.id;
			dispatch({type: 'seller/editItem',  payload: val,});
		}
		/*else{
			//dispatch({type: 'seller/addItem',  payload: val,});
		}*/	
	}
	
	useEffect(() => {
		let unmounted = false;

		// Edit
		let edit = props.seller.edit
		if(!unmounted && edit.count > ecount && edit.status){
		  setECount(edit.count);
		  setBtnDis(false);
		  setImageUrl('');
		  cancelFun();
		}else if(!unmounted && edit.count > ecount && !edit.status){
		  setBtnDis(false);
		  setECount(edit.count);
		}
		
		
		// detail
		
		if(props.match && props.match.params.id)
		{
			let detail = props.seller.detail
			if(!unmounted &&  detail && detail.status){
			  setDCount(detail.count);
			  let data = detail.profile;
				setDetail({
					...data,
					username: data.username,
					email: data.email,
					mobile_number: data.mobile_number,
					isEmailVerified: data.isEmailVerified,
					isMobileVerified: data.isMobileVerified,
					roles: data.roles,
				})
			  data && form.setFieldsValue({
				  ['dob']: data.dob && moment(new Date(data.dob) || null, dateFormat), ['fssai']: data.fssai && data.fssai == true ? 'Yes' : 'No' || 'No' , ['gstin']: data.gstin && data.gstin == true ? 'Yes' : 'No' || 'No',  ['email']: data.email, ['gender']: data.gender, ['name']: data.name, ['phone']: data.phone, ['photo']: data.photo
				});
			data &&	setImageUrl(data.photo);
			}else if(!unmounted && detail && !detail.status){
			  setBtnDis(false);
			  setDCount(detail.count);
			}
		}
		return () => {unmounted = true;	}
    },[props.seller])
	
	const cancelFun = ()=>{
		form.resetFields();
		setImageUrl('');
		props.history.push('/barber');
	}
	const getNewImage = val =>{
		setPicModel(false);
		setImageUrl(val[0])
		form.setFieldsValue({images:val})
	}
	const removeImgFun=()=>{
		setImageUrl('');
		form.setFieldsValue({images:[]});
	}
	const uploadButton = (
      <div>
		{loading ? <LoadingOutlined /> : <i className="fad fa-camera-retro" style={{color:"#13c2c2", fontSize: 57}} />}
      </div>
    );
	
return (
	<Card title={<span><LeftOutlined onClick={()=> props.history.push('/seller')}/> Barber Info</span>} style={{marginTop:"0"}}>
	
		 <Descriptions size={'middle'} bordered>
          <Descriptions.Item label="Baber Name">{detail && detail.username || ''}</Descriptions.Item>
		  <Descriptions.Item label="Email">{detail && detail.email || ''}</Descriptions.Item>
		  <Descriptions.Item label="Is Email Verified">{detail.isEmailVerified ? 'true' : 'false'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{detail && detail.mobile_number || ''}</Descriptions.Item>
          <Descriptions.Item label="Is Mobile Verified">{detail.isMobileVerified ? 'true' : 'false'}</Descriptions.Item>
		  <Descriptions.Item label="Profile Created On">{detail && moment(detail.create).format(dateFormat) || ''}</Descriptions.Item>
		
        </Descriptions>
	
		 {itemList.map((item,index)=> <Descriptions size={'middle'} key={index} bordered>
          <Descriptions.Item label="Store Name">{item.storeName}</Descriptions.Item>
          <Descriptions.Item label="Address">{item.address}</Descriptions.Item>
		  <Descriptions.Item label="Pan Number">{item.panNumber}</Descriptions.Item>
          <Descriptions.Item label="Business Email">{item.bemail}</Descriptions.Item>
        </Descriptions>)}
		
		
		
		
		{/*<UploadImages visible={visible} closeFun={()=>setVisible(false)} returnImg={val=>{ let data = imagesList; val.map(item=> data.push(item)); setImagesList(data) }} resetVal={imagesList} limit={5 - imagesList.length}/>*/}
		
		<CropImage visible={picModel} closeFun={()=>setPicModel(false)} returnImg={getNewImage} resetVal={imageUrl} limit={1} aspect={1/1}/>
		
	</Card>
)};

export default connect(({ setting,seller, global, loading }) => ({
  setting:setting,
  seller:seller,
  global: global
}))(AddEditBarber);