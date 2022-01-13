import React, { useState,useEffect,useRef, Fragment} from 'react';
import {Empty, Modal, Card, Typography, Alert,Form,Input, Checkbox,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import jwt_decode from "jwt-decode";

// import styles from './style.less';

const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: {xs: { span: 24, },  sm: { span: 24, },}};

const RefundOrder = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [catlist, setCatlist] = useState([])
	const [count, setCount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)
	
	useEffect(() => {
    })
    
    useEffect(() => {
		let unmounted = false;
		let data = props.detail;
        console.log("loading------------------")
        console.log(props)
		return () => {unmounted = true;}
    },[props.visible])
	
	const onFinish=( val, id, p_id)=>{
		console.log("on submit")
		console.log('ddd',props, 'dsdd',val)
        setBtnDis(true);
        let product_id = new Array(p_id);
    }
    
	const cancelFun = ()=>{
		if(!props.detail)
			form.resetFields();
		props.closeModel()
	}
return (
	<Modal visible={props.visible} title={'Why do you want to refund?'} onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
                 {/* <Button onClick={(event) =>data._id, this.refundOrder(data._id, data?.product?.map((product=>(product.product.id))))} style={{ marginBottom:'5px', textAlign:'center', width:'135px' , marginRight:'0px' }} type="danger">Refund Order</Button> */}
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>{'Refund Order'}</Button>
			</Fragment>} >
		<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
			<Form.Item name="description" rules={[{ required: true, message: 'This field is required!' }]} className="mb-0">
				<TextArea placeholder="Description" />
			</Form.Item>
		</Form>
		
	</Modal>
)};

export default connect(({ orders, global, loading }) => ({
  orders: orders,
  global: global
}))(RefundOrder);