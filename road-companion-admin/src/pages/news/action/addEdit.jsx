import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Row, Col, Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Space, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, InputNumber } from 'antd';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images'
import CropImage from '../../../components/sharing/crop-image'
import TextEditor from '../../../components/sharing/text-editor'
import moment from 'moment';
import { connect } from 'dva';
import { getSubCatbyCategory } from '../../../services/api'
import {getNewsCategoryList} from '../../../services/api';
// import { RMIUploader } from "react-multiple-image-uploader";
import MultiImageInput from 'react-multiple-image-input';

const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const baseUrl = process.env.REACT_APP_ApiUrl
const AddEditNews = props => {
	const [form] = Form.useForm();
	const { dispatch, newsCategory } = props;
	const [visible, setVisible] = useState(false);
	const [galleryVisible,setVisibleGallery] = useState(false);
	const [imagesList, setImagesList] = useState([]);
	const [gallaryImagesList, setGallaryImagesList] = useState([]);
	const [catlist, setCatlist] = useState([]);
	const [subcatlist, setSubCatlist] = useState([]);
	const [productFeatures, setProductFeatures] = useState([]);
	const [detail, setDetail] = useState({});
	const [itemId, setItemId] = useState()
	const [imageUrl, setImageUrl] = useState('');
	const [picModel, setPicModel] = useState(false);
	const [loading, setLoading] = useState(false);
	const [InquiryData, setInquiryData] = useState('');
	let [Inquiry, setInquiry] = useState('');
	const [count, setCount] = useState(0)
	const [ecount, setECount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	const [colorImages, setColorImages] = useState({});
	const [manageStock,setManageStock] = useState(false);
	const [scheduleSale,setScheduleSale] = useState(false);
	const [galleryImageUriList,setGalleryImageUriList] = useState({});
    const [isManageStockCbk,setManageStockCbk] = useState(false);
    

	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		props.dispatch({ type: 'newsCategory/newsCategoryList' });
		props.dispatch({ type: 'news/newsList' });
		if (props.match.params.id) {
			setItemId(props.match.params.id)
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
			setImageUrl('');
			setImagesList([])
		}
		return () => { unmounted = true; }
	}, [dispatch])

	useEffect(() => {
        let unmounted = false;
   		setCatlist(newsCategory.list ? newsCategory.list.result : [])

		return () => { unmounted = true; }
	}, [props.newsCategory])

	const DetailFun = (id) => {
		props.dispatch({ type: 'news/newsDetail', payload: { _id: id } });
	}

	const convertToFormData = (val) => {
		const formData = new FormData();
		for(const key in val) {
    		if(key == "gallary_images" && gallaryImagesList) {
				formData.append("images", gallaryImagesList[0]);
			} else if(key == "category_id" && val.category_id ) {
				formData.append(key, val.category_id);
			} else if(key == "title" && val.title ) {
                formData.append(key, val.title);
            } else if(key == "description" && val.description) {
				formData.append(key,val.description)
			} else if(key == "shortdesc" && val.shortdesc) {
				formData.append(key,val.shortdesc)
			}
		}
		return formData;
	}

	const onFinish = val => {
		val.gallary_images = [...gallaryImagesList];
		setBtnDis(true);
		const formData = convertToFormData(val);
		if (props.match.params.id) {
			formData.append('_id',props.match.params.id);
			dispatch({ type: 'news/editNewsList', payload: formData });
		}
		else {
			dispatch({ type: 'news/addNewsList', payload: formData });
		}
	}

	useEffect(() => {
		let unmounted = false;

		let add = props.news.add
		if (!unmounted && add.count > count && add.data && add.data.status) {
			setCount(add.count);
			setBtnDis(false);
			setImageUrl('');
			setImagesList([])
			cancelFun();
			props.history.push('/news');
		} else if (!unmounted && add.count > count && add.data && !add.data.status) {
			setBtnDis(false);
			setCount(add.count);
		}

		// Edit
		let edit = props.news.edit
		if (!unmounted && edit.count > ecount && edit.status) {
			setECount(edit.count);
			setBtnDis(false);
			setImageUrl('');
			setImagesList([])
			cancelFun();
			props.history.push('/news');
		} else if (!unmounted && edit.count > ecount && !edit.status) {
			setBtnDis(false);
			setECount(edit.count);
		}


		// detail
		console.log(props.news)
		if (props.match.params.id) {
			let detail = props.news.detail
			if (!unmounted && detail && detail.status) {
				setDCount(detail.count);
				let data = detail.data;
				setDetail(data)
				console.log('data::',data);
				form.setFieldsValue({
					['title']: data.title, ['description']: data.description, ['category']: data.category, ['shortdesc']: data.shortdesc, ['thumbnail']: data.thumbnail
				});
				if ( data.stock_quanlity || data.allow_back_orders || data.low_stock_threshold) {
					setManageStock(true);
				}

				if(data.images && data.images.file) {
					setImageUrl(data.images.file);
					setImagesList([{url: data.images.file}]);
				}

				if(data.gallary_images && data.gallary_images.length > 0) {
					setGalleryImageUriList(data.gallary_images.map((galImg) => {
						return process.env.REACT_APP_ApiUrl+'/'+galImg.file;
					}));
				}
			} else if (!unmounted && detail && !detail.status) {
				setBtnDis(false);
				setDCount(detail.count);
			}
		}
		return () => { unmounted = true; }
	}, [props.news])

	const cancelFun = () => {
		form.resetFields();
		setImageUrl('');
		setImagesList([])
		props.history.push('/news');
	}
	const getNewImage = val => {
		console.log({val});
		setPicModel(false);
		setImageUrl(val.urls[0])
		form.setFieldsValue({ images: val.file })
	}
	const removeImgFun = () => {
		setImageUrl('');
		form.setFieldsValue({ images: [] });
	}

	const productHandle = (val, field, index) => {
		const product = productFeatures
		product.map((item, i) => {
			if (index == i) item[field] = val
		})
		setProductFeatures(product)
	}

	const uploadButton = (
		<div>
			{loading ? <LoadingOutlined /> : <i className="fad fa-camera-retro" style={{ color: "#13c2c2", fontSize: 57 }} />}
		</div>
	);

	const getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	  }
	  
	const beforeUpload = (file) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
		  message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
		  message.error('Image must smaller than 2MB!');
		}
		return isJpgOrPng && isLt2M;
	  }

	 const handleChange = (info,index) => {
		if (info.file.status === 'uploading') {
		  return;
		}
		if (info.file.status === 'done') {
		  getBase64(info.file.originFileObj, imageUrl =>
			 {
				 const indexName = 'colorProduct' + index;
				setColorImages(
					{...colorImages,
					[indexName] : imageUrl
					}
				)
			 }
		  );
		  console.log('imageUrl',imageUrl);
		}
	  }


	  const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);   
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }
	
	
	  const onUploadGallery = (data) => {
		const images = Object.values(data).map((image,i) => {
			if(image.startsWith(process.env.REACT_APP_ApiUrl)) {
				return image;
			}else{
				return dataURLtoFile(image,'image_'+i);
			}
		})
		setGalleryImageUriList(data);
		const files = setGallaryImagesList([...images]);
	  }

	  const onRemoveGallery = (id) => {
		setGallaryImagesList(gallaryImagesList.filter((img) => img.id !== id));
	  };
	  const uploadButtonColor = (
		<div>
		  {loading ? <LoadingOutlined /> : <PlusOutlined />}
		  <div style={{ marginTop: 8 }}>Upload</div>
		</div>
	  );

	  const crop = {
		unit: '%',
		aspect: 4 / 3,
		width: '100'
	  };

	return (
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/news')} /> {props.detail ? 'Edit News' : 'Add News'}</span>} style={{ marginTop: "0" }}>

			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
				<Row gutter={15}>
				<Col sm={24} md={24}>
						<Form.Item name="thumbnail" label={<span><span style={{ color: 'red' }}>*</span> Images</span>} >
							 <MultiImageInput
									images={galleryImageUriList}
									setImages={onUploadGallery}
									allowCrop = {false}
    						/>
						</Form.Item>
					</Col>


					<Col flex="auto">
						<Row gutter={15}>
							<Col sm={24} md={24}>
								<Form.Item name="title" label="NEWS TITLE" rules={[{ required: true, message: 'This field is required!' },]}  >
									<Input placeholder="News Title" />
								</Form.Item>
							</Col>
                            <Col sm={24} md={24}>
								<Form.Item name="category_id" label="NEWS CATEGORY" rules={[{ required: true, message: 'This field is required!' }]}>
									<Select placeholder="News Category">
										{catlist.map((item, index) => <Select.Option key={index} value={item._id}>{item.category_name}</Select.Option>)}
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row gutter={15}>
					<Col sm={24} md={24}>
						<Form.Item name="shortdesc" label="SHORT DESCRIPTION" rules={[{ required: false, message: 'This field is required!' }]} >
								<Input placeholder="Short Description" />
						</Form.Item>
					</Col>
					
					<Col sm={24} md={24}>
						<Form.Item name="description" label="DESCRIPTION" rules={[{ required: true, message: 'This field is required!' }]} >
                        	<TextArea placeholder="Description" type="number" rows={6}/>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item className="mb-0">
					<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
				</Form.Item>
			</Form>
		</Card>
	)
};

export default connect(({ news, newsCategory, global, loading }) => ({
	news: news,
	newsCategory: newsCategory,
	global: global
}))(AddEditNews);