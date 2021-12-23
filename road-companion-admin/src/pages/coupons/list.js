import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Badge, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AddEdit from './action/addEdit'
//import styles from './login.less';
import { getTitleImage } from '../../utils/functions';
import Moment from 'react-moment';
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

class CouponsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			limit: 25, current: 1, sortBy: 'asc', addModel: false, inactive: false, searchText: '', loader: false, detail: '', count: 0, Addcount: 0,
			listData: []
		}

		setTimeout(() => document.title = 'Coupon LIst', 100,);
		this.isUpdate = false;
	}
	componentDidMount() {
		this.ListFun();
	}

	ListFun = () => {
		// let search = 'page='+(this.state.current-1)+"&limit="+this.state.limit+"&inactive="+this.state.inactive+"&searchText="+this.state.searchText+"&sortBy="+this.state.sortBy;
		// localStorage.setItem('serviceSearch', JSON.stringify(this.state))

		// let searchval = {page:this.state.current-1, limit:this.state.limit, inactive:this.state.inactive, searchText:this.state.searchText, sortBy:this.state.sortBy}
		//this.setState({loader:true})
		this.props.dispatch({ type: 'coupon/couponList', payload: {} });
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
	// paginationFun=(val)=> this.setState({current: val.current},()=>this.ListFun());

	searchVal = (val) => {

		this.state.searchText = val

		const resultAutos = this.props.coupon.list.filter((auto) => auto.code.toLowerCase().includes(val.toLowerCase()))

		this.setState({ listData: resultAutos })
	}

	createCat = (val) => {
		console.log(val)
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
	}

	deleteCoupon = id => {
		this.props.dispatch({ type: 'coupon/couponDelete', payload: { _id: id }, });
		this.isUpdate = true;
	}

	// getSnapshotBeforeUpdate(prevProps, prevState) {
	//     if (this.props.category.del && this.props.category.del.count >this.state.count && this.props.category.del.status) {
	//         this.setState({count:this.props.category.del.count})
	// 		return true
	//     }
	//     if (this.props.category.add && this.props.category.add.count >this.state.Addcount && this.props.category.add.status) {
	//         this.setState({Addcount:this.props.category.add.count, addModel:false})
	// 		return true
	//     }
	//     return null;
	// }

	componentDidUpdate(prevProps, prevState) {
		if (this.isUpdate) {
			this.ListFun()
			this.isUpdate = false;
		}
	}

	render() {
		const { inactive, limit, searchText, addModel, detail } = this.state;
		const { coupon } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = coupon.list ? coupon.list : [];
		}
		let roleType = localStorage.getItem("role");

		const columns = [
			{
				title: <strong>Code</strong>,
				dataIndex: 'code'
			},
			{ title: <strong>Description</strong>, dataIndex: 'codeDescription', },
			{ title: <strong>Amount</strong>, dataIndex: 'amount', render: (value, row) => { return <span>{value + (row.isPercent ? '%' : '')}</span> } },
			{ title: <strong>Expire Date</strong>, dataIndex: 'expireDate', render: (value) => { return <Moment format="DD-MM-YYYY">{value}</Moment> } },
			{
				title: <strong>Action</strong>, width: 100, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Popconfirm title="Are you sure delete this coupon?" onConfirm={e => { this.deleteCoupon(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
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
						<Button type="primary" onClick={() => this.setState({ addModel: true })}>Add</Button>
					</Col>
				</Row>

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							// onChange={this.paginationFun}
							//pagination={{ position: ['bottomLeft'] }}
							rowKey={record => record._id}
							onRow={(record, rowIndex) => {
								return {
									onClick: event => this.setState({ addModel: true, detail: record })
								};
							}}

							pagination={{
								position: ['bottomLeft'],
								//size:'small',
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
				<AddEdit visible={addModel} closeModel={() => { this.isUpdate = true; this.setState({ addModel: false, detail: '' }) }} detail={detail} />
			</div>
		);
	}
};

export default connect(({ coupon, loading }) => ({
	coupon, loading
}))(CouponsList);