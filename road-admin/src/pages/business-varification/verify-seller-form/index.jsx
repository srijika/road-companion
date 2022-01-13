import React, { useEffect, useState, Fragment, useRef } from 'react';
// import ReactDOM from "react-dom";
// import { Link } from 'react-router-dom';
import { connect } from 'dva';
import { Alert, Form, Input, Row, Col, Button, Select, message, Avatar, Badge, Card, Modal } from 'antd';
import { LeftOutlined, UserOutlined, CheckOutlined, DownloadOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images';
import UploadImages1 from '../../../components/sharing/upload-images1';
import okIcon from '../../../../src/images/ok.png';


const formItemLayout = {
	labelCol: { xs: { span: 24, }, sm: { span: 8, }, },
	wrapperCol: { xs: { span: 24, }, sm: { span: 16, }, },
};
const tailFormItemLayout = {
	wrapperCol: { xs: { span: 24, offset: 0, }, sm: { span: 16, offset: 8, }, },
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
	const [visible, setVisible] = useState(false);
	const [fvisible, setfVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [isMobileVerify, setIsMobileVerify] = useState(false);

	const [myMobileNo, setMyMobileNo] = useState('');
	const [myMobileNoOTP, setMyMobileNoOTP] = useState('');
	const [modalVerifyVisible, setModalVerifyVisible] = useState(false);

	const [previewImage, setModalImage] = useState();
	const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === "ADMIN" ? true : false);
	const btnFocus = useRef();
	const { dispatch } = props;

	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		if (props.match.params.id) {
			DetailFun()
		} else {
			form.resetFields();
			setImagesList([])
			setFsaaiImagesList([])
		}
		return () => { unmounted = true; }
	}, [dispatch])

	const GSTStatus = localStorage.getItem('GSTStatus');

	const DetailFun = () => {
		if (isAdmin)
			dispatch({ type: 'setting/getData', payload: { _id: props.match.params.id }, });
		else dispatch({ type: 'setting/getData', payload: {}, });
	}

	useEffect(() => {
		let unmounted = false;

		let getBus = props.setting.getBuss;
		if (!unmounted && props.match.params.id && getBus && getBus.status && getBus.data) {
			setItemList(getBus.data)
			let index = getBus.data.findIndex(item => {
				if (isAdmin)
					return item.loginid.id === props.match.params.id
				else
					return item._id === props.match.params.id
			})
			let data = getBus.data[index];

			setDetail(data);
			setImagesList(data?.images);
			setFsaaiImagesList(data.FSI ? data.FSI : '');

			setIsMobileVerify(true);
			setMyMobileNo(data.phone);
			
			let flag = localStorage.getItem('isMobileVerified') == 'true' ? true : false;
			setIsMobileVerify(flag);

			form.setFieldsValue({
				['acNumber']: data.acNumber, ['address']: data.address, ['bemail']: data.bemail, ['branch']: data.branch, gstno: data.gstno, ['idno']: data.idno, ['ifsc']: data.ifsc, ['images']: data.images, ['panNumber']: data.panNumber, ['phone']: data.phone, ['storeName']: data.storeName, ['typeSeller']: data.typeSeller, ['fsaai_no']: data.fsaai_no, ['FSI']: data.FSI
			});
		} else {
			setItemList([])
			form.resetFields();
			setIsMobileVerify(false);
			let user = JSON.parse(localStorage.getItem("user"));
			setMyMobileNo(user.mobile);
			let flag = localStorage.getItem('isMobileVerified') == 'true' ? true : false;
			setIsMobileVerify(flag);
			form.setFieldsValue({
				['bemail']: user.email, ['phone']: user.mobile
			})
		}

		return () => {
			unmounted = true;
		}
	}, [props.setting.getBuss])

	const convertToFormData = (val) => {
		const formData = new FormData();
		formData.append("bussiness_id", props.match.params.id)
		for (const key in val) {
			if (key == "acNumber" && val.acNumber) {
				formData.append(key, val.acNumber)
			} else if (key == "images" && val.images.length > 0) {
				val.images.map((img) => {
					formData.append("images", img.file)
				})
			} else if (key == "FSI" && val.FSI) {
				formData.append(key, val.FSI.file)
			} else if (key == "address" && val.address) {
				formData.append(key, val.address)
			} else if (key == "bemail" && val.bemail) {
				formData.append(key, val.bemail)
			} else if (key == "branch" && val.branch) {
				formData.append(key, val.branch)
			} else if (key == "gstno" && val.gstno) {
				formData.append(key, val.gstno)
			} else if (key == "idno" && val.idno) {
				formData.append(key, val.idno)
			} else if (key == "ifsc" && val.ifsc) {
				formData.append(key, val.ifsc)
			} else if (key == "panNumber" && val.panNumber) {
				formData.append(key, val.panNumber)
			} else if (key == "phone" && val.phone) {
				formData.append(key, val.phone)
			} else if (key == "storeName" && val.storeName) {
				formData.append(key, val.storeName)
			} else if (key == "typeSeller" && val.typeSeller) {
				formData.append(key, val.typeSeller)
			} else if (key == "bussiness_id" && val.bussiness_id) {
				formData.append(key, val.bussiness_id)
			} else if (key == "fsaai_no" && val.fsaai_no) {
				formData.append(key, val.fsaai_no)
			}
		}
		return formData;
	}

	const onFinish = val => {
		val.images = imagesList.filter((img) => { return img.url; });
		val.FSI = fsaai_images_List;
		const formData = convertToFormData(val);

		if (props.match.params.id) {
			dispatch({ type: 'setting/updateItem', payload: formData });
		}
		else {
			dispatch({ type: 'setting/createVerify', payload: formData });
		}
	}

	useEffect(() => {
		let unmounted = false;
		return () => {
			unmounted = true;
		}
	}, [dispatch])

	useEffect(() => {
		let unmounted = false;
		let create = props.setting.create
		if (!unmounted && create.count > count && create.status) {
			setCount(create.count);
			setBtnDis(false);
			props.history.push('/business-verification')
		} else if (!unmounted && create.count > count && !create.status) {
			setBtnDis(false);
			setCount(create.count);
		}


		let update = props.setting.update;
		if (!unmounted && update && update.count > ccount && update.status) {
			setCcount(update.count);
			setBtnDis(false);
			props.history.push('/business-verification')
		} else if (!unmounted && update && !update.status) {
			setCcount(update.count);
		}

		let approve = props.setting.approve;
		if (!unmounted && approve && approve.status && approve.count > acount) {
			setAcount(approve.count); setBtnDis(false);
			props.history.push('/approve')
		}
		
		let otp = props.setting.otp;
		if (!unmounted && otp && otp.status === true ) {
				
		}
		
		let verifyotp = props.setting.verifyotp;
		if (!unmounted && verifyotp && verifyotp.status === true ) {
			localStorage.setItem('isMobileVerified','true');
			setIsMobileVerify(true);
			setModalVerifyVisible(false);
		}

		return () => { unmounted = true; }
	}, [props.setting])

	const updateImageData = val => {
		let data = [...imagesList].map((data) => { return { ...data } });
		val.map((val, index) => {
			return data.push({ file: val.file, url: val.urls })
		})
		setImagesList(data);
	}

	const updateFsaaiImageData = val => {
		setFsaaiImagesList(val[0]);
	}

	const dataURLtoFile = (dataurl, filename) => {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}

	const cancelFun = val => {
		form.resetFields();
		setImagesList([]);
		setFsaaiImagesList([]);
		if (isAdmin)
			props.history.push('/approve')
		else props.history.push('/business-verification')
	}

	const RejectItem = (data) => {
		let val = { loginIdBussiness: data, isBussinessVerified: false }
		dispatch({ type: 'setting/approveBuss', payload: val, });
	}

	const approvedItem = (data) => {
		let val = { loginIdBussiness: data, isBussinessVerified: true }
		dispatch({ type: 'setting/approveBuss', payload: val, });
	}

	const showPreview = (image) => {
		setModalImage(image);
		setModalVisible(true);
	}
	const handleCancel = () => {
		setModalVisible(false);
		setModalVerifyVisible(false);
	}

	const removeImagesList = () => {
		setImagesList([]);
	}

	const removeFassaiList = () => {
		setFsaaiImagesList([]);
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
		}).catch((err) => { console.log(err); });
	}

	const deleteImage = (uid) => {
		let resetData = imagesList.filter((item) => { return item.file.uid != uid })
		setImagesList(resetData);
	}

	const openModalForVerify = () => {
		let val = { mobile_number:myMobileNo };
		dispatch({ type: 'setting/resendOTPTOUser', payload: val, });
		setModalVerifyVisible(true);
	}
	
	const updateMobileNumber = (event) => {
		setMyMobileNo(event.target.value);
		setIsMobileVerify(false);
	}

	const changeMobileOTP = (event) =>{
		setMyMobileNoOTP(event.target.value);
	}

	const addMobileVerify = () => {
		if(setMyMobileNo.length > 0){
			if(myMobileNoOTP.length > 0){
				let val = { mobile_number:myMobileNo, otp:myMobileNoOTP };
				dispatch({ type: 'setting/varifyUser', payload: val, });
			}else{
				message.error('You need to add OTP');
			}
		}else{
			message.error('Please Add Mobile No')
		}
	}

	return (<Fragment>

		<Card style={{ width: '100%' }} title={<span><LeftOutlined onClick={() => props.history.push('/business-verification')} />Business Verification Form</span>} bodyStyle={{ padding: '0 20px 20px' }}>
			<Form {...formItemLayout} form={form} name="verifyForm" onFinish={onFinish} style={{ maxWidth: 930, margin: '0 auto !important' }}>
				<Form.Item name="storeName" label="STORE NAME" rules={[{ required: true, message: 'Field required!' },]}  >
					<Input placeholder="Store Name" disabled={isAdmin} />
				</Form.Item>

				<Form.Item name="bemail" label="EMAIL" 
				// rules={[{ type: 'email', message: 'The input is not valid E-mail!', }, { required: true, message: 'Field required!', },]}  
				>
					<Input placeholder="Email" disabled={true}  />
				</Form.Item>
				<Form.Item label="PHONE" extra={isMobileVerify ? '':'Verify your mobile number.'}>
					<Row gutter={12}>
						<Col span={12}>
							<Form.Item name="phone" rules={[{ required: true, message: 'Field required!', },]} >
								<Input placeholder="Phone" disabled={isAdmin} onChange={(e)=> updateMobileNumber(e)} disabled={true} />
							</Form.Item>
							
						</Col>
						<Col span={12}>
							{ isMobileVerify ? <><img src={okIcon} style={{ height: '30px', width:'30px' }} /> <p style={{ color:"green", fontWeight:'bold' }} >Verified</p> </>  :
								<Button type="primary" className="btn-w25" onClick={openModalForVerify} >Verify</Button>
							}
							
						</Col>
					</Row>
				</Form.Item>

				<Form.Item name="address" label="BUSINESS ADDRESS" rules={[{ required: true, message: 'Field required!', },]}  >
					<Input placeholder="Business Address" disabled={isAdmin} />
				</Form.Item>

				<Form.Item name="panNumber" label="PAN NUMBER" 
				// rules={[{ required: true, message: 'Field required!', },]}  
				rules={[
					{
						required: true,
						message: 'Field Required',
					},
				]}
				>
					<Input placeholder="Pan Number" disabled={isAdmin} />
				</Form.Item>
				{GSTStatus === 'YES' ?
					<Form.Item name="gstno" label="GST NUMBER" rules={[{ required: true, message: 'Field required!', },]}  >
						<Input placeholder="GST Number" disabled={isAdmin} />
					</Form.Item>
					: ''}
				<Form.Item name="idno" label="GOVT ID" rules={[{ required: true, message: 'Field required!', },]}  >
					<Select placeholder="Govt Id Type" disabled={isAdmin}>
						<Select.Option value="Aadhar Card">Aadhar Card</Select.Option>
						<Select.Option value="Voter ID">Voter ID</Select.Option>
						<Select.Option value="Driving Licence">Driving Licence</Select.Option>
					</Select>
				</Form.Item>
				<Form.Item name="fsaai_no" label="FSAAI NUMBER" 
				rules={ [
					{ pattern: /^(?:\d*)$/, message: "Value should contain just number", },  
				  ] }>
					<Input placeholder="FSAAI Number" disabled={isAdmin} />
				</Form.Item>

				<Form.Item name="typeSeller" label="TYPE OF SELLER" rules={[{ required: true, message: 'Field required!', },]}  >
					<Select placeholder="Type of Seller">
						<Select.Option value="Vendor or 3rd party vendor">Vendor or 3rd party vendor</Select.Option>
						<Select.Option value="Seller">Seller</Select.Option>
						<Select.Option value="Manufacturer">Manufacturer</Select.Option>
						<Select.Option value="Brand owner">Brand owner</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item name="acNumber" label="BANK ACCOUNT NUMBER" rules={[{ required: true, message: 'Field required!', }, 
					{ pattern: /^(?:\d*)$/, message: "Field should contain only number", },  
				]}  >
					<Input placeholder="Bank Account Number" disabled={isAdmin} />
				</Form.Item>
				<Form.Item name="ifsc"  label="IFSC CODE" rules={[{ required: true, message: 'Field required!', }
				]}  >
					<Input placeholder="IFSC Code" disabled={isAdmin} />
				</Form.Item>
				<Form.Item name="branch" label="BANK BRANCH NAME" rules={[{ required: true, message: 'Field required!', },]}  >
					<Input placeholder="Bank Branch Name" disabled={isAdmin} />
				</Form.Item>
				<Form.Item name="images" label={<span><span style={{ color: '#ff4d4f' }}>* </span>GOVT ID's</span>} rules={[{ required: false, message: 'Field required!', },]}  >
					{imagesList.length > 0 && imagesList.map((item, index) =>
						// item.url ? <div style={{maxWidth:"33%", float:'left'}}><DeleteOutlined /> <Avatar key={index} shape="square" size={150} src={item.url } style={{margin:5}} /></div> :
						item.url ? <span key={index}><Badge count={<DeleteOutlined style={{ color: '#f5222d', fontSize: "20px" }} onClick={() => deleteImage(item.file.uid)} />} >
							<Avatar key={index} shape="square" size={150} src={item.url} style={{ margin: 5 }} /></Badge></span> :
							<Avatar key={index} shape="square" size={150} src={process.env.REACT_APP_ApiUrl + '/' + item.file} onClick={() => showPreview(process.env.REACT_APP_ApiUrl + '/' + item.file)} style={{ margin: 5 }} />
					)}
					<br />

					{detail.loginid && !detail.loginid.isBussinessVerified && imagesList.length > 0 ?
						<span><br /><Button onClick={() => removeImagesList()}>Remove All</Button>&nbsp;&nbsp;</span> : ''}
					<Button onClick={() => setVisible(true)} disabled={isAdmin}> Upload Images </Button>

				</Form.Item>

				<Form.Item name="FSI" label={<span>
					{/* <span style={{ color: '#ff4d4f' }}>* </span> */}
					FSAAI DOC
					</span>} >
					{fsaai_images_List.urls ? <Avatar key="FASSAI1456" shape="square" size={150} src={fsaai_images_List.urls} style={{ margin: 5 }} /> :
						<Avatar key="FASSAI1456" shape="square" size={150} src={process.env.REACT_APP_ApiUrl + '/' + fsaai_images_List.file} onClick={() => showPreview(process.env.REACT_APP_ApiUrl + '/' + fsaai_images_List.file)} style={{ margin: 5 }} />}

						<br />

					<Button onClick={() => setfVisible(true)} disabled={isAdmin}> Upload Images </Button>
				</Form.Item>

				
				<Form.Item {...tailFormItemLayout}>
					<Button onClick={cancelFun}>Cancel</Button> &nbsp;
						{isAdmin ? <Fragment>
						<Button type="primary" onClick={() => approvedItem(detail.loginid.id)} disabled={detail.loginid ? detail.loginid.isBussinessVerified : ''}><CheckOutlined /> Accept</Button> &nbsp;
						
						<Button type="danger" onClick={() => RejectItem(detail.loginid ? detail.loginid.id : '')}><CloseOutlined /> Reject </Button>
					</Fragment>
						:
						
						// detail.loginid && !detail.loginid.isBussinessVerified ?
							<Button type="primary" onClick={() => form.submit()} className="btn-w25" ref={btnFocus} >
								{props.buttonText ? props.buttonText : "Save"}
							</Button> 
							// : ''
					}
				</Form.Item>
			</Form>

			<UploadImages visible={visible} closeFun={() => setVisible(false)} returnImg={val => updateImageData(val)} resetVal={imagesList} />
			<UploadImages1 visible={fvisible} closeFun={() => setfVisible(false)} returnImg1={val1 => updateFsaaiImageData(val1)} resetVal={fsaai_images_List} aspect={9 / 12} />

		</Card>
		<Modal
			width={1000}
			visible={modalVisible}
			title={null}
			footer={null}
			onCancel={handleCancel} >
			<DownloadOutlined style={{ fontSize: '48px', cursor: 'pointer' }} onClick={() => DownloadImages()} />
			<img alt="example" style={{ width: '100%' }} src={previewImage} />
		</Modal>

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

	</Fragment>
	);
};

export default connect(({ setting, loading }) => ({
	setting, loading
}))(VerifySellerForm);
