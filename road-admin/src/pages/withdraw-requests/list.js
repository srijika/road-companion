import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Badge, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddEdit from './action/addEdit';
import { getTitleImage } from '../../utils/functions';
import Moment from 'react-moment';
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

class WithdrawRequestList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			limit: 25, 
			current: 1, 
			sortBy: 'asc', 
			addModel: false, 
			inactive: false, 
			searchText: '', 
			loader: false, 
			detail: '', 
			count: 0, 
			Addcount: 0,
			listData: []
		}

		setTimeout(() => document.title = 'Withdraw Request List', 100);
		this.isUpdate = false;
	}
	
	componentDidMount() {
		this.ListFun();
		
	}

	ListFun = () => {
	
		this.props.dispatch({ type: 'withdrawrequests/withdrawList', payload: {} });
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		console.log(this.props);
		const resultAutos = this.props.withdrawrequests.list.filter((auto) => 
									auto.name.toLowerCase().includes(val.toLowerCase()) 
							)
		this.setState({ listData: resultAutos })
	}

	createCat = (val) => {
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
	}

	// deleteCars = id => {

	// 	//this.props.dispatch({ type: 'colors/deleteColor', payload: id });
	// }

	// getSnapshotBeforeUpdate(prevProps, prevState) {
    //     if ( this.props.withdrawRequests.delete) {
	// 		this.props.dispatch({ type: 'withdrawRequests/clearAction'});
    //         this.ListFun();
	// 		return true
    //     }
    //     return null;
    // }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
        }
    }

	render() {
		const { inactive, limit, searchText, addModel, detail } = this.state;
		const { withdrawrequests } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = withdrawrequests.list ? withdrawrequests.list : [];
			
		}

		const columns = [
			{
				title: <strong>User</strong>,
				dataIndex: 'user_id', render:(val,data)=>
				<>
					
					{data.user_id?.email}
					
				</>
			 },

			 {
				title: <strong>User Wallet Amount</strong>,
				dataIndex: 'user_id', render:(val,data)=>
				<>
					
					{data.user_id?.wallet_amount ? data.user_id?.wallet_amount : '0'}
					
				</>
			 },


			
			{
				title: <strong>Requested Amount</strong>,
				dataIndex: 'requested_amount'
			},

			{
				title: <strong>Status</strong>,
				dataIndex: 'status'
			},
			
			{
				title: <strong>Action</strong>,  align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					
					<Popconfirm title="Are you sure you want to pay?" onConfirm={e => { this.deleteCars(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
						<Button type="danger" >Pay</Button>
					</Popconfirm>
				</div>
			},
		];
		return (
			<div>
				<Apploader show={this.props.loading.global} />
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

			</div>

		);
	}
};

export default connect(({ withdrawrequests, loading }) => ({
	withdrawrequests, loading
}))(WithdrawRequestList);