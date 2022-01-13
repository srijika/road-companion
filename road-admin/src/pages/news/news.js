import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import Moment from 'react-moment';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm, message } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import fetch from 'dva/fetch';
import { Select } from 'antd';
import { resendOTPTOUser } from '../../services/api';
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

const baseUrl = process.env.REACT_APP_ApiUrl
class News extends React.Component {
	constructor(props) {
		super(props);
		this.state = { count: 0, Addcount: 0, limit: 50, current: 1, sortBy: 'asc', inactive: false, searchText: '', loader: false, detail: '', 
		fileModel: false, listData: [],
		modalEventData: [],
		isModalVisible: false }
		setTimeout(() => document.title = 'News List', 100);
	}
	componentDidMount() {
		this.ListFun();
		this.props.dispatch({ type: 'news/clear' });
	}

	ListFun = () => {
        const user = jwt_decode(localStorage.getItem('token'));
		if (user.role === "ADMIN") {
			let search = 'page=' + (this.state.current - 1) + "&limit=" + this.state.limit + "&inactive=" + this.state.inactive + "&searchText=" + this.state.searchText + "&sortBy=" + this.state.sortBy;
			localStorage.setItem('newsSearch', JSON.stringify(this.state));
			let searchval = { page: this.state.current - 1, limit: this.state.limit, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy }
			this.props.dispatch({ type: 'news/newsList', payload: searchval, });
		} else {
			let search = 'page=' + (this.state.current - 1) + "&limit=" + this.state.limit + "&inactive=" + this.state.inactive + "&searchText=" + this.state.searchText + "&sortBy=" + this.state.sortBy;
			localStorage.setItem('newsSearch', JSON.stringify(this.state))

			let searchval = { page: this.state.current - 1, limit: this.state.limit, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy, _id: user._id }
			this.props.dispatch({ type: 'news/newsList', payload: searchval, });
		}

	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
	paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val
		const resultAutos = this.props.news.list.filter((auto) => auto.title.toLowerCase().includes(val.toLowerCase()))

		this.setState({ listData: resultAutos })
	}

	deleteItem = (id) => {
		let that = this;
		confirm({
			title: 'Do you Want to delete these items?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Yes',
			cancelText: 'No',
			onOk() { return that.deleteItemFun(id) },
			onCancel() { console.log('Cancel'); },
		});
	}

	viewItem = (data) =>{
		this.setState({ modalEventData: data, isModalVisible: true });
		console.log("viewItem : ", data);
	}

	deleteItemFun = (id) => {
		this.props.dispatch({ type: 'news/deleteNewsList', payload: { id: id }, });
		this.setState({ loader: false })
	}

	handleModalCancel = () =>{
		this.setState({ isModalVisible: false });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.news.del && this.props.news.del.count > this.state.count && this.props.news.del.data.status) {
			this.props.dispatch({ type: 'news/clear' });
			this.setState({ count: this.props.news.del.count });
			this.props.history.push('/news');
			return true
		}
		let fileUp = this.props.news.fileUp;
		if (fileUp && fileUp.count > this.state.fcount && fileUp.status) {
			this.setState({ fcount: fileUp.count, fileModel: false })
			return true
		}
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {
			this.ListFun()
		}
	}

	render() {
		const { inactive, limit, searchText} = this.state;
        const { news } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = news.list ? news.list : [];
		}
		const total = 0;
		const totalActive = 0
		let roleType = localStorage.getItem('role');

		console.log("modalEventData : ", this.state.modalEventData);

		const columns = [
			{
				title: '#',
				dataIndex: 'thumbnail',
				width: 100,
				render: (val, data) => {
					const user = jwt_decode(localStorage.getItem('token'));
					let imageName = 'https://lh3.googleusercontent.com/proxy/yzf-l8B9xF9SYkzg5DtGFYL0WTGefJ2zV-Tr-RMakcweMoljvRJmmO7kwnq4n7jioJULUAhXInVcNGb25q1pyfGGGc3i-_lFnTR6';
					if (data.thumbnail) {
						const imageToken = data.thumbnail;
						imageName = process.env.REACT_APP_ApiUrl + '/' + imageToken;
					} else if (data.thumbnail && data.thumbnail.length > 0) {
						const imageToken = data.thumbnail;
						imageName = process.env.REACT_APP_ApiUrl + '/' + imageToken;
					}
					return (<Avatar shape="square" size={60} src={imageName} style={{ margin: 5 }} />);
				}
			},
            {
				title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>News Title <i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
				dataIndex: 'title',
				render: (val, data) => <div className={data.isActive ? "" : 'danger-text'}>{val}</div>
            },
            { title: <strong>Short Description</strong>, dataIndex: 'shortdesc', },
			{ title: <strong>Action</strong>, width: 140, render: (val, data) => 
				roleType == 'ADMIN' ? 
				<div>
					<Button className="ant-btn-sm" type="primary" onClick={e => { this.viewItem(data); e.stopPropagation() }}><EyeOutlined /></Button>
					<Button className="ant-btn-sm" type="danger" onClick={e => { this.deleteItem(data._id); e.stopPropagation() }}><DeleteOutlined /></Button> 
				</div>
				: <Button className="ant-btn-sm" type="primary" onClick={e => { this.viewItem(data); e.stopPropagation() }}><EyeOutlined /></Button>
			},
		];
		return (
			<div>
				<Apploader show={this.props.loading.global} />
				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					<Col>
						<Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText}
							loading={this.props.submitting} />
					</Col>
					<Col>
						{
							roleType == 'ADMIN' ? 
							<Button type="primary" onClick={() => this.props.history.push('/news/add')}>Add</Button>
							:''
						}
					</Col>
				</Row>

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							onChange={this.paginationFun}
							rowKey={record => record._id}
							onRow={(record, rowIndex) => {
								return {};
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
				<Modal title={this.state.modalEventData.title} visible={this.state.isModalVisible} footer={null} onCancel={() => this.handleModalCancel()} >
					<Card size="small" >
						<img src={process.env.REACT_APP_ApiUrl + '/' + this.state.modalEventData.thumbnail} />
						<p  className="app-news-detail-date" >Category  - {this.state.modalEventData.category ? this.state.modalEventData.category[0].category_name : ''}</p>
						<p  className="app-news-detail-date" >Date  - {<Moment format="MM- DD-YYYY" >{this.state.modalEventData.updated_at}</Moment>}</p>
						<div className="app-news-detail-desc" >
								{this.state.modalEventData.description}
						</div>
					</Card>
				</Modal>
			</div>

		);
	}
};

export default connect(({ news, loading }) => ({
	news, loading
}))(News);