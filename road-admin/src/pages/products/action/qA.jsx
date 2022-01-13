import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Row, Col, Collapse, Card, Typography, Modal, Alert, Form, Input, Checkbox, Button, Space, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker, Avatar, message, InputNumber } from 'antd';
import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UploadImages from '../../../components/sharing/upload-images'
import CropImage from '../../../components/sharing/crop-image'
import TextEditor from '../../../components/sharing/text-editor'
import moment from 'moment';
import { connect } from 'dva';
import styles from './style.less';
import { getSubCatbyCategory } from '../../../services/api';
import MultiImageInput from 'react-multiple-image-input';
import HTMLDecoderEncoder from 'html-encoder-decoder';
const { Panel } = Collapse;
const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const baseUrl = process.env.REACT_APP_ApiUrl
const { confirm } = Modal;

const QAns = props => {
	const { dispatch, QAns } = props;
	const [qAnslist, setQAnslist] = useState([]);

	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		props.dispatch({ type: 'QAns/clear' });
		if (props.match.params.id) {
			ListFun(props.match.params.id);
		}else{
			setQAnslist([]);
		}
		return () => { unmounted = true; }
	}, [dispatch])

	const ListFun = (pId) => {
		props.dispatch({type: 'QAns/listQAns',  payload: {product_id: pId}});
	}


	useEffect(() => {
		let unmounted = false;
		if(props.QAns.list.length > 0){
			setQAnslist(props.QAns.list);
		}else{
			setQAnslist([]);
		}

		if(props.QAns.create){
			props.dispatch({ type: 'QAns/clear' });
			message.success('Answer updated...!');
			ListFun(props.match.params.id)
		}

		if(props.QAns.delete){
			props.dispatch({ type: 'QAns/clear' });
			message.success('Answer deleted...!');
			ListFun(props.match.params.id)
		}

		return () => { unmounted = true; }
	}, [props.QAns])

	const updateAns = (event, qId) => {
		let updateData = qAnslist.filter((x) => x._id == qId);
		let otherData = qAnslist.filter((x) => x._id != qId);
		updateData[0].answer = event.target.value;
		let final_data = [];
		final_data = otherData;
		final_data.push(updateData[0]);
		setQAnslist(final_data);
	}

	const onFinish = qId =>{
		let updateData = qAnslist.filter((x) => x._id == qId);
		let data = {
			_id: qId,
			question: updateData[0].question,
			answer: updateData[0].answer,
			user_id: updateData[0].user_id,
			product_id: updateData[0].product_id
		}
		props.dispatch({type: 'QAns/updateQAns',  payload: data });
	}

	const onDelete = qId =>{
		confirm({
			title: 'Do you Want to delete these items?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Yes',
			cancelText: 'No',
			onOk() { props.dispatch({type: 'QAns/deleteQAns',  payload: {_id:qId} }); },
			onCancel() { console.log('Cancel'); },
		});
	} 

	return (
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/products')} /> Questions & Answers</span>} style={{ marginTop: "0" }}>
			 { qAnslist.length > 0 ?	
			 <Collapse>
				{
				qAnslist.map((item, index) => {
					return ( <Panel header={item.question} key={index}>
						{
							<Row gutter={15}>
								<Col sm={24} md={12}>
									<Form.Item name="title" label="Ans" rules={[{ required: true, message: 'Field required!' },]}  >
										<Input placeholder="No Answer yet" defaultValue={item.answer} onChange={(e) => updateAns(e, item._id) } />
									</Form.Item>
								</Col>
								<Col sm={24} md={12} >
									<Button type="primary" className="btn-w25 btn-primary-light" onClick={() => onFinish(item._id)}>
										Save
									</Button>&nbsp;
									<Button type="danger" className="btn-w25 btn-primary-light" onClick={() => onDelete(item._id)}>
										Delete
									</Button>
								</Col>
							</Row>
						} 
					</Panel> );
				}) 
				
				} 
			</Collapse>
			:
				<p style={{color:"red"}}>No Question Found...!</p>
			}
		</Card>
	)
};

export default connect(({ QAns, loading }) => ({
	QAns:QAns,
	global: global
}))(QAns);