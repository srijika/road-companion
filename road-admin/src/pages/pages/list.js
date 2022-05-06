import React from 'react';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row, Col,  Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
const { Search } = Input;
const { Text } = Typography;

class PagesList extends React.Component {
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

		setTimeout(() => document.title = 'Page List', 100,);
		this.isUpdate = false;
	}

	componentDidMount() {
		this.ListFun();

	}



	ListFun = () => {
		
		// let searchval = { limit: this.state.limit, role: "USER" }
		let searchval = { page: this.state.current - 1, limit: this.state.limit, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy }
		this.props.dispatch({ type: 'pages/pagesList', payload: searchval });
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
	// paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());
	

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.pages.list.filter((auto) =>
			auto.title.toLowerCase().includes(val.toLowerCase()) ||
			auto.description.toLowerCase().includes(val.toLowerCase())
		)
		this.setState({ listData: resultAutos })
	}

	createCat = (val) => {
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
	}

	deletePages = id => {
		this.props.dispatch({ type: 'pages/deletePages', payload: id });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.pages.delete) {
			this.props.dispatch({ type: 'pages/clearAction' });
			this.ListFun();
			return true
		}
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {
			this.ListFun();
		}
	}

	render() {
		const {  searchText, } = this.state;
		const { pages } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = pages.list ? pages.list : [];
		}

		const columns = [
			{
				title: <strong>Title</strong>,
				dataIndex: 'title'
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
					<Button type="primary" onClick={() => { this.props.history.push('/pages/edit/' + data.slug) }}><EditOutlined /></Button>
					<Popconfirm title="Are you sure delete this page?" onConfirm={e => { this.deletePages(data.slug); e.stopPropagation() }} okText="Yes" cancelText="No" >
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
						<Button type="primary" onClick={() => this.props.history.push('/pages/add')}>Add</Button>
					</Col>
				</Row>

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							rowKey={record => record._id}
							onChange={this.paginationFun}
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

export default connect(({ pages, loading }) => ({
	pages, loading
}))(PagesList);