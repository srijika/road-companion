import React, { useState,useEffect,useRef, Fragment} from 'react';
import { Modal,Form, Button, Upload } from 'antd';
import { connect } from 'dva';
import { UploadOutlined } from '@ant-design/icons';
const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};

const UploadFile =props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [fileList, setfileList] = useState([])
	
	useEffect(() => {
		let unmounted = false;
		return () => {unmounted = true;}
    },[dispatch])
	
	
	useEffect(() => {
		let unmounted = false;		
		if(props.visible === false){ 
			form.resetFields();
			setfileList([]);
		}
		return () => {unmounted = true;}
    },[props.visible])
	
	
	const onFinish= val=>{
		props.returnData(val.file)
		console.log(props)	
	}
	
	
	const cancelFun = ()=>{
		form.resetFields();
		setfileList([]);
		props.closeModel()
	}
	
	const Uploadprops ={ name: 'file', action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', 
		headers: {  authorization: 'authorization-text',}, onChange(info) {
		
			if (info.file.status !== 'uploading') {
			  console.log(info.file, info.fileList);
			}
			setfileList(info.fileList);
		  },
		};
	const uploadButton = (
      <Button> <UploadOutlined /> Click to upload </Button>
    );
return (
	<Modal visible={props.visible} title={'Upload File'} onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
				<Button type="primary" className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>{'Upload File'}</Button>
			</Fragment>} >
		<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			<Form.Item	name="file"	label="Upload Excel File" 
				rules={[{ required: true, message: 'Field required!' },]} 
			  >
				<Upload {...Uploadprops} fileList={fileList} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" >
					{fileList.length >= 1 ? null : uploadButton}				  
				</Upload>
			  </Form.Item>
		</Form>
	</Modal>
)};

export default connect(({  global }) => ({
  global: global
}))(UploadFile);