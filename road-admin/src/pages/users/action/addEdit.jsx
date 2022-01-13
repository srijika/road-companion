import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Row, Col, Empty, Modal, Card, Typography, Alert,Form,Input, Checkbox,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, Descriptions } from 'antd';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined} from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images'
import CropImage from '../../../components/sharing/crop-image'
import TextEditor from '../../../components/sharing/text-editor'
import moment from 'moment';
import { connect } from 'dva';
import styles from './style.less';

const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};
const dateFormat = 'YYYY/MM/DD';

const AddEditUser =props => {
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
	
	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
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
		props.dispatch({type: 'users/getDetail', payload: { _id: id, profile_id: id }});
	}
	
	const onFinish= val=>{
		console.log(props, val)
	}
	
	useEffect(() => {
		let unmounted = false;
		// Edit
		let edit = props.users.edit
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
			
			let detail = props.users.detail;
			console.log("detail : ", detail);
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
				form.setFieldsValue({
				  ['dob']: moment(new Date(data.dob), 'YYYY/MM/DD'),  ['email']: data.email, ['gender']: data.gender, ['name']: data.name, ['phone']: data.phone, ['photo']: data.photo
				});
				setImageUrl(data.photo);
			}else if(!unmounted && detail && !detail.status){
			  setBtnDis(false);
			  setDCount(detail.count);
			}
		}
		return () => {unmounted = true;	}
    },[props.users])
	
	const cancelFun = ()=>{
		form.resetFields();
		setImageUrl('');
		props.history.push('/users');
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

	<Card title={<span><LeftOutlined onClick={()=> props.history.push('/users')}/> User Details</span>} style={{marginTop:"0"}}>
		<Descriptions size={'middle'} bordered>
          <Descriptions.Item label="Name">{detail.username}</Descriptions.Item>
		  <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
		  <Descriptions.Item label="Is Email Verified">{detail.isEmailVerified ? 'true' : 'false'}</Descriptions.Item>
		  <Descriptions.Item label="Phone">{detail.mobile_number}</Descriptions.Item>
		  <Descriptions.Item label="Is Mobile Verified">{detail.isMobileVerified ? 'true' : 'false'}</Descriptions.Item>
		  <Descriptions.Item label="Role">{detail.roles}</Descriptions.Item>
          <Descriptions.Item label="Profile Created On">{moment(detail.create).format(dateFormat)}</Descriptions.Item>
        </Descriptions>
		<CropImage visible={picModel} closeFun={()=>setPicModel(false)} returnImg={getNewImage} resetVal={imageUrl} limit={1} aspect={9/12}/>
	</Card>
)};

export default connect(({ users, global, loading }) => ({
  users:users,
  global: global
}))(AddEditUser);