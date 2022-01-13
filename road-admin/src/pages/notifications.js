import React, {useState, Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../components/loader/loader'
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Form, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Badge, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
const { Search } = Input;
const { TextArea } = Input;
const { Text } = Typography;


class Notifications extends React.Component {
// const Notifications = (props) => {
	constructor(props) {
		super(props);
		this.state = {
			listData:[],
			searchText:'',
			isModalVisible:false,
			notification_type:'',
			message:''
		}
	}

	componentDidMount() {
		this.ListFun();
	}
	
	ListFun = () => {
		this.props.dispatch({ type: 'notification/notifList', payload: {limit:10,page:0} });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.notification.add && this.props.notification.add.message) {
			
			this.props.dispatch({ type: 'notification/clearAction'}).then(()=>{
				this.ListFun();
			});
			return true
        }
        if (this.props.notification.delete && this.props.notification.delete.message) {
			this.props.dispatch({ type: 'notification/clearAction'}).then(()=>{
				this.ListFun();
			});
			return true
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
        }
    }
	
	deleteNotif = id => {
		this.props.dispatch({ type: 'notification/deleteNotif', payload: {id:id} });
	}

	handleOk = () =>{
		this.setState({isModalVisible:false})
		let val = { notification_type:this.state.notification_type, message:this.state.message }
		this.props.dispatch({ type: 'notification/createNotif', payload: val });
	}

	handleCancel = () =>{
		this.setState({isModalVisible:false})
	}

	updateType = (event) =>{
		this.setState({notification_type:event.target.value})
	}

	updateMessage = (event) =>{
		this.setState({message:event.target.value})
	}

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.notification.list.filter((auto) => 
									auto.notification_type.toLowerCase().includes(val.toLowerCase()) || 
									auto.message.toLowerCase().includes(val.toLowerCase())
							)
		this.setState({ listData: resultAutos })
	}

	render() {
		const { inactive, limit, searchText, addModel, detail } = this.state;
		const { notification } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = notification.list ? notification.list : [];
		}
		
		const columns = [
			{
				title: <strong>Type</strong>,
				dataIndex: 'notification_type'
			},
			{
				title: <strong>Message </strong>,
				dataIndex: 'message'
			},
			{
				title: <strong>Action</strong>, width: 100, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Popconfirm title="Are you sure delete this coupon?" onConfirm={e => { this.deleteNotif(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
						<Button type="danger" ><DeleteOutlined /></Button>
					</Popconfirm>
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
					{/* <Col>
						<Button type="primary" onClick={() => this.setState({isModalVisible:true}) }>Add</Button>
					</Col> */}
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
}))(Notifications);