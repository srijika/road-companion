import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Badge, Popconfirm } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import AddEdit from './action/addEdit'
//import styles from './login.less';
import { getTitleImage } from '../../utils/functions';
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;
class CategoryList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			limit: 25, current: 1, sortBy: 'asc', addModel: false, inactive: false, 
			searchText: '', loader: false, count: 0, Addcount: 0,
			listData: [], detail: ''
		}
		setTimeout(() => document.title = 'CategoryList', 100,);
	}
	componentDidMount() {
		this.ListFun();
	}

	ListFun = () => {
		let search = 'page=' + (this.state.current - 1) + "&limit=" + this.state.limit + "&inactive=" + this.state.inactive + "&searchText=" + this.state.searchText + "&sortBy=" + this.state.sortBy;
		localStorage.setItem('serviceSearch', JSON.stringify(this.state))

		let searchval = { page: this.state.current - 1, limit: this.state.limit, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy }
		//this.setState({loader:true})
		this.props.dispatch({ type: 'category/categoryList', payload: searchval, });
		
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
	paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val
		
		const resultAutos = this.props.category.list.data.filter((auto) => auto.name.toLowerCase().includes(val.toLowerCase()) || auto.slug.toLowerCase().includes(val.toLowerCase()))
		
		this.setState({ listData: resultAutos })

	}

	createCat = (val) => {
		
		if (val) { this.ListFun() }
		this.setState({ detail: null, addModel: false })
	}

	deleteCat = id => {
		this.props.dispatch({ type: 'category/categoryDel', payload: { _id: id }, });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {

		if (this.props.category.del && this.props.category.del.count > this.state.count && this.props.category.del.status) {
			this.setState({ count: this.props.category.del.count })
			return true
		}
		if (this.props.category.add && this.props.category.add.count > this.state.Addcount && this.props.category.add.status) {
			this.setState({ Addcount: this.props.category.add.count, addModel: false })
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
		const { inactive, limit, searchText, addModel } = this.state;
		const { category } = this.props;
		if(this.state.searchText == ''){
			this.state.listData = category.list ? category.list.data : [];
		}
		const total = 0;//list ? list.total : 0;
		const totalActive = 0 //list ?  list.totalActive : 0;
		//console.log(this.props.listLoc)
		const columns = [
			{
				title:
					<strong className="primary-text cursor" onClick={this.ChangeOrder}>Category Name <i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
				dataIndex: 'name',
				//width:250,
				render: (val, data) => <div className={data.isActive ? "" : 'danger-text'}>{getTitleImage(val)}</div>
			},
			{ title: <strong>Slug</strong>, dataIndex: 'slug', },
			{
				title: <strong>Action</strong>, width: 200, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Button className="ant-btn-sm" title="View and Edit Category" type="primary" onClick={() =>this.setState({ addModel: true, detail: data })}><EyeOutlined /></Button>&nbsp;
					<Popconfirm title="Are you sure delete this task?" onConfirm={e => { this.deleteCat(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
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
						{/* <Button type="primary" onClick={() => this.setState({ addModel: true })}>Add</Button>
						 */}
						<Button type="primary" onClick={() => this.setState({ addModel: true })}>Add</Button> 

					</Col>
				</Row>  

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							onChange={this.paginationFun}
							//pagination={{ position: ['bottomLeft'] }}
							rowKey={record => record._id}
							onRow={(record, rowIndex) => {
								return {
									onClick: event => this.setState({ addModel: true, detail: record })
								};
							}}

							pagination={{
								position: ['bottomLeft'],
								// size:'small',
								// defaultCurrent:1,
								// total:total, pageSize: limit,
								showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
								responsive: true,
								onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
								pageSizeOptions: ['25', '50', '100', '250', '500'],
							}}
						/>
					</Card>
				</div>

				{/*Create New*/}
				<AddEdit visible={addModel} returnData={this.createCat} closeModel={() => this.setState({ addModel: false  , detail : ''})} detail={this.state.detail} />
			</div>
		);
	}
};

export default connect(({ category, loading }) => ({
	category, loading
}))(CategoryList);