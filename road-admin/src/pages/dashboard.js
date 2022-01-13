// import React, {useState, Component, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Chart, Tooltip, Axis, Line, Point, Interval, Guide  } from 'viser-react';
// import Apploader from './../components/loader/loader'
// import { connect } from 'dva';
// import {Row, Col, Form, Input, Button, Checkbox, Card, Descriptions, Statistic, Collapse } from 'antd';
// import { UserOutlined, LikeOutlined, ArrowUpOutlined, ArrowDownOutlined  } from '@ant-design/icons';
// const { Panel } = Collapse;

// // const Iguide:any = Guide;

// const Dashboard = (props) => {
// 	const [count, setCount] = useState(0)
// 	const [role, setRole] = useState('')
// 	const [userId, setUserId] = useState('')
// 	const [viewGraph, setViewGraph] = useState(false)
// 	const [detailData, setDetailData] = useState({})
// 	const [countData, setCountData] = useState({})
// 	const [saleOrderData, setSaleOrderData] = useState({})
// 	const [returnOrderData, setreturnOrderData] = useState({})
// 	const { dispatch } = props;
	
// 	useEffect(() => {
// 		let unmounted = false;
// 		setTimeout(()=>document.title = 'Dashboard', 100);
// 		setViewGraph(true)
// 		setRole(localStorage.getItem('role'))
// 		setUserId(localStorage.getItem('userId'))
// 		getDashbordDetail()
// 		return () => {
// 			unmounted = true;
// 		}
//     },[dispatch])
	
// 	const getDashbordDetail = async (id) => {
// 		dispatch({ type: 'account/getDashbordDetail',  payload: { start_date:"" },});
// 	}
	
// 	useEffect(() => {
// 		let unmounted = false;
// 		let detail = props.account.dashborddetail;
// 		if(!unmounted && detail.count > count && detail.status){
// 			setCount(detail.count);
// 			setDetailData(detail.countData.get_UserInfo);
// 			setCountData(detail.countData);
// 			let allOrderSaleData = [];
// 			Object.keys(detail.allOrderSaleData).forEach((key)=>{
// 				let val = detail.allOrderSaleData[key];
// 				allOrderSaleData.push({ year: key, value: val });
// 			})

// 			let returnOrderData = [];
// 			Object.keys(detail.returnOrderData).forEach((key)=>{
// 				let val = detail.returnOrderData[key];
// 				returnOrderData.push({ year: key, value: val });
// 			})

// 			setSaleOrderData(allOrderSaleData);
// 			setreturnOrderData(returnOrderData);
// 		}
// 		return () => {
// 			unmounted = true;
// 		}
//     },[props.account])
	  
	  
//   return (
	

// 	<div>
// 		<Apploader show={props.loading.global}/>
// 		<Row gutter={15}>
// 			<Col xs={{ span: 24 }} sm={24} md={24}>
// 			<Collapse defaultActiveKey={['']}>
// 				<Panel header={role === "ADMIN"?"Admin Info":"Seller Info"} key="1">
// 				  <Descriptions>
// 					<Descriptions.Item label="Name">{detailData.username || ''}</Descriptions.Item>
// 					<Descriptions.Item label="Mobile Number">{detailData.mobile_number || ''}</Descriptions.Item>
// 					<Descriptions.Item label="Email">{detailData.email || ''}</Descriptions.Item>
// 					<Descriptions.Item label="Roles">{detailData.roles || ''}</Descriptions.Item>
// 				  </Descriptions>
// 				</Panel>
// 			  </Collapse>
// 				<br/>
// 			</Col>
// 		</Row> 
// 		<Row gutter={15} className="mobile_dashboard">
// 			{role == 'ADMIN' ? 
// 				<Col xs={{ span: 12 }} sm={12} md={8} >
// 					<Card><Statistic title="Active Users" value={countData.get_Total_Active_Users} /></Card><br/>
// 				</Col>: '' }
// 			{role == 'ADMIN' ? 
// 				<Col xs={{ span: 12 }} sm={12} md={8}>
// 					<Card><Statistic title="Visitor" value={countData.get_Total_Visitor}/></Card><br/>
// 				</Col>: '' }
// 			{role == 'ADMIN' ? 
// 				<Col xs={{ span: 12 }} sm={12} md={8}>
// 					<Card><Statistic title="Feedback" value={countData.get_Total_Feedback} prefix={<LikeOutlined />} /></Card><br/>
// 				</Col>: '' }
// 			{role == 'ADMIN' ? 
// 				<Col xs={{ span: 12 }} sm={12} md={8}>
// 					<Card><Statistic title="Total Seller" value={countData.get_Total_Seller} /></Card><br/>
// 				</Col>: '' }
// 			{role == 'ADMIN' ? 
// 				<Col xs={{ span: 12 }} sm={12} md={8}>
// 					<Card><Statistic title="Total Users" value={countData.get_Total_Users} /></Card><br/>
// 				</Col>: '' }

