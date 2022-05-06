import React from 'react';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row, Col, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import DrawerWrapper from 'antd/lib/drawer';
const { Search } = Input;
const { Text } = Typography;

class WalletAddCash extends React.Component {
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
			listData: [], 
			showModal: false
		}

		setTimeout(() => document.title = 'Car Brand List', 100,);
		this.isUpdate = false;
	}

	componentDidMount() {
		this.ListFun();
	}

	ListFun = () => {
		this.props.dispatch({ type: 'walletAddCash/dataList', payload: {} });
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



	render() {
		const { searchText } = this.state;
		const { walletAddCash } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = walletAddCash.list ? walletAddCash.list : [];
		}


		const columns = [
			{
				title: <strong>Email</strong>,
				dataIndex: 'email',
				render: (val, data) => <div>
					{data?.user_id?.email}
				</div>
			},
			{
				title: <strong>Amount</strong>,
				dataIndex: 'amount'
			},
			{
				title: <strong> Status </strong>,
				dataIndex: 'status',
				render: (val, data) => <div style={{ color: data.status === "pending" ? "red" : "green" }}> {data.status} </div>
			},
			{
				title: <strong>Action</strong>, align: 'center',
				render: (val, data) => <div onClick={() => { this.setState({ showModal: true }) }}>
					<Button type="success" > View </Button>
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


				<Modal
					title="Title"
					visible={this.state.showModal}
					onCancel={() => this.setState({ showModal: false })}
				>
					<p> This is a test </p>
				</Modal>


			</div>

		);
	}
};

export default connect(({ walletAddCash, loading }) => ({
	walletAddCash, loading
}))(WalletAddCash);