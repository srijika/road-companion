import React, { useState, useCallback, Fragment, useEffect, useRef } from 'react';
import { Button, Row, Col, Upload, Modal } from 'antd';
import {EyeOutlined} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { connect } from 'dva';

import styles from './index.less';

const UploadImages1 = props =>{
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
		let rData = [];
		fileList.map(item=> rData.push({file : item.originFileObj, urls:item.thumbUrl}))
		setDisableBtn(true)
		setCount(rData.count);

		if(props.Extra){rData['Extra'] = props.Extra};
		props.returnImg1(rData)
		props.closeFun();
		setFileList([])
		setCount(0);
		setDisableBtn(false)
	}
	
	const cancelFun=()=>{
		setDisableBtn(false)	
		props.closeFun();
	}
	
	useEffect(() => {
		let unmounted = false;
		if(props.resetVal.length===0){
			setFileList([])
		}
		return () => {
  	  unmounted = true;
      }
	}, [props.resetVal]); 
	
	const dummyUploadRequest = ({ file, onSuccess }) => {
		setTimeout(() => {
		  onSuccess("ok");
		}, 0);
	  };

	
	return <Modal key={2222} visible={props.visible} title="Upload Image's" okText="Upload" onCancel={cancelFun} onOk={onFinish} okButtonProps={{ disabled: disableBtn }}>
			<Upload
				customRequest={dummyUploadRequest}
				listType="picture-card"
				showUploadList={{showPreviewIcon:false}}
				fileList={fileList}
				onChange={onChange}
				onPreview={onPreview} >
				{fileList.length < (props.limit || 5) && '+ Upload'}
		  </Upload>
        </Modal>
		
}

//export default CropImage;
export default connect(({global }) => ({
  global: global,
}))(UploadImages1);