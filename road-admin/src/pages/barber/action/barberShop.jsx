import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Row, Col, Empty, Modal, Card, Typography, Alert,Form,Input, Checkbox,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, Descriptions } from 'antd';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined} from '@ant-design/icons';
import CropImage from '../../../components/sharing/crop-image'
import moment from 'moment';
import { connect } from 'dva';
import Apploader from './../../../components/loader/loader'




const dateFormat = 'YYYY/MM/DD';

const AddEditBarber =props => {
	const [form] = Form.useForm();
	const { dispatch, category , shop} = props;
	const [visible, setVisible] = useState(false);
	const [detail, setDetail] = useState({});
	const [shops, setShops] = useState([]);

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
	console.log("shop" ,shops)
	
	
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
		dispatch({type: 'shop/getBarberShopInfo', payload: { user_id:id }});
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

		setShops(shop.list && shop.list.getShopDetails)
		// console.log(shop.list && shop.list.getShopDetails)
		return () => {unmounted = true;	}
    },[props.seller])
	console.log(shops && shops[0]?.shop_name)

	
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
	<>

	<Apploader show={props.loading.global}/>

	<Row gutter={5} style={{marginBottom: '0.625rem'}} >
                    <Col span={14}>
                        <Card title={<span><LeftOutlined onClick={()=> props.history.push('/barber')}/> Shop Info</span>} bordered={false}>
                                <Row gutter={10}>
                                    <Col span={24} >
                                        <div>
 
                                            <label className="order-detail-bold font-weight-bold shop_details_label" >Shop Name:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">{shops && shops[0]?.shop_name}</span><br/>
                                            <label className="order-detail-bold" >Shop Status:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-dark">{shops && shops[0]?.status === false ? <span className="badge  bg-danger tag_price">False</span> : <span className="badge  bg-success tag_price">True</span>}</span><br/>
                                            <label className="order-detail-bold" >Shop Location:</label>&nbsp;&nbsp;{shops && shops[0]?.shop_location }<br/>
                                            <label className="order-detail-bold" >Is Mobile_Appointment:</label>&nbsp;&nbsp;<span className="order-detail-light">{shops && shops[0]?.is_mobile_appointment === false ? <span className="badge  bg-danger tag_price">False</span> : <span className="badge  bg-success tag_price">True</span>}</span><br/>
                                            <label className="order-detail-bold" >Is Location Access:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">	{shops && shops[0]?.is_location_access === false ? <span className="badge  bg-danger tag_price">False</span> : <span className="badge  bg-success tag_price">True</span>}   </span><br/>
                                            <label className="order-detail-bold" >lattitude:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">	{shops && shops[0]?.lattitude}   </span><br/>
                                            <label className="order-detail-bold" >longitude:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">	{shops && shops[0]?.longitude}   </span><br/>
                                            <label className="order-detail-bold" >Created Date:</label>&nbsp;&nbsp;&nbsp;<span className="order-detail-light">	{shops && shops[0] && moment(shops[0]?.created_at).format(dateFormat)}   </span><br/>



                                        </div>
                                    </Col>
                                </Row>
                        </Card>    
                    </Col>
             
                </Row>
 

				<Row gutter={5} style={{marginBottom: '0.625rem'}} >
                  
                    <Col span={10}>
                        <Card title="Shop Services" bordered={false} >
				
                          
							{shops && shops[0]?.servicePrice && shops[0].servicePrice.map((val, i) => {
								return <>
								 <b key={i}> {val.tag_name} : <span className="badge  bg-secondary tag_price">{val.tag_price}</span> </b> <br /> </>
							})}
                       {shops && shops[0]?.servicePrice.length === 0 ? "No Service Found" : ""}
                  
                        </Card>
                    </Col>
                </Row>















	</>
)};

export default connect(({ setting,seller, global, loading , shop}) => ({
  setting:setting,
  seller:seller,
  global: global ,
  loading : loading ,
  shop: shop
}))(AddEditBarber);