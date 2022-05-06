import React from 'react';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row, Col, Tabs, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
const { Search } = Input;
const { Text } = Typography;

class CarList extends React.Component {
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

		let searchval = { limit: this.state.limit, role: "USER" }
		this.props.dispatch({ type: 'cars/carList', payload: searchval });
	}


	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
	paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());


	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.cars.list.filter((auto) =>
			auto.brand_name.toLowerCase().includes(val.toLowerCase())
		)
		this.setState({ listData: resultAutos })
	}

	createCat = (val) => {
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
	}

	deleteCars = id => {
		this.props.dispatch({ type: 'cars/deleteCar', payload: id });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.cars.delete) {
			this.props.dispatch({ type: 'cars/clearAction' });
			this.ListFun();
			return true
		}
		return null;
	}

	render() {
		const {  searchText  } = this.state;
		const { cars } = this.props;

		if (this.state.searchText == '') {
			this.state.listData = cars.list ? cars.list : [];
		}

		const columns = [
			{
				title: <strong>Brand Name</strong>,
				dataIndex: 'brand_name'
			},
			{
				title: <strong>Car Type</strong>,
				dataIndex: 'type_id',
				render: (value, row) => {
					return <span>{value?.title}</span>
				}
			},
			{
				title: <strong>isActive</strong>, dataIndex: 'isActive',
				render: (value, row) => {
					return <span>{value === true ? "True" : "False"}</span>
				}
			},
			{
				title: <strong>Action</strong>, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Button type="primary" onClick={() => { this.props.history.push('/car-brand/edit/' + data._id) }}><EditOutlined /></Button>
					<Popconfirm title="Are you sure delete this car brand?" onConfirm={e => { this.deleteCars(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
						<Button type="danger" ><DeleteOutlined /></Button>
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
							onChange={this.paginationFun}
							rowKey={record => record._id}
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

export default connect(({ cars, loading }) => ({
	cars, loading
}))(CarList);