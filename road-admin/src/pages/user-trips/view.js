import React, { useState, useEffect, useRef, Fragment } from 'react';
import {  Card,  Descriptions } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'dva';
import styles from './style.less';

const dateFormat = 'YYYY/MM/DD';

const UserTripView = props => {

	

	useEffect(() => {
		getTrip()
	}, [])

	const getTrip = () => {

	}

	return (

		<Card title={<span><LeftOutlined onClick={() => props.history.push('/users')} /> User Details</span>} style={{ marginTop: "0" }}>
			<Descriptions size={'middle'} bordered>
				<Descriptions.Item label="Name">{detail.username}</Descriptions.Item>
				<Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
				<Descriptions.Item label="Is Email Verified">{detail.isEmailVerified ? 'true' : 'false'}</Descriptions.Item>
				<Descriptions.Item label="Phone">{detail.mobile_number}</Descriptions.Item>
				<Descriptions.Item label="Is Mobile Verified">{detail.isMobileVerified ? 'true' : 'false'}</Descriptions.Item>
				<Descriptions.Item label="Role">{detail.roles}</Descriptions.Item>
				<Descriptions.Item label="Profile Created On">{moment(detail.create).format(dateFormat)}</Descriptions.Item>
			</Descriptions>

		</Card>
	)
};

export default connect(({ users, global, loading }) => ({
	users: users,
	global: global
}))(UserTripView);