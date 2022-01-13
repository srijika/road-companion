import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Row, Col, Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Space, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, InputNumber } from 'antd';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images'
import TextEditor from '../../../components/sharing/text-editor'


import moment from 'moment';
import { connect } from 'dva';
import { getSubCatbyCategory } from '../../../services/api'
// import { RMIUploader } from "react-multiple-image-uploader";
import MultiImageInput from 'react-multiple-image-input';
import HTMLDecoderEncoder from 'html-encoder-decoder';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';
import axios from 'axios'
import VideoInput from './VideoInput';

const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const baseUrl = process.env.REACT_APP_ApiUrl;

const AddEditProduct = props => {

	let product_param_id = props.match.params.id;

	const [form] = Form.useForm();
	const { dispatch, category, subcategory } = props;
	const [visible, setVisible] = useState(false);
	const [price, setPrice] = useState('');

	const [mrpPrice, setMrpPrice] = useState('');
	// const [startDate, setStartDate] = useState(new Date());
	// const [error, setError] = useState('');
	const [role, setRole] = useState('')
	let user = localStorage.getItem('user')
	let seller = JSON.parse(user);


	const [needUpdate, setNeedUpdate] = useState(false);
	// const [galleryVisible,setVisibleGallery] = useState(false);
	const [imagesList, setImagesList] = useState([]);
	const [gallaryImagesList, setGallaryImagesList] = useState([]);
	const [catlist, setCatlist] = useState([]);
	const [subcatlist, setSubCatlist] = useState([]);
	const [productFeatures, setProductFeatures] = useState([]);
	// const [detail, setDetail] = useState({});
	// const [itemId, setItemId] = useState()
	const [imageUrl, setImageUrl] = useState('');
	// const [picModel, setPicModel] = useState(false);
	const [loading, setLoading] = useState(false);
	// const [InquiryData, setInquiryData] = useState('');
	const [Inquiry, setInquiry] = useState('');
	const [count, setCount] = useState(0)
	const [ecount, setECount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	// const [colorImages, setColorImages] = useState({});
	const [manageStock,setManageStock] = useState(false);
	const [scheduleSale,setScheduleSale] = useState(false);
	const [galleryImageUriList,setGalleryImageUriList] = useState({});
	// const [isManageStockCbk,setManageStockCbk] = useState(false);
	// const [sellers, setSellers] = useState([])
	const [date, setDate] = useState('')
	const [attribute, setAttribute] = useState([]);
	const [subcategoryAttributeVariants, setSubcategoryAttributeVariants] = useState([]);

	

	const [stockQuantity, setStockQuantity] =  useState();
	const [stockThreshold, setStockThreshold] =  useState();
	const [videoFile, setVideoFile] = useState('');
	const [videoFileUploaded, setVideoFileUploaded] = useState('');

    // const baseUrl = process.env.REACT_APP_ApiUrl


	  function disabledDateSale(current) {
		// let customDate = "2021-08-25";
		const cuurentDate = new Date().toLocaleDateString;
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		
		today = yyyy + '-' + mm + '-' + dd;

		
if(date === "" || date === null){
	return current && current <= date < moment(today, "YYYY-MM-DD");

}else{

	return current && current <= date ;
	
}

	  }

	  function disabledDate(current) {
		// let customDate = "2021-08-25";
		const cuurentDate = new Date().toLocaleDateString;
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		form.setFieldsValue({
			['sale_price_date_to']: ''
		  });
		
		today = yyyy + '-' + mm + '-' + dd;
		return current && current < moment(today, "YYYY-MM-DD");

	  }

	
	
	  const getAttributes = async () => {

		const res = await axios.post(`${baseUrl}/list/attribute`);
		setAttribute(res.data.attribute);
	}

	useEffect( () => {

		getAttributes();


		let unmounted = false;
		window.scroll(0, 0);
		disabledDateSale()
	
		
		props.dispatch({ type: 'category/categoryList' });
		if (props.match.params.id) {
			// setItemId(props.match.params.id)
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
			setImageUrl('');
			setImagesList([])
		}
		return () => { unmounted = true; }
	}, [dispatch])

	useEffect(() => {
	setRole(localStorage.getItem('role'))
		let unmounted = false;

		setCatlist(category.list ? category.list.data : [])
		
		
		return () => { unmounted = true; }
	}, [props.category])

	const DetailFun = (id) => {
		props.dispatch({ type: 'product/productDetail', payload: { id: id } });
	}

	var tagsToReplace = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;'
	};

	function replaceTag(tag) {
		return tagsToReplace[tag] || tag;
	}
	
	function safe_tags_replace(str) {
		return str.replace(/[&<>]/g, replaceTag);
	}

	const convertToFormData = (val) => {
		const formData = new FormData();
		for(const key in val) {

			if(key == "gallary_images" && gallaryImagesList) {
		
				 gallaryImagesList.map((data) => {
					 if(data.name){
						formData.append(key,data);
					 }
				});
			}else if(key == "thumbnail" && imagesList.length > 0 && imagesList[0].file) {
		
				formData.append("images",imagesList[0].file);
			} else if(key == "category" && val.category ) {
				formData.append(key, val.category);
			} else if(key == "subCategory" && val.subCategory ) {
				formData.append(key, val.subCategory);
			} else if(key == "keywords" && val.keywords ) {
				val.keywords.map((data) => {
					formData.append(key+"[]",data);
				});
			} else if(key == "variants" && val.variants) {
				let newvariant = val.variants.map((item)=>{

					if(['', undefined, null].includes(item.value)) {
						alert(`${item.label} Variant value are required`);
						return ;
					}

					return {
						label: (item.label).toLowerCase(),
						value: (item.value.map((ppp) => ppp.toLowerCase() )).join(',')
					};
				})
				//console.log("variants", val.variants, newvariant);
				formData.append(key, JSON.stringify(newvariant));
			} else if((key == "is_featured" && !val.is_featured) || (key == "is_hot" && !val.is_hot) ) {
				formData.append(key,false);
			} 
			else if(key == "description" && val.description) {
				formData.append(key,val.description)
			}
			else if(key == "video") {
				formData.append(key,val.video)
			}
			else{
				formData.append(key,val[key])
			}
		}
		return formData;
	}

	const convertUndefinedObjectKeysToEmptyString = (object) => {
		var output = {};
		for(let i in object) {
			if(!object[i]) {
				output[i] = "";
			} else {
				output[i] = object[i];
			}	
		}
		return output;
	}

	const onFinish = val => {



		// return false;

		if(product_param_id === undefined) {
			// gallaryImagesList.length > 0 ? "" : alert('Gallery images field required'); return ;
			if(gallaryImagesList.length > 0) {

			}else {
				alert('Gallery images field required'); return ;
			}
		}else {
		
			if(galleryImageUriList.length > 0 || gallaryImagesList != undefined) {

			}else {
				alert('Gallery images field required'); return ;
			}
		}	

		


		if(val.variants === undefined || val.variants === "" || val.variants === null) {
			alert('Please Enter Variants and Values');
			return ;
		}

		delete val['images'];
		
		val.description = HTMLDecoderEncoder.encode(Inquiry);
		val = convertUndefinedObjectKeysToEmptyString(val);
		val.gallary_images = [...gallaryImagesList];
		val.thumbnail = imagesList;

		if(!['', undefined, null].includes(videoFile)) {
			val.video = videoFile;
		}

		const formData = convertToFormData(val);

		
		let mrp_price = val.mrp_price;
		let price = val.price;

		let discount_price = mrp_price - price;
		let discount = (discount_price / mrp_price) * 100;
		let discount_percent = Math.round(discount);
		formData.append('discount_percent',discount_percent);
		
		setBtnDis(true);
		if (props.match.params.id) {
			formData.append('_id',props.match.params.id);
			dispatch({ type: 'product/productEdit', payload: formData });
		}else {
			dispatch({ type: 'product/productAdd', payload: formData });
		}
		setBtnDis(false);
	}

	useEffect(() => {
		let unmounted = false;

		// SET DEFAULT USER SELLER NAME
		if(seller.username != undefined && seller.username != "" && seller.username != null) {
			form.setFieldsValue({
				['vendor']: seller.username, 
			})
		}

		let add = props.product.add
		if (!unmounted && add.count > count && add.status) {
			setCount(add.count);
			setBtnDis(false);
			setImageUrl('');
			setImagesList([])
			cancelFun();
		} else if (!unmounted && add.count > count && !add.status) {
			setBtnDis(false);
			setCount(add.count);
		}

		// Edit
		let edit = props.product.edit
		if (!unmounted && edit.count > ecount && edit.status) {
			setECount(edit.count);
			setBtnDis(false);
			setImageUrl('');
			setImagesList([])
			cancelFun();
		} else if (!unmounted && edit.count > ecount && !edit.status) {
			setBtnDis(false);
			setECount(edit.count);
		} 


		// detail
		if (props.match.params.id) {
			let detail = props.product.detail
			
			if (!unmounted && detail && detail.status) {
				setDCount(detail.count);
				let data = detail.check;
				// setDetail(data)
			
				form.setFieldsValue({
					['title']: data.title, 
					['brand']: data.brand, 
					['description']: data.description, 
					['category']: data.category, 
					['vendor']: data.vendor, 
					['productFeatures']: data.productFeatures, 
					['price']: data.price, 
					sale_price: data.sale_price, 
					['mrp_price']: data.mrp_price, 
					['inventory']: data.inventory, 
					['is_featured']: data.is_featured, 
					['thumbnail']: data.thumbnail, 
					['images']: '', 
					['keywords']: data.keywords, 
					['color']: data.color, 
					['productId']: data.productId,
					['sale_price_date_from']: moment(new Date(data.sale_price_date_from)) , 
					['sale_price_date_to']: moment(new Date(data.sale_price_date_to)),
					['sku'] : data.sku ,
					['stock_quanlity']:data.stock_quanlity, 
					['allow_back_orders']: data.allow_back_orders , 
					['low_stock_threshold'] : data.low_stock_threshold , 
					['stock_status'] : data.stock_status  ,
					['weight'] : data.weight, 
					['description'] : data.description, 
					['keywords']: data.keywords, 
					['variants']: data.variants && data.variants.length > 0 && data.variants[0] != "undefined" ? data.variants :[], 
					['productId']: data.productId , 
					['is_featured']: data.is_featured, 
					['is_hot']: data.is_hot,
					['product_status']: data.product_status,
					// ['subCategory']: data.subCategory 
				});

		
				setSubcategoryAttributeVariants(data.variants)

				setPrice(data.price);				
				setMrpPrice(data.mrp_price);				

				setInquiry(HTMLDecoderEncoder.decode(data.description));

				setNeedUpdate(true)
				onCategoryChange(data.category, true)
			
				if ( data.stock_quanlity || data.allow_back_orders || data.low_stock_threshold) {
					setManageStock(true);
				}

				if(data.images && data.images.file) {
					setImageUrl(data.images.file);
					setImagesList([{url: data.images.file}]);
				}

				if(data.video && data.video.file) {
					setVideoFileUploaded(data.video.file);
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
	}, [props.product])

	const cancelFun = () => {
		form.resetFields();
		setImageUrl('');
		setImagesList([])
		props.history.push('/products');
	}

	// const getNewImage = val => {
	// 	// setPicModel(false);

	// 	setImageUrl(val.urls[0])
	// 	form.setFieldsValue({ images: val.file })
	// }

	// const removeImgFun = () => {
	// 	setImageUrl('');
	// 	form.setFieldsValue({ images: [] });
	// }

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

	// const getBase64 = (img, callback) => {
	// 	const reader = new FileReader();
	// 	reader.addEventListener('load', () => callback(reader.result));
	// 	reader.readAsDataURL(img);
	//   }
	  
	// const beforeUpload = (file) => {
	// 	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	// 	if (!isJpgOrPng) {
	// 	  message.error('You can only upload JPG/PNG file!');
	// 	}
	// 	const isLt2M = file.size / 1024 / 1024 < 2;
	// 	if (!isLt2M) {
	// 	  message.error('Image must smaller than 2MB!');
	// 	}
	// 	return isJpgOrPng && isLt2M;
	//   }

	//  const handleChange = (info,index) => {
	// 	if (info.file.status === 'uploading') {
	// 	//   this.setState({ loading: true });
	// 	  return;
	// 	}
	// 	if (info.file.status === 'done') {
	// 	  // Get this url from response in real world.
	// 	  getBase64(info.file.originFileObj, imageUrl =>
	// 		 {
	// 			 const indexName = 'colorProduct' + index;
	// 			setColorImages(
	// 				{...colorImages,
	// 				[indexName] : imageUrl
	// 				}
	// 			)
	// 		 }
	// 	  );
	// 	}
	//   }


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

	  const uploadButtonColor = (
		<div>
		  {loading ? <LoadingOutlined /> : <PlusOutlined />}
		  <div style={{ marginTop: 8 }}>Upload</div>
		</div>
	  );

	  const onManageStockChange = (e) => {	
		setManageStock(e.target.checked);
	  }

	//   const onScheduleSaleChange = (e) => {	
	// 	setScheduleSale(e.target.checked);
	//   }


	  const onCategoryChange = async (e, needUpdate_ = false) => {	
		  
		  const cat = { parentcat_id: e}
		  
		  await props.dispatch({ type: 'subcategory/subCategorybyCat', payload: cat, });
		  const response = await getSubCatbyCategory(cat)

		  form.setFieldsValue({
			['subCategory']: ''
		  });

		  if(response.status){
			setSubCatlist(response.data.length > 0 ? response.data : [])
		  }

		  if (props.match.params.id && needUpdate_) {
			setNeedUpdate(false)
			let detail = props.product.detail
			let data = detail.check;

			if (detail && detail.status) {
				form.setFieldsValue({
					['subCategory']: data.subCategory
				});
			}
		}
	  }


	  useEffect(() => {
			deleteGalleryImage();
	  }, [galleryImageUriList])

	  const deleteGalleryImage = async () => {

		const galleryItemArr = input => {
			const entries = Object.entries(galleryImageUriList);
			entries.forEach(entry => entry[0] = +entry[0]);
			return entries;
		}

		let gallery_images_arr = [];
		let galleryImagesArr = galleryItemArr(galleryImageUriList);
		galleryImagesArr.map((item) => {
			let data = item['1'].split('/').pop();
			gallery_images_arr.push(data)
		})


		try {
			let data = {
				gallery_images : gallery_images_arr, 
				product_id: product_param_id
			}
			const res = await axios.post(`${baseUrl}/gallery/image/delete`, data);
			if(res.data.status === 200) {
				alert(res.data.message);
			}	

		}catch(err) {
			console.log(err);

		}
		
	  } 


	  function findArrayElementById(array, variant_id) {
		return array.find((element) => {
		  return element._id === variant_id;
		})
	  }

	  const selectSubcategoryChangeVariant = async (subcategory_val, category_id ="") => {

			let res;
			if(!subcatlist.length > 0) {
			
				const cat = { parentcat_id: category_id}
				await props.dispatch({ type: 'subcategory/subCategorybyCat', payload: cat, });
				res = await getSubCatbyCategory(cat)
			}


			let d;
			if(res) {
				d = findArrayElementById(res.data, subcategory_val);
			}else {
				d = findArrayElementById(subcatlist, subcategory_val);
			}

			
			if(attribute === undefined || attribute === "" || attribute === null) {
				return ;
			}
			
			
			
			let attributeData = [];
			attribute.map((item) => {
				d.attributes.map((data_item) => {
					if(data_item === item._id) {		
						let my_data = {
							label: item.name, 
							value: undefined
						} 				
						return attributeData.push(my_data)
					}
				})
			})

			setSubcategoryAttributeVariants(attributeData);
			form.setFieldsValue({
				['variants']: attributeData
			});
	  }		


	return (
		<Card title={<span><LeftOutlined onClick={() => {props.history.push('/products')
		window.location.reload();
		}} />{props.product.detail ? 'Edit Product' : 'Add Product'}</span>} style={{ marginTop: "0" }}>

			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
				<Row gutter={15}>
					<Col xs={24} sm={24} md={24} lg={24}style={{ marginTop: 20,  }}>
						<Form.Item name="images" >
							<div className={'uploaderImg'} >
								{imageUrl ? <img src={process.env.REACT_APP_ApiUrl+'/'+imageUrl} alt="avatar" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : uploadButton}
							</div>
							
						</Form.Item>
					</Col>


					<Col flex="auto">
						<Row gutter={15}>
							<Col  xs={24} sm={24} md={12}>
								<Form.Item name="title" label="PRODUCT NAME" rules={[{ required: true, message: 'Field required!' },]}  >
									<Input  placeholder="Product Name" />
								</Form.Item>
							</Col>
							

							<Col  xs={24} sm={24} md={12}>
								<Form.Item  name="vendor" label="VENDOR"  >
									<Input placeholder="vendor" disabled
									defaultValue={seller.username} value={seller.username} />
								</Form.Item>
							</Col> 
							
						
						</Row>
						<Row gutter={15}>

							<Col xs={24} sm={24} md={12}>
								<Form.Item name="mrp_price" label="MRP PRICE"  rules={[{ type: 'number', required: true, message: 'Numeric Value Required' }]}>
									<InputNumber min={0} placeholder="MRP Price" type="number"  onChange={(e) => {setMrpPrice(e)}}/>
								</Form.Item>
							</Col>

							<Col xs={24} sm={24} md={12}>
								<Form.Item name="price" label="PRICE" rules={[{ type: 'number', required: true, message: 'Numeric Value Required' }
							]} >
									<InputNumber min={0} placeholder="Price" type="number" onChange={(e) => { setPrice(e)}} />
								</Form.Item>
								<div className="text_danger">{price > mrpPrice  ? "Price must be lesser than MRP Price" : ""}</div>
							</Col>



							{/* <Col sm={24} md={12}>
								<Form.Item name="sale_price" label="SALE PRICE"  rules={[{ type: 'number', required: true, message: 'Numeric Value Required' }]}>
									<InputNumber min={0} placeholder="Sale Price" type="number"  onChange={(e) => {setSalePrice(e)}}/>
								</Form.Item>
								<div className="text_danger">{salePrice > price ? "Sale Price must be lesser than Price" : ""}</div>
							</Col> */}

						</Row>
						<Row gutter={15}>
							<Col  xs={24} sm={24} md={12}>
								<Form.Item name="inventory" label="Stock Quantity" rules={[{ type: 'number', required: true, message: 'Numeric Value Required' }]} >
									<InputNumber min={0} placeholder="Stock Quantity" type="number" />
								</Form.Item>
							</Col>
							<Col  xs={24} sm={24} md={12}>
								<Form.Item name="category" label="Parent Category" rules={[{ required: true, message: 'This field is required!' }]}>
									<Select placeholder="Category" onChange={(e) => onCategoryChange(e)}>
										{catlist && catlist.map((item, index) => <Select.Option key={index} value={item._id}>{item.name}</Select.Option>)}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={15}>
							<Col  xs={24} sm={24} md={12}>
								<Form.Item name="subCategory" label="Sub Category" rules={[{ required: true, message: 'This field is required!' }]}>

									<Select placeholder="Subcategory" onChange={(e) => { selectSubcategoryChangeVariant(e) }}>
										{subcatlist.map((item, index) => <Select.Option key={index} value={item._id}>{item.name}</Select.Option>)}
									</Select>

								</Form.Item>
							</Col>
							<Col  xs={24} sm={24} md={12}>
								<Form.Item name="brand" label="BRAND NAME"   >
									<Input  placeholder="Brand Name" />
								</Form.Item>
							</Col>
							{/* <Col  xs={24} sm={24} md={24}>
								<Form.Item name="is_schedule_sale_price" >
									<Checkbox checked={scheduleSale} onChange={onScheduleSaleChange} >Schedule Sale?</Checkbox>
								</Form.Item>
							</Col>
							
							{ scheduleSale && 
							<>
								<Col  xs={24} sm={24} md={12}>
								<Form.Item name="sale_price_date_from" label="Sale Price Date From" rules={[{ required: true, message: 'This field is required!' }]} >
									<DatePicker  format="YYYY-MM-DD" disabledDate={disabledDate} onChange={(value, e) =>setDate(value)} />
								</Form.Item>
								</Col>
								<Col  xs={24} sm={24} md={12}>
									<Form.Item name="sale_price_date_to" label="Sale Price Date To" rules={[{ required: true, message: 'This field is required!' }]}>
									<DatePicker  format="YYYY-MM-DD"  disabledDate={disabledDateSale}  />
									</Form.Item>
								</Col>
							</>
							} */}
						</Row>
						
						<Row gutter={15}>
							
						</Row>
					</Col>
				</Row>



				<Row gutter={15}>
					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'This field is required!' }]} >
								<Input placeholder="SKU" />
						</Form.Item>
					</Col>
					
					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="is_manage_stock" >
							<Checkbox checked={manageStock} onChange={onManageStockChange} >Manage Stock?</Checkbox>
						</Form.Item>
					</Col>

					{ manageStock &&
					<>
					{/* <Col  xs={24} sm={24} md={24}>
						<Form.Item name="stock_quanlity" >
							<InputNumber placeholder="Stock Quantity" type="number" onChange={(e) => {setStockQuantity(e)}}  />
						</Form.Item>
					</Col> */}

					{/* <Col  xs={24} sm={24} md={24}>
						<Form.Item name="allow_back_orders" >
							<Select placeholder="Allow back orders" value="0">
									<Select.Option value="0">Do not allow</Select.Option>
									<Select.Option value="1">Allow</Select.Option>
							</Select>
						</Form.Item>
					</Col> */}

					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="low_stock_threshold" >
							<InputNumber placeholder="Low stock threshold" name="low_stock_threshold" type="number" onChange={(e) => {setStockThreshold(e)}}   />
						</Form.Item>
						<div className="text_danger">{stockThreshold > stockQuantity ? "Threshold Stock must be less than Stock Quantity" : ""}</div>
					</Col>
					</>
					}

					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="stock_status" >
							<Select placeholder="Stock Status" value="0">
									<Select.Option value="In Stock">In stock</Select.Option>
									<Select.Option value="Out Of Stock">Out of stock</Select.Option>
							</Select>
						</Form.Item>
					</Col>

					{/* <Col  xs={24} sm={24} md={24}>
						<Form.Item name="weight"  >
							<Input placeholder="Weight(Kg)"  />
						</Form.Item>

					</Col> */}
					
					{/* <Col  xs={24} sm={24} md={24}>
						<Form.Item name="sku" label="SKU" rules={[{ required: false, message: 'This field is required!' }]} >
								<Input placeholder="SKU" />
						</Form.Item>
					</Col> */}

				</Row>

				<Col  xs={24} sm={24} md={12} style={{ position: "relative" }}>
					<Form.Item name="weight" label="Product Weight" 
						rules={[{ required: true, message: 'This field is Required' }]} 
					>
						<Input placeholder="Product Weight(gms)" type="number"	 />
					</Form.Item>
					<span style={{  color: "darkred", fontSize: "12px" }}> * Please type product weight on grams </span>
				</Col>


				<Row gutter={15} style={{ marginTop: "20px" }}>
					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="description" label="DESCRIPTION" rules={[{ required: false, message: 'This field is required!' }]} >
							<TextEditor returnVal={val => setInquiry(val)} data={Inquiry}/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={15}>
					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="keywords" label="KEYWORDS" rules={[{ required: false, message: 'This field is required!' }]}>
							<Select mode="tags" placeholder="Enter Keywords" tokenSeparators={[',']}>
							</Select>
						</Form.Item>
					</Col>
				</Row>



				<Form.List name="variants" initialValue={subcategoryAttributeVariants} >
					{(fields, { add, remove }) => (
						<>
							{fields.map((field, index8) => (

									
								<Row gutter={15} key={index8} align="baseline">
									<Col sm={20} md={10}>

										<Form.Item
											{...field}
											label="Variant Label"
											name={[field.name, 'label']}
											fieldKey={[field.fieldKey, 'label']}
											// rules={[{ required: true, message: 'This field is required!' }]}
										>

											<Input type="text" disabled />
											 
										</Form.Item>
									</Col>
									<Col sm={20} md={10}>
										<Form.Item name={[field.name, 'value']} label="Variant Value" 
										// rules={[{ required: false, message: 'This field is required!' }]}
										>
										
											<Select mode="tags" placeholder="Enter Variant" tokenSeparators={[',']}>
											</Select>
										
										</Form.Item>
									</Col>
									<Col sm={4} md={2}>
										<Form.Item className="mb-3">
											<MinusCircleOutlined onClick={() => remove(field.name)} />
										</Form.Item>
									</Col>
								</Row>
							))}

							<Form.Item className="mb-2">
								{/* <Button type="primary" className="btn-w25 btn-primary-light" onClick={() => add()} block icon={<PlusOutlined />} >
									Add Variants
								</Button> */}
							</Form.Item>
						</>
					)}
				</Form.List>




				<Row gutter={15}>
					{/* <Col  xs={24} sm={24} md={6}>
						<Form.Item name="is_featured" rules={[{ required: false, message: 'This field is required!' }]} valuePropName="checked">
							<Checkbox>Is Featured?</Checkbox>
						</Form.Item>
					</Col>

							

					<Col  xs={24} sm={24} md={6}>
						<Form.Item name="is_hot" rules={[{ required: false, message: 'This field is required!' }]} valuePropName="checked">
							<Checkbox>Is hot?</Checkbox>
						</Form.Item>
					</Col> */}

						{/* ME SUNIL */}
					{/* <Col  xs={24} sm={24} md={6}>
						<Form.Item name="is_returned" valuePropName="checked">
							<Checkbox>Is Product Returned?</Checkbox>
						</Form.Item>
					</Col> */}
				</Row>

				<Row gutter={15}>
					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="thumbnail" 
						rules={[  imagesList.length > 0 ? "" : {required: true, message: 'Field required!' }, ]}
						label={<><span> Thumbnail Images </span> 	<label  class="ant-form-item-required"><b style={{'color':'red'}}> &nbsp;( Please Use 170px * 170px Image to upload. )</b></label></>} 
							// <span style={{ color: 'red' }}>*</span>

						>
							{imagesList.length >0 && imagesList.map((item, index) => 
								item.urls ? <Avatar key={index} shape="square" size={150} src={item.urls } style={{margin:5}} /> :
								<Avatar key={index} shape="square" size={150} src={process.env.REACT_APP_ApiUrl+'/'+ item.url} style={{ margin: 5 }} />
							)}
						
							{imagesList.length > 0 ? <span><br /><Button onClick={() => setImagesList([])}>Remove</Button>&nbsp;&nbsp;</span> : ''}
							{imagesList.length !== 5 && <Button onClick={() => setVisible(true)}> Upload Images </Button>}
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={15}>
					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="gallary_images" 
					
						label={<span> Gallary Images </span>} >
							 <MultiImageInput
								images={galleryImageUriList}
								setImages={onUploadGallery}
								theme="light"
								allowCrop = {false}
    						/>
						</Form.Item>
					</Col>

					<Col  xs={24} sm={24} md={24}>
						<Form.Item name="video" 
					
						label={<span> Upload Video </span>} >
      						<VideoInput width={100} height={100}  videoFileData={videoFile} videoFile={(data) => setVideoFile(data) } />
						</Form.Item>

						{videoFileUploaded && ['', undefined, null].includes(videoFile)  && (
						<video
								className="VideoInput_video"
								width="100%"
								height="100px"
								controls
								src={`${baseUrl}/${videoFileUploaded}`}
								/>
							)}

					</Col>


					<Row gutter={24}>
						<Col  xs={24} sm={24} md={24}>
							<Form.Item  name="product_status" label="Status" rules={[{ required: true, message: 'Field required!', },]}  >
								<Select placeholder="Select Status">
										<Select.Option value="1"> Active </Select.Option>
										<Select.Option value="0"> Deavtive </Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

				</Row>
				<Form.Item className="mb-0">
					<Button onClick={cancelFun}>Cancel</Button>&nbsp;&nbsp;
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
				</Form.Item>
			</Form>
				{
			visible && 
			<UploadImages visible={visible} closeFun={() => setVisible(false)} 
			returnImg={
				val => 
				{ 
					setImagesList(val);
				}} 
				resetVal={imagesList} limit={5 - imagesList.length}  aspect={9/12}
			 />}

			{/* <CropImage visible={picModel} closeFun={() => setPicModel(false)} returnImg={getNewImage} resetVal={imageUrl} limit={1} aspect={9 / 12} /> */}

		</Card>




	)
};

export default connect(({ product, category, subcategory, global, loading }) => ({
	product: product,
	category: category,
	subcategory: subcategory,
	global: global
}))(AddEditProduct);