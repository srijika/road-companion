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
class SubCategoryList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { limit: 25, current: 1, sortBy: 'asc', addModel: false, inactive: false, searchText: '', loader: false, detail: '', count: 0, Addcount: 0, listData: [], categoryData: [] }
		setTimeout(() => document.title = 'Sub-CategoryList', 100,);
	}

	componentDidMount() {
		this.ListFun();
	}

	ListFun = (categoryIdDropdown) => {
		let search = 'page=' + (this.state.current - 1) + "&limit=" + this.state.limit + "&inactive=" + this.state.inactive + "&searchText=" + this.state.searchText + "&sortBy=" + this.state.sortBy;
		localStorage.setItem('serviceSearch', JSON.stringify(this.state))

		let searchval = { page: this.state.current - 1, limit: this.state.limit, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy, category_id: categoryIdDropdown }
		this.props.dispatch({ type: 'subcategory/subCategoryList', payload: searchval, });
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
	paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val
		
		const resultAutos = this.props.subcategory.list.data.filter((auto) => auto.name.toLowerCase().includes(val.toLowerCase()) || auto.slug.toLowerCase().includes(val.toLowerCase()))
		
		this.setState({ listData: resultAutos })

	}

	createCat = (val) => {
		console.log(val)
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
	}

	deleteCat = id => {
		this.props.dispatch({ type: 'subcategory/subCategoryDel', payload: { _id: id }, });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.subcategory.del && this.props.subcategory.del.count > this.state.count && this.props.subcategory.del.status) {
			this.setState({ count: this.props.subcategory.del.count })
			return true
		}
		if (this.props.subcategory.add && this.props.subcategory.add.count > this.state.Addcount && this.props.subcategory.add.status) {
			this.setState({ Addcount: this.props.subcategory.add.count, addModel: false })
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
		console.log("this.props")
		console.log(this.props)
		const { inactive, limit, searchText, addModel, detail } = this.state;
		const { subcategory, category } = this.props;

		// console.log('category is adath');
		// console.log(category.list);
	
		if(this.state.searchText == ''){
			this.state.listData = subcategory.list ? subcategory.list.data : [];
		}
		const total = 0;//list ? list.total : 0;
		const totalActive = 0 //list ?  list.totalActive : 0;
		//console.log(this.props.listLoc)
		const columns = [
			{
				title:
					<strong className="primary-text cursor" onClick={this.ChangeOrder}>Sub Category Name <i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
				dataIndex: 'name',
				//width:250,
				render: (val, data) => <div className={data.isActive ? "" : 'danger-text'}>{getTitleImage(val)}</div>
			},
			{ title: <strong>Slug</strong>, dataIndex: 'slug', },
			{ title: <strong>Parent Category <br />
				<select placeholder="Select Parent Category" name="payment_status" onChange={(e) => {  this.ListFun(e.target.value) } }>
				{console.log('category njksdfhsdkjfhsdjk')}
					{category.list ?  category.list.data.map((item, index) => <option value={item._id} key={index}>{item.name}</option>) : ""}
              </select>

			</strong>, dataIndex: ['parent_category','name'], },
			{
				title: <strong>Action</strong>, width: 200, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Button className="ant-btn-sm" title="View and Edit Sub Category" type="primary" onClick={() =>this.setState({ addModel: true, detail: data })}><EyeOutlined /></Button>&nbsp;
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
						<Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText}
						 	loading={this.props.submitting} />
						{/*<Text type="primary" className={styles.activeNo}>&nbsp;&nbsp; <strong>{totalActive} Active Services </strong> </Text>
				<Text type="secondary" className={styles.activeNo}><i className="fas fa-filter"></i> Filter </Text>*/}
					</Col>
					<Col>
						{/*<span style={{color:"lightgrey",marginRight:"17px"}}>Show Inactive</span>
				<Switch className={styles.switchBtn} onChange={this.switchFun} checked={inactive} /> */}
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
				<AddEdit visible={addModel} returnData={this.createCat} closeModel={() => this.setState({ addModel: false, detail: '' })} detail={detail} />
			</div>
		);
	}
};

export default connect(({ subcategory, loading, category }) => ({
	subcategory, loading, category
}))(SubCategoryList);