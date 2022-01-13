import React, { useEffect, useState, Fragment, useRef } from 'react';
import { connect } from 'dva';
import { Alert, Modal, Form, Input, Button, Typography, Popover, Tooltip, Select, Upload, message, Avatar, Card } from 'antd';
import { LeftOutlined, UploadOutlined ,CheckOutlined, UserOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images'
const { Text } = Typography;
const { TextArea } = Input;

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
  const [fsaai_images_List, setFsaaiImagesList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [detail, setDetail] = useState({});
  const [count, setCount] = useState(0);
  const [ccount, setCcount] = useState(0);
  const [acount, setAcount] = useState(0);
  const [fieldType, setFieldType] = useState(false);
  const [btnDis, setBtnDis] = useState(false);
  const [description, approveDescription] = useState(false)
  const [cancelModalShowError, setCancelModalShowError] = useState('')
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewImage, setModalImage] = useState();
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === "ADMIN" ? true:false);
  const [BusinessDetails, setBusinessDetails] = useState({});

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
			setFsaaiImagesList([])
		}
		
		return () => { unmounted = true; }
    },[dispatch])
	
	
	const DetailFun=()=>{
		if(isAdmin)
			dispatch({ type: 'setting/getBussinessDataById', payload: {_id:props.match.params.id},});
		else dispatch({ type: 'setting/getBussinessDataById', payload: {},});
	}
	
	useEffect(() => {
		let unmounted = false;
		let getBus = props.setting.getSingleBussines;	
		let data = getBus.data;
		if(data){
			form.setFieldsValue({
				['acNumber']: data.acNumber, ['address']: data.address, ['bemail']: data.bemail, ['branch']: data.branch, gstno:data.gstno, ['idno']: data.idno, ['ifsc']: data.ifsc, ['images']: data.images, ['panNumber']: data.panNumber, ['phone']: data.phone, ['storeName']: data.storeName, ['typeSeller']: data.typeSeller
			  });
			setImagesList(data?.images);
			setFsaaiImagesList(data.FSI? data.FSI : '');
		}
		setDetail(data);
		
		if(!unmounted && props.match.params.id && getBus && getBus.status && getBus.data){
			setItemList(getBus.data)
		}else if(!unmounted && getBus && !getBus.status){
			setItemList([])
			form.resetFields();
		}
		
		return () => {
			unmounted = true;
		}
    },[props.setting.getSingleBussines])
	
	
	const skipFun=(e)=>{		
		
	}
	
  const onFinish = values => {
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
		if(!unmounted && update && update.count > ccount && update.status){
			setCcount(update.count);
			setBtnDis(false);
			props.history.push('/setting') 
		}else if(!unmounted && update && !update.status){
			setCcount(update.count);
		}
		
		let approve = props.setting.approve;
		if (!unmounted && approve && approve.status && approve.count > acount) {
            setAcount(approve.count); setBtnDis(false);
			dispatch({type: 'setting/approveReset'});
			props.history.push('/approve') 
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
		setFsaaiImagesList([]);
		if(isAdmin)
			props.history.push('/approve') 
		else props.history.push('/setting') 
	}
	
	const RejectItem=(data)=>{
		setBusinessDetails({selectedUsers:data, isBussinessVerified:false, modelVisible:true})
	} 
	const approvedItem=(user_id)=>{
		let data = {
			user_id: user_id,
			isBussinessVerified: true,
			note: "congratulations Choovoo Barber  team will contact you shortly"
		}
		dispatch({type: 'setting/approveBuss', payload: data});
		setBusinessDetails({RejectionMessage:'',selectedUsers:0, isBussinessVerified:false, modelVisible:false})
	} 

	const addDesc = (val) => {
		if (val) { this.ListFun() }
		this.setState({ description: '', approveDescription: false })
	}

	const GetNoteForRejection = (event) => {
		let data = BusinessDetails;
		data['RejectionMessage'] = event.target.value;
		setBusinessDetails(data);
	}

	const handleModelOk = () => {
		if(!BusinessDetails.RejectionMessage || BusinessDetails.RejectionMessage.length == 0) {
			let data = BusinessDetails;
			data['RejectionMessage'] = 'Your request is not approved as we could not verify this details. Please reach out to our team or share the time convenient to you. We will get in touch';
			setBusinessDetails(data)
        }

		let data = {
			user_id: BusinessDetails.selectedUsers,
			isBussinessVerified: BusinessDetails.isBussinessVerified,
			note: BusinessDetails.RejectionMessage
		}
		dispatch({type: 'setting/approveBuss', payload: data});
		setBusinessDetails({RejectionMessage:'',selectedUsers:0, isBussinessVerified:false, modelVisible:false})

	};

	const handleModelCancel = () => {
		setBusinessDetails({RejectionMessage:'', selectedUsers:0, isBussinessVerified:false,  modelVisible:false})
	};
	const showPreview = (image) =>{
		setModalImage(image);
		setModalVisible(true);
	}

	const handleCancel = () =>{
		setModalVisible(false);
	}

	const DownloadImages = () => {
		fetch(previewImage).then((response) => {
			response.arrayBuffer().then(function (buffer) {
			const url = window.URL.createObjectURL(new Blob([buffer]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "image.png"); 
			document.body.appendChild(link);
			link.click();
			});
		}).catch((err) => {
			console.log(err);
		});
	}

  return (<Fragment>
 
		<Card style={{ width: '100%' }} title={<span><LeftOutlined /> Business Verification Form</span>} bodyStyle={{padding:'0 20px 20px'}}>
    <Form {...formItemLayout} form={form} name="verifyForm" onFinish={onFinish} style={{maxWidth: 930, margin:'0 auto !important'}}>
		<Form.Item name="storeName" label="STORE NAME" rules={[{ required: true, message: 'Field required!' },]}  >        
			<Input placeholder="Store Name" disabled={isAdmin}/>
		</Form.Item>
		
		<Form.Item name="bemail" label="EMAIL" rules={[{ type: 'email', message: 'The input is not valid E-mail!',},{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Email" disabled={isAdmin} />
		</Form.Item>
		
		<Form.Item name="phone" label="PHONE" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Phone" disabled={isAdmin} />
		</Form.Item>
		
		<Form.Item name="address" label="BUSINESS ADDRESS" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Business Address" disabled={isAdmin} />
		</Form.Item>
		
		<Form.Item name="panNumber" label="PAN NUMBER" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Pan Number" disabled={isAdmin} />
		</Form.Item>
		<Form.Item name="gstno" label="GST NUMBER" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="GST Number" disabled={isAdmin} />
		</Form.Item>
		<Form.Item name="idno" label="GOVT ID" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Select placeholder="Govt Id Type" disabled={isAdmin}>
				<Select.Option value="Aadhar Card">Aadhar Card</Select.Option>
				<Select.Option value="Voter ID">Voter ID</Select.Option>
				<Select.Option value="Driving Licence">Driving Licence</Select.Option>
			</Select>
		</Form.Item>
		<Form.Item name="fsaino" label="FSAAI NUMBER" >        
			<Input placeholder="FSAAI Number" disabled={isAdmin} />
		</Form.Item>
		<Form.Item name="typeSeller" label="TYPE OF SELLER" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Select placeholder="Type of Seller">
				<Select.Option value="Vendor or 3rd party vendor">Vendor or 3rd party vendor</Select.Option>
				<Select.Option value="Seller">Seller</Select.Option>
				<Select.Option value="Manufacturer">Manufacturer</Select.Option>
				<Select.Option value="Brand owner">Brand owner</Select.Option>
			</Select>
		</Form.Item>		
		<Form.Item name="acNumber" label="BANK ACCOUNT NUMBER" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Bank Account Number" disabled={isAdmin}/>
		</Form.Item>
		<Form.Item name="ifsc" label="IFSC CODE" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="IFSC Code" disabled={isAdmin}/>
		</Form.Item>
		<Form.Item name="branch" label="BANK BRANCH NAME" rules={[{ required: true, message: 'Field required!', }, ]}  >        
			<Input placeholder="Bank Branch Name" disabled={isAdmin}/>
		</Form.Item>
		<Form.Item name="images" label={<span><span style={{color:'#ff4d4f'}}>* </span>GOVT ID's</span>} rules={[{ required: false, message: 'Field required!', }, ]}  >
			{imagesList.length > 0 && imagesList.map((item,index)=> 
				<Avatar key={index} shape="square" size={150} src={process.env.REACT_APP_ApiUrl+'/'+ item.file} onClick={() => showPreview(process.env.REACT_APP_ApiUrl+'/'+item.file)} style={{margin:5}} />
			)}
			<br/>
		</Form.Item>

		<Form.Item name="images" label={<span><span style={{color:'#ff4d4f'}}>* </span>FSAAI DOC </span>}  >
		{fsaai_images_List.file ? <Avatar key="FASSAI1456" shape="square" size={150} src={process.env.REACT_APP_ApiUrl+'/'+fsaai_images_List.file } onClick={() => showPreview(process.env.REACT_APP_ApiUrl+'/'+fsaai_images_List.file)} style={{margin:5}} /> : ''}
			<br/>
		</Form.Item>	
      <Form.Item {...tailFormItemLayout}>
		<Button onClick={cancelFun}>Cancel</Button> &nbsp; 
			{detail && isAdmin ? <Fragment>
				<Button type="primary" onClick={()=>approvedItem(detail.loginid?detail.loginid._id:'')} disabled={detail.loginid ?detail.loginid.isBussinessVerified:''}><CheckOutlined /> Accept</Button> &nbsp;
				<Button type="danger" onClick={()=>RejectItem(detail.loginid?detail.loginid._id:'')} disabled={detail.loginid ? !detail.loginid.isBussinessVerified : ''}><CloseOutlined /> Reject</Button>
			</Fragment>
			:''
		}
      </Form.Item>
    </Form>
	
	<UploadImages visible={visible} closeFun={()=>setVisible(false)} returnImg={val=> updateImageData(val)} resetVal={imagesList} aspect={9/12}/>
	</Card>

	<Modal
		title="Write Some Note Here!"
		visible={BusinessDetails.modelVisible}
		onOk={handleModelOk}
		onCancel={handleModelCancel} >
			<Input size="large" placeholder="Note" onChange={(e)=>GetNoteForRejection(e)} prefix={<UserOutlined />} />
			<br/>
              <span style={{color: 'red'}}>
                <small>{cancelModalShowError ? cancelModalShowError : ""}</small>
              </span>
	</Modal>
	<Modal
		  width={1000}
          visible={modalVisible}
          title={null}
          footer={null}
          onCancel={handleCancel} >
			  <DownloadOutlined style={{fontSize:'48px', cursor:'pointer'}} onClick={()=> DownloadImages() } />
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
    </Fragment>
  );
};

export default connect(({setting, loading }) => ({
setting, loading
}))(VerifySellerForm);
