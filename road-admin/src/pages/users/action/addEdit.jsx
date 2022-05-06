import React, { useState, useEffect } from 'react';
import { Card, Form, Descriptions } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'dva';

const dateFormat = 'YYYY/MM/DD';

const AddEditUser = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	const [detail, setDetail] = useState({});


	useEffect(() => {
		let unmounted = false;
		window.scroll(0, 0);
		if (props.match && props.match.params.id) {
			DetailFun(props.match.params.id)
		} else {
			form.resetFields();
		}
		return () => { unmounted = true; }
	}, [dispatch])


	const DetailFun = (id) => {
		props.dispatch({ type: 'users/getDetail', payload: { _id: id, profile_id: id } });
	}

	useEffect(() => {
		let unmounted = false;
		if (props.match && props.match.params.id) {



			let userDetail = props?.users?.detail?.userLogin;
			setDetail(userDetail)
			// let detail = props.users.detail;
			// if (!unmounted && detail && detail.status) {
			// 	let data = detail.profile;
			// 	setDetail({
			// 		...data,
			// 		username: data.username,
			// 		email: data.email,
			// 		mobile_number: data.mobile_number,
			// 		isEmailVerified: data.isEmailVerified,
			// 		isMobileVerified: data.isMobileVerified,
			// 		roles: data.roles,
			// 	})
			// } 
		}
		return () => { unmounted = true; }
	}, [props.users])

	return (
	
		<Card title={<span><LeftOutlined onClick={() => props.history.push('/users')} /> User Details</span>} style={{ marginTop: "0" }}>
			<Descriptions size={'middle'} bordered>
				<Descriptions.Item label="Name">{detail?.name}</Descriptions.Item>
				<Descriptions.Item label="Email">{detail?.email}</Descriptions.Item>
				<Descriptions.Item label="Is Email Verified">{detail?.isEmailVerified ? 'true' : 'false'}</Descriptions.Item>
				<Descriptions.Item label="Is Mobile Verified">{detail?.isMobileVerified ? 'true' : 'false'}</Descriptions.Item>
				<Descriptions.Item label="Role">{detail?.roles}</Descriptions.Item>
				<Descriptions.Item label="Profile Created On">{moment(detail?.create).format(dateFormat)}</Descriptions.Item>
			</Descriptions>
		</Card>
	)
};

export default connect(({ users, global }) => ({
	users: users,
	global: global
}))(AddEditUser);