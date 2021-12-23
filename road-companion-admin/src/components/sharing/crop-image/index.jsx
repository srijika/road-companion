import React, { useState, useCallback, Fragment, useEffect, useRef } from 'react';
import { Button, Row, Col, Upload, Modal } from 'antd';
import ImgCrop from 'antd-img-crop';
import { connect } from 'dva';

import styles from './index.less';

const CropImage = props =>{
	const [disableBtn, setDisableBtn] = useState(false);
	const [count, setCount] = useState(0)
	const [fileList, setFileList] = useState([])
	const inputRef = useRef();
	const {dispatch} = props;
	
	useEffect(() => {
		let unmounted = false;
		return () => {unmounted = true; }
    },[props])
	
	const onChange = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	  };

	const onPreview = async file => {
		let src = file.url;
		if (!src) {
		  src = await new Promise(resolve => {
			const reader = new FileReader();
			reader.readAsDataURL(file.originFileObj);
			reader.onload = () => resolve(reader.result);
		  });
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow.document.write(image.outerHTML);
	};
	
	const onFinish=()=>{
		setDisableBtn(true)	
		let list = [];
		fileList.map(item=> list.push({image:item.originFileObj, view:item.thumbUrl}))
		dispatch({type: 'global/uploadFileSingle',  payload: list});
	}
	
	const cancelFun=()=>{
		setDisableBtn(false);
		props.closeFun();
	}
	
	const dummyUploadRequest = ({ file, onSuccess }) => {
		setTimeout(() => {
		  onSuccess("ok");
		}, 0);
	  };

	useEffect(() => {
		let unmounted = false;
		if(props.resetVal && props.resetVal.length===0){
			setFileList([])
		}
		return () => {
  	  unmounted = true;
      }
	}, [props.resetVal]); 
	
	useEffect(() => {
		let unmounted = false;
		let upload = props.global.uploadsingle;
		if(!unmounted && 0 > count && (upload.files.length >0 || upload.status === "done")){
		  setCount(0);
		  setDisableBtn(false)
		  setFileList([])
		  props.returnImg({urls:upload.files, file: upload.file});
		}else if(!unmounted && 0 > count && upload.status !== "done"){
		  setDisableBtn(false)
		  setCount(0);
		}
		return () => {
			unmounted = true;
		}
    },[props.global.uploadsingle])
	
	
	return <Modal visible={props.visible} title="Upload Image's" okText="Upload" onCancel={cancelFun} onOk={onFinish} okButtonProps={{ disabled: disableBtn }}>
      
		  <Upload
			customRequest={dummyUploadRequest}
			listType="picture-card"
			fileList={fileList}
			onChange={onChange}
			onPreview={onPreview}
		  >
			{fileList.length < (props.limit || 1) && '+ Upload'}
		  </Upload>
	
        </Modal>
		
}

//export default CropImage;
export default connect(({global }) => ({
  global: global,
}))(CropImage);