// 			<Col xs={{ span: 12 }} md={8}>
// 				<Card><Statistic title="Total Product" value={countData.GetTotalProducts} /></Card><br/>
// 			</Col>
// 			<Col xs={{ span: 12 }} md={8}>
// 				<Card><Statistic title="Total Order" value={countData.get_Total_Orders} /></Card><br/>
// 			</Col>
// 			<Col xs={{ span: 12 }} md={8}>
// 				<Card><Statistic title="Total Cancel Order" value={countData.get_Cancel_Orders} /></Card><br/>
// 			</Col>
// 			<Col xs={{ span: 12 }}  md={8}>
// 				<Card><Statistic title="Total Refund Order" value={countData.get_Total_Refund_Orders} /></Card><br/>
// 			</Col>
			
// 			<Col xs={{ span: 12 }} xs={{ span: 12 }}  md={8}>
// 				<Card>
// 				  <Statistic
// 					title="Today Sale"
// 					value={countData.get_ToDay_Sale}
// 					precision={2}
// 					valueStyle={{ color: '#3f8600' }}
// 					prefix={<ArrowUpOutlined />}
// 					suffix="%"
// 				  />
// 				</Card><br/>
// 			</Col>
// 			<Col xs={{ span: 12 }}  md={8}>
// 				<Card>
// 				  <Statistic
// 					title="Today Return Products"
// 					value={countData.get_ToDay_Return_Order}
// 					precision={2}
// 					valueStyle={{ color: '#cf1322' }}
// 					prefix={<ArrowDownOutlined />}
// 					suffix="%"
// 				  />
// 				</Card><br/>
// 			</Col>
// 		</Row>
		
// 		<Row gutter={15}>
// 			<Col xs={{ span: 24 }} sm={24} md={12}>
// 				{/* <Card title="Sale Order Chart">
// 				{viewGraph &&
// 					<Chart forceFit height={400} data={saleOrderData} scale={[{
// 						dataKey:'value',
// 						tickCount: 5,
// 						alias: 'Sale Order'
// 					}]}>
// 						<Tooltip />
// 						<Axis />
// 						<Line position="year*value" />
// 						<Point position="year*value" shape="circle"/>
// 					</Chart>}
// 				</Card> */}
				
// 				<br/>
// 			</Col>
// 			<Col xs={{ span: 24 }} sm={24} md={12}>
// 				{/* <Card title="Return Order Chart">
// 				{viewGraph &&
// 					<Chart forceFit height={400} data={returnOrderData} scale={[{
// 						dataKey:'value',
// 						tickCount: 5,
// 						alias: 'Return Order'
// 					}]}>
// 						<Tooltip />
// 						<Axis />
// 						<Line position="year*value" />
// 						<Point position="year*value" shape="circle"/>
// 					</Chart>}
			
// 				</Card> */}
// 				<br/>
// 			</Col>
// 		</Row>
		
		
// 	</div>
//   );
// };

// export default connect(({account, loading}) => ({
// 	loading, account
// }))(Dashboard);


// const scale = [{  dataKey: 'value',  min: 0,},{ dataKey: 'year', min: 0, max: 1,}];
// const data = [
//   { year: '1991', value: 3 },
//   { year: '1992', value: 4 },
//   { year: '1993', value: 3.5 },
//   { year: '1994', value: 5 },
//   { year: '1995', value: 4.9 },
//   { year: '1996', value: 6 },
//   { year: '1997', value: 7 },
//   { year: '1998', value: 9 },
//   { year: '1999', value: 13 },
// ];



// const label = {
//   textStyle: {
//     fill: '#aaaaaa'
//   }
// }

// const labelFormat = {
//   textStyle: {
//     fill: '#aaaaaa'
//   },  
//   formatter: function formatter(text) {
//     return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
//   }
// }

// const tickLine = {
//   alignWithLabel: false,
//   length: 0
// }

// const title = {
//   offset: 70
// }

// const style = {
//   text: {
//     fontSize: 13
//   }
// }
// const oriData = [
// 	{ type: '1', value: 34000}, 
// 	{ type: '2', value: 25000}, 
// 	{ type: '3', value: 11000}, 
// 	{ type: '4', value: 9000}, 
// 	{ type: '5', value: 7000}, 
// 	{ type: '6', value: 6000}, 
// 	{ type: '7', value: 4800}, 
// 	{ type: '8',  value: 500}
// ];

import React, {useState, Component, useEffect } from 'react';
import Apploader from './../components/loader/loader'
import { connect } from 'dva';
import {Row, Col, Form, Input, Button, Checkbox, Card, Descriptions, Statistic, Collapse } from 'antd';
const { Panel } = Collapse;

