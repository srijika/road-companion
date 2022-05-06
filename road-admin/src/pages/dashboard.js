import React, { useState, useEffect } from 'react';
import Apploader from './../components/loader/loader'
import { connect } from 'dva';
import { Row, Col, Card, Descriptions, Statistic, Collapse } from 'antd';
const { Panel } = Collapse;

const Dashboard = (props) => {

	const { dispatch } = props;
	const [details, setDetails] = useState([{}])
	const [role, setRole] = useState('')
	const [userId, setUserId] = useState('')
	const [detailData, setDetailData] = useState({})



	useEffect(() => {

		const arr = [1,2,3,4,5];
		const newArr = arr.map((item) => {
			return item * 2;
		})

		console.log('arr is', arr)
		console.log('new Arr is', newArr)

	}, [])




	useEffect(() => {

		let unmounted = false;
		setTimeout(() => document.title = 'Dashboard', 100);
		getDashbordDetail(props.countData);
		setRole(localStorage.getItem('role'))
		setUserId(localStorage.getItem('userId'))
		return () => {
			unmounted = true;
		}
	}, [dispatch])

	const getDashbordDetail = async (id) => {
		let _id = localStorage.getItem('userId');
		dispatch({ type: 'account/getDashbordDetail', payload: { start_date: "", user_id: _id }, });
	}

	useEffect(() => {
		let detail = props?.account?.dashborddetail;
		setDetails(detail?.countData)
	
		setDetailData(detail)


	}, [props.account])


	return (


		<div>
			<Apploader show={props.loading.global} />
			<Row gutter={15}>
				<Col xs={{ span: 24 }} sm={24} md={24}>
					<Collapse defaultActiveKey={['']}>
						<Panel header={role === "ADMIN" ? "Admin Info" : "Seller Info"} key="1">
							<Descriptions>
								<Descriptions.Item label="Name">{detailData?.countData && detailData.countData.get_UserInfo.username || ''}</Descriptions.Item>
								<Descriptions.Item label="Mobile Number">{detailData?.countData && detailData.countData.get_UserInfo.mobile_number || ''}</Descriptions.Item>
								<Descriptions.Item label="Email">{detailData?.countData && detailData.countData.get_UserInfo.email || ''}</Descriptions.Item>
								<Descriptions.Item label="Roles">{detailData?.countData && detailData.countData.get_UserInfo.roles || ''}</Descriptions.Item>
							</Descriptions>
						</Panel>
					</Collapse>
					<br />
				</Col>
			</Row>
			<Row gutter={15} className="mobile_dashboard">
				{role == 'ADMIN' ?
					<Col xs={{ span: 12 }} sm={12} md={8}>
						<Card><Statistic title="Total Users" value={details && details.GetTotalUsers} /></Card><br />
					</Col> : ''}

			</Row>



		</div>
	);
};

export default connect(({ account, loading }) => ({
	loading, account
}))(Dashboard);


const scale = [{ dataKey: 'value', min: 0, }, { dataKey: 'year', min: 0, max: 1, }];
const data = [
	{ year: '1991', value: 3 },
	{ year: '1992', value: 4 },
	{ year: '1993', value: 3.5 },
	{ year: '1994', value: 5 },
	{ year: '1995', value: 4.9 },
	{ year: '1996', value: 6 },
	{ year: '1997', value: 7 },
	{ year: '1998', value: 9 },
	{ year: '1999', value: 13 },
];



const label = {
	textStyle: {
		fill: '#aaaaaa'
	}
}

const labelFormat = {
	textStyle: {
		fill: '#aaaaaa'
	},
	formatter: function formatter(text) {
		return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	}
}

const tickLine = {
	alignWithLabel: false,
	length: 0
}

const title = {
	offset: 70
}

const style = {
	text: {
		fontSize: 13
	}
}
const oriData = [
	{ type: '1', value: 34000 },
	{ type: '2', value: 25000 },
	{ type: '3', value: 11000 },
	{ type: '4', value: 9000 },
	{ type: '5', value: 7000 },
	{ type: '6', value: 6000 },
	{ type: '7', value: 4800 },
	{ type: '8', value: 500 }
];