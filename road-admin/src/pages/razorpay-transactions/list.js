import React, {useState, Component, useEffect } from 'react';
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Form, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Badge, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, FundViewOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;
const { TextArea } = Input;
const { Text } = Typography;

const baseUrl = process.env.REACT_APP_ApiUrl;


class RazorpayTransactions extends React.Component {
// const Notifications = (props) => {
	constructor(props) {
		super(props);
		this.state = {
			listData:[],
			searchText:'',
		}
	}

	componentDidMount() {
		this.ListFun();
	}
	
	ListFun = async () => {

    let user_data = JSON.parse(localStorage.getItem('user'))

    if(user_data != undefined && user_data != "" && user_data != null) {
        if(user_data.role === "ADMIN") {  
          console.log(user_data);
          const res = await axios.post(`${baseUrl}/get/razorpay/transactions`, { user_id: user_data._id, role: user_data.role });
          console.log(res.data.payment_details);
          this.setState({
            listData: res.data.payment_details
          })
        }
    }
	}

	

	render() {
		const { searchText } = this.state;
    
    
		// if (this.state.searchText == '') {
		// 	this.state.listData = notification.list ? notification.list : [];
		// }
		
		const columns = [
			{
				title: <strong>Order id</strong>,
				dataIndex: 'order_id'
			},
			{
				title: <strong>Amount </strong>,
				dataIndex: 'amount', 
				render: (val, data) => {
					return (
						<div>  
							{console.log('val.amount')}
							{console.log(val)}
							{val.substring(0, val.length-2)} </div>
					)
				}
      		},
      {
				title: <strong> Razorpay payment id </strong>,
				dataIndex: 'razorpay_payment_id'
      },
      {
				title: <strong>Razorpay order id </strong>,
				dataIndex: 'razorpay_order_id'
			},
			{
				title: <strong>Action</strong>, width: 100, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>

						
					<Button type="" onClick={ () => { this.props.history.push(`/razorpay-transaction/detail/${val._id}`); } }>  <FundViewOutlined /> </Button>
          			{/* <button> <FundViewOutlined /> </button>  */}
				</div>
			},
		];


		

		return (
			<div>
				{/* <Apploader show={this.props.loading.global} /> */}
				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					<Col>
						<Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText} />
					</Col>
				</Row>

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							rowKey={record => record._id}
							onRow={(record, rowIndex) => {
								return {
									// onClick: event => this.setState({ addModel: true, detail: record })
								};
							}}
							pagination={{
								position: ['bottomLeft'],
								showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
								responsive: true,
								onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
								pageSizeOptions: ['25', '50', '100', '250', '500'],
							}}
						/>
					</Card>
				</div>
				<Modal title="Create Notification" visible={this.state.isModalVisible} onOk={() => this.handleOk()} onCancel={() => this.handleCancel()}>
						<div>
							Type:<br/>
							<TextArea onChange={(e)=> this.updateType(e) }/>
						</div>
						<div>
							Message:<br/>
							<TextArea onChange={(e)=> this.updateMessage(e) }/>
						</div>
				</Modal>
			</div>

		);
	}
};

export default connect(({ notification, loading}) => ({
	notification, loading
}))(RazorpayTransactions);