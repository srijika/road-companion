import React from 'react';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row, Col, Tabs, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import DrawerWrapper from 'antd/lib/drawer';
const { Search } = Input;
const { Text } = Typography;

class WithdrawRequestLists extends React.Component {
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

		setTimeout(() => document.title = 'Car Brand List', 100,);
		this.isUpdate = false;
	}

	componentDidMount() {
		this.ListFun();
	}

	ListFun = () => {
		this.props.dispatch({ type: 'withdrawRequest/dataList', payload: {} });
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.cars.list.filter((auto) =>
			auto.brand_name.toLowerCase().includes(val.toLowerCase())
		)
		this.setState({ listData: resultAutos })
	}



	makePayment = request_id => {
		let data = {
			request_id
		}
		this.props.dispatch({ type: 'withdrawRequest/sendDriverRequestPayment', payload: data });
	}

	render() {
		const {  searchText  } = this.state;
		const { withdrawRequest } = this.props;

		if (this.state.searchText == '') {
			this.state.listData = withdrawRequest.list ? withdrawRequest.list : [];
		}

		const columns = [
			{
				title: <strong>Name</strong>,
				dataIndex: 'name',
				render: (val, data) => <div>
					{data?.user_id?.name}
				</div>
			},
			{
				title: <strong>Email</strong>,
				dataIndex: 'email',
				render: (val, data) => <div>
					{data?.user_id?.email}
				</div>
			},
			{
				title: <strong>Requested Amount</strong>,
				dataIndex: 'requested_amount'
			},
			{
				title: <strong> Status </strong>, 
				dataIndex: 'status',
				render: (val, data) => <div style={{ color: data.status === "pending" ? "red" : "green" }}> {data.status} </div>					
			},
			{
				title: <strong>Action</strong>, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Popconfirm title="Are you sure you want to confirm this payment?" onConfirm={e => { this.makePayment(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
						<Button type="success" > Payment </Button>
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
					<Col>
						<Button type="primary" onClick={() => this.props.history.push('/car-brand/add')}>Add</Button>
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

export default connect(({  withdrawRequest, loading }) => ({
	withdrawRequest, loading
}))(WithdrawRequestLists);
