import React from 'react';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row, Col, Avatar, Tabs, Modal, message, Upload, notification } from 'antd';
import { EyeOutlined, QuestionOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import UploadFile from './action/uploadFile'
import jwt_decode from "jwt-decode";
import fetch from 'dva/fetch';
import './list.css'
import axios from 'axios'


//import styles from './login.less';
const { Search } = Input;
const { Text } = Typography;
const { confirm } = Modal;
const baseUrl = process.env.REACT_APP_ApiUrl

class ProductList extends React.Component {
	constructor(props) {
		super(props);
		this.state = { count: 0, Addcount: 0, limit: 1000, current: 1, sortBy: 'asc', inactive: false, searchText: '', loader: false, detail: '', fileModel: false, listData: [], quantity:'' , inventory:0 }
		setTimeout(() => document.title = 'Products List', 100);
	}
	componentDidMount() {
		this.ListFun();
		this.props.dispatch({ type: 'product/clearAction' });

	}



	ListFun = () => {
		const user = jwt_decode(localStorage.getItem('token'));

		if (user.role === "ADMIN") {
			localStorage.setItem('productSearch', JSON.stringify(this.state));
			this.props.dispatch({ type: 'product/productList', payload: {
				limit: this.state.limit,
				page: this.state.current - 1,
				searchText: this.state.searchText,
				premium_product: 0
			} });
		} else {
			localStorage.setItem('productSearch', JSON.stringify(this.state))

			this.props.dispatch({ type: 'product/sellerProductList', payload: {
				limit: this.state.limit,
				page: this.state.current - 1,
				searchText: this.state.searchText,
				premium_product: 0
			} });
		}

	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = () => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
	// paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => { 
		
		this.state.searchText = val
		const resultAutos = this.props.product.list.data.filter((auto) => auto.title.toLowerCase().includes(val.toLowerCase()) || auto.vendor.toLowerCase().includes(val.toLowerCase()))
		this.setState({ listData: resultAutos })
	}

	SelectedFile = (val) => {
		// console.log(val.file.originFileObj);
		const formData = new FormData();
		formData.append('file', val.file.originFileObj);
		//this.props.dispatch({type: 'product/uploadExcelFile',  payload: val.file.originFileObj,});
		fetch(baseUrl + '/import-products', {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('token'),
				Accept: 'application/json'
			},
			body: formData
		}).then(async (res) => {
			console.log("file uploaded")
			const data = await res.json();
			console.log(data)
			if (data.status) {
				message.success("Products Uploaded Successfully")
				this.ListFun();
			}
			else {
				message.error(data.message)
			}
			this.setState({ fileModel: false });
		})
			.catch(function () {
				console.log("error upload");
			});
	}

	deleteItem = (id) => {
		let that = this;
		confirm({
			title: 'Are you sure you want to delete this item?',
			icon: <ExclamationCircleOutlined />,
			//content: 'Some descriptions',
			okText: 'Yes',
			cancelText: 'No',
			onOk() { return that.deleteItemFun(id) },
			onCancel() { console.log('Cancel'); },
		});
	}

	showQty = (id,inv) =>{
		this.setState({quantity:id}) ;
		this.setState({inventory: inv});
	}

	updateQty = (e) => {

		this.setState({inventory: e.target.value});
	}

	updatedQuntityHandler = (_id, val) =>{

		
		this.props.dispatch({ type: 'product/updateStock', payload: { _id,val }, });

		this.ListFun();
		this.setState({quantity:''}) ;
	}

	deleteItemFun = (id) => {
		this.props.dispatch({ type: 'product/productDelete', payload: { _id: id }, });
	}

	downloadFile = () => {
		fetch(baseUrl + '/getallproductsExport', {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + window.localStorage.getItem('token'),
				Accept: 'application/json',
				sellerid: window.localStorage.getItem('userId'),
				role: window.localStorage.getItem('role'),
			},
			
		}).then(async (res) => {
			const data = await res.json();
			//console.log('my daa',data);
			var file_path = 'products.xlsx';
			var a = document.createElement('A');
			a.href = data.data.fileUrl;
			a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		});
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		console.log(this.props.product)
		if (this.props.product.del && this.props.product.del.count > this.state.count && this.props.product.del.status) {
			this.setState({ count: this.props.product.del.count })
			// this.ListFun();
			return true
		}
		let fileUp = this.props.product.fileUp;
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

	handleAddProduct  = async () => {
		
		let verifiyAddress = localStorage.getItem('addressUpdateVerified');
		if(verifiyAddress === true || verifiyAddress === 'true') {
			this.props.history.push('/products/add');
			return ;
		}

		let user_data = JSON.parse(localStorage.getItem('user'));
		let token = localStorage.getItem('token');
		
		axios.defaults.headers.common = {'Authorization': `bearer ${token}`}
		const res = await axios.post(`${baseUrl}/getprofile`, { profile_id: user_data._id });
		let profile = res.data?.profile;
		if(!['', null, undefined].includes(profile.postal)) {
			localStorage.setItem('addressUpdateVerified', true);
			this.props.history.push('/products/add');
		}else {
			notification.error({message: "Please update your profile."});
			return ;
		}

		

	}

	render() {
		//console.log(this.props)
		const { searchText, fileModel } = this.state;
		const { product } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = product.list ? product.list.data : [];
		}

		const columns = [
			{
				title: '#',
				dataIndex: 'images',
				cursor: 'pointer',
				width: 100,
				render: (val, data) => {
					let imageName = 'https://lh3.googleusercontent.com/proxy/yzf-l8B9xF9SYkzg5DtGFYL0WTGefJ2zV-Tr-RMakcweMoljvRJmmO7kwnq4n7jioJULUAhXInVcNGb25q1pyfGGGc3i-_lFnTR6';

					if (data.images && data.images.file) {
						const imageToken = data.images.file;
						imageName = process.env.REACT_APP_ApiUrl + '/' + imageToken;
					} else if (data.images && data.images.length > 0) {
						const imageToken = data.images[0];
						imageName = process.env.REACT_APP_ApiUrl + '/' + imageToken;
					}

					return (<Avatar shape="square" size={60} src={imageName} style={{ margin: 5 }} />);
				}
			},
			{
				title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>Products Name <i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
				dataIndex: 'title',
				width:250,
				render: (val, data) => <div className={data.isActive ? "" : 'danger-text'}>{val}</div>
			},
			{ title: <strong>Vendor</strong>, width: 100, dataIndex: 'vendor' },
			{ title: <strong>Price</strong>, width: 100, dataIndex: 'price', },
			{ title: <strong>MRP Price</strong>, width: 100, dataIndex: 'mrp_price', },
			{ title: <strong> Product Stock  </strong>, width: 100, dataIndex: 'inventory', render:(val,data)=>
				<div>
					
					{ this.state.quantity !== data._id  && <a style={{ color: "#2423af" }} title="Update Qunatity" onClick={()=>this.showQty(data._id,data.inventory)} >{ data.inventory }</a> } 
					
					{this.state.quantity === data._id && <input type="text" value={this.state.inventory} onChange={this.updateQty} onBlur={()=>this.updatedQuntityHandler(data._id,this.state.inventory)} ></input> }
					
				</div>
			 },

			{ title: <strong>Action</strong>, width: 100, render: (val, data) => 
						<div>
							<Button className="ant-btn-sm" title="Question and Answers" type="ghost" onClick={() => this.props.history.push('/products/qa/' + data._id) }><QuestionOutlined /></Button>&nbsp;
							<Button className="ant-btn-sm" title="View and Edit Product" type="primary" onClick={() => this.props.history.push('/products/edit/' + data._id )}><EyeOutlined /></Button>&nbsp;
							<Button className="ant-btn-sm" type="danger" title="Delete Product" onClick={e => { this.deleteItem(data._id); e.stopPropagation() }}><DeleteOutlined /></Button>
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
					</Col>
					<Col>
						<Button type="primary" onClick={() => this.downloadFile()}>Download Excel</Button>&nbsp;
				<Button type="primary" onClick={() => this.setState({ fileModel: true })}>Upload Excel</Button>&nbsp;
				<Button type="primary" onClick={() => {this.handleAddProduct()} }>Add</Button>
					</Col>
				</Row>

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							// onChange={this.paginationFun} 
							rowKey={record => record._id}
							onRow={ (record) => {
								return {
									// onClick: () => this.props.history.push('/products/edit/' + record._id)
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
				<UploadFile visible={fileModel} returnData={this.SelectedFile} closeModel={() => this.setState({ fileModel: false })} />
			</div>
		);
	}
};

export default connect(({ product, users, loading }) => ({
	product, users, loading
}))(ProductList);