const Dashboard = (props) => {
	
	const { dispatch } = props;
	const [details, setDetails] = useState([{}])
	const [role, setRole] = useState('')
	const [userId, setUserId] = useState('')
	const [countData, setCountData] = useState({})
	const [detailData, setDetailData] = useState({})


	
	
	useEffect(() => {
		console.log(props)
		let unmounted = false;
		setTimeout(()=>document.title = 'Dashboard', 100);
getDashbordDetail(props.countData);
setRole(localStorage.getItem('role'))
		setUserId(localStorage.getItem('userId'))
		return () => {
			unmounted = true;
		}
    },[dispatch])
	
	const getDashbordDetail = async (id) => {
let _id = localStorage.getItem('userId');
console.log("_id" , _id)

		dispatch({ type: 'account/getDashbordDetail',  payload: { start_date:"" , user_id:_id },});
	}
	
	useEffect(() => {
		let detail = props.account.dashborddetail;
		setDetails(detail.countData)
		console.log(detail.countData)
		setDetailData(detail )


	},[props.account])
	  

	console.log( detailData.countData && detailData.countData.get_UserInfo)
	  
  return (
	

	<div>
		<Apploader show={props.loading.global}/>
		<Row gutter={15}>
			<Col xs={{ span: 24 }} sm={24} md={24}>
			<Collapse defaultActiveKey={['']}>
				<Panel header={role === "ADMIN"?"Admin Info":"Seller Info"} key="1">
				  <Descriptions>
					<Descriptions.Item label="Name">{detailData.countData && detailData.countData.get_UserInfo.username || ''}</Descriptions.Item>
					<Descriptions.Item label="Mobile Number">{detailData.countData && detailData.countData.get_UserInfo.mobile_number || ''}</Descriptions.Item>
					<Descriptions.Item label="Email">{detailData.countData && detailData.countData.get_UserInfo.email || ''}</Descriptions.Item>
					<Descriptions.Item label="Roles">{detailData.countData && detailData.countData.get_UserInfo.roles || ''}</Descriptions.Item>
				  </Descriptions>
				</Panel>
			  </Collapse>
				<br/>
			</Col>
		</Row> 
		<Row gutter={15} className="mobile_dashboard">
		{role == 'ADMIN' ? 
				<Col xs={{ span: 12 }} sm={12} md={8}>
					<Card><Statistic title="Total Users" value={details && details.GetTotalUsers} /></Card><br/>
				</Col>: '' }

			{/* {role == 'ADMIN' ? 
				<Col xs={{ span: 12 }} sm={12} md={8} >
					<Card><Statistic title="Active Users" value={countData.get_Total_Active_Users} /></Card><br/>
				</Col>: '' } */}
			{/* {role == 'ADMIN' ? 
				<Col xs={{ span: 12 }} sm={12} md={8}>
					<Card><Statistic title="Visitor" value={countData.get_Total_Visitor}/></Card><br/>
				</Col>: '' }
			{role == 'ADMIN' ? 
				<Col xs={{ span: 12 }} sm={12} md={8}>
					<Card><Statistic title="Feedback" value={countData.get_Total_Feedback} prefix={<LikeOutlined />} /></Card><br/>
				</Col>: '' }
			{role == 'ADMIN' ? 
				<Col xs={{ span: 12 }} sm={12} md={8}>
					<Card><Statistic title="Total Seller" value={countData.get_Total_Seller} /></Card><br/>
				</Col>: '' }
		
			<Col xs={{ span: 12 }} md={8}>
				<Card><Statistic title="Total Product" value={countData.GetTotalProducts} /></Card><br/>
			</Col>
			<Col xs={{ span: 12 }} md={8}>
				<Card><Statistic title="Total Order" value={countData.get_Total_Orders} /></Card><br/>
			</Col>
			<Col xs={{ span: 12 }} md={8}>
				<Card><Statistic title="Total Cancel Order" value={countData.get_Cancel_Orders} /></Card><br/>
			</Col>
			<Col xs={{ span: 12 }}  md={8}>
				<Card><Statistic title="Total Refund Order" value={countData.get_Total_Refund_Orders} /></Card><br/>
			</Col>
			
			<Col xs={{ span: 12 }} xs={{ span: 12 }}  md={8}>
				<Card>
				  <Statistic
					title="Today Sale"
					value={countData.get_ToDay_Sale}
					precision={2}
					valueStyle={{ color: '#3f8600' }}
					prefix={<ArrowUpOutlined />}
					suffix="%"
				  />
				</Card><br/>
			</Col>
			<Col xs={{ span: 12 }}  md={8}>
				<Card>
				  <Statistic
					title="Today Return Products"
					value={countData.get_ToDay_Return_Order}
					precision={2}
					valueStyle={{ color: '#cf1322' }}
					prefix={<ArrowDownOutlined />}
					suffix="%"
				  />
				</Card><br/>
			</Col> */}
		</Row>
		
	
		
	</div>
  );
};

export default connect(({account, loading}) => ({
	loading, account
}))(Dashboard);


const scale = [{  dataKey: 'value',  min: 0,},{ dataKey: 'year', min: 0, max: 1,}];
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
	{ type: '1', value: 34000}, 
	{ type: '2', value: 25000}, 
	{ type: '3', value: 11000}, 
	{ type: '4', value: 9000}, 
	{ type: '5', value: 7000}, 
	{ type: '6', value: 6000}, 
	{ type: '7', value: 4800}, 
	{ type: '8',  value: 500}
];