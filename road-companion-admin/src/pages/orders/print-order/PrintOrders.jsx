import React from 'react';
import { connect } from 'dva';
import Apploader from '../../../components/loader/loader'

import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';

import Moment from 'react-moment';

import '../details/order-details.css';
import '../print-order/printOrders.css'

class PrintOrders extends React.Component {

	state = {
		sortBy: 'asc',
		limit: 10,
		page: 1,
		printModel: false,
	};
	

	componentDidMount() {
		// this.getOrderDetails();
	}

	componentDidUpdate() { }

	// getOrderDetails() {
	// 	this.props.dispatch({ type: 'order/orderDetail', payload: { } })
	// }

	ShowSizeChange(current, size) { }

	cancelOrder = (id) => {
		this.props.dispatch({ type: 'order/cancelOrder', payload: { id } }).then(() => {
			this.getOrderDetails();
		});

	}

	disbleCancelButton(orderDetail) {
		if (orderDetail && orderDetail.status == 2) {
			return true;
		}
		return false;
	}

	 cancelFun(){
		//  this.props.closeModel()
		// this.setState({ printModel: false, detail: '' })
		// console.log(this.props)
		// this.state.printModel = false
	}

	print() {
		window.print();
		// this.props.history.push('/orders')
		// this.state.printModel = false
		document.location = "/#/orders"; 
	}

	render() {
		const { page, limit, printModel } = this.state;
		const listData = [];
		const total = 0;
		const { orderDetail } = this.props;

		// console.log('ordr', this.props)
		const columns = [
			// {
			//   title: 'image',
			//   dataIndex: 'image',
			//   width:100,
			//   render:(val,data)=>  <img src={process.env.REACT_APP_ApiUrl+'/'+data.images.file}></img>
			// },
			{
				title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>Product Name</strong>,
				dataIndex: 'detail',
				//width:250,
				render: (val, data) => <div className={data.isActive ? "" : 'danger-text'}>{data?.product?.title}</div>
			},
			{
				title: <strong>Price</strong>, dataIndex: 'price',
				render: (val, data) => <div>{data?.product?.price + ' ₹'}</div>
			},
			// { title:<strong>Price</strong>, width:100, dataIndex: 'detail', render: (value,data) => {
			//     return ('₹ '+value.price);
			// }},
			{ title: <strong>Quantity</strong>, width: 100, dataIndex: 'quantity' }
		];
		return (

			<div>
				<Modal visible={this.props.visible} title={'Order Invoice'}  onCancel={()=>this.props.closeModel()} footer={<>
				<Button onClick={()=>this.props.closeModel()}>Cancel</Button>
				<Button type="primary" onClick={this.print} className="btn-w25 btn-primary-light">Print Invoice</Button>
			</>}>
					<div>
						<Apploader show={this.props.loading.global} />
						<div className="order-detail-heading">
							{/* <span>Order details.</span>&nbsp; */}
					                <span>Order ID: {orderDetail?._id}</span>
						</div>

						<Row gutter={5} style={{ marginBottom: '0.625rem' }}>
							<Col span={14}>
								<Card title="Order summary" bordered={false}>
									<Row gutter={10}>
										{/* <Col span={12} >
					                                        <div>
					                                            <label className="order-detail-bold" >Ship by:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light order-detail-heighlight">-</span><br/>
					                                            <label className="order-detail-bold" >Deliver by:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">-</span><br/>
					                                            <label className="order-detail-bold" >Order date:</label>&nbsp;&nbsp;<span className="order-detail-light">{orderDetail && orderDetail.create?<Moment format="MM-
					                                            DD-YYYY" >{orderDetail.create}</Moment>:'-'}</span><br/>
					                                        </div>
					                                    </Col> */}
										<Col span={24} >
											<div>
												<label className="order-detail-bold" >Order date:</label>&nbsp;&nbsp;<span className="order-detail-light">{orderDetail && orderDetail.create ? <Moment format="MM-
					                                            DD-YYYY" >{orderDetail.create}</Moment> : '-'}</span><br />
												<label className="order-detail-bold" >Shipping service:</label>&nbsp;<span className="order-detail-light">Mon, Apr 8,2019</span><br />
												<label className="order-detail-bold" >Fullfillment:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">Apr 12,2019 to  Apr 18, 2019</span><br />
												<label className="order-detail-bold" >Payment Method:</label>&nbsp;&nbsp;<span className="order-detail-light">{orderDetail ? orderDetail.payment_method : '-'}</span><br />
												<label className="order-detail-bold" >Payment Status:</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="order-detail-light">{orderDetail ? (orderDetail.payment_status ? <span style={{ color: 'green' }}>PAID</span> : <span style={{ color: 'red' }}>UNPAID</span>) : '-'}</span><br />
											</div>
										</Col>
									</Row>
								</Card>
							</Col>
							<Col span={10}>
								<Card title="Ship to" bordered={false} >
									{(orderDetail && orderDetail.address && orderDetail.address.companyname != "null") ? <div>{orderDetail.address.companyname}, </div> : null}
									{orderDetail && orderDetail.address ? orderDetail.address.fname : null} {orderDetail && orderDetail.address ? <span>{orderDetail.address.lname}, <br /></span> : null}
									{orderDetail && orderDetail.address ? <div>{orderDetail.address.add1}, </div> : null}
									{orderDetail && orderDetail.address ? <div>{orderDetail.address.add2}, </div> : null}
									{orderDetail && orderDetail.address ? <span>{orderDetail.address.postal}, </span> : null} {orderDetail && orderDetail.address ? <span>{orderDetail.address.state}, <br /></span> : null}
									{orderDetail && orderDetail.address ? orderDetail.address.country : null}

									{orderDetail && !orderDetail.address ? 'No address Found' : null}
								</Card>
							</Col>
						</Row>

						<Table
							style={{ marginBottom: "0.625rem" }}
							columns={columns}
							dataSource={orderDetail && orderDetail.product}
							rowKey={record => record.id}
							// pagination={null}
						/>


						{/* </ReactToPrint> */}
					</div>
				</Modal>
			</div>
		);
	}
};


const mapToProps = (state) => {
	return {
		orderDetail: state.order.detail,
		loading: state.loading,
		cancel: state.order.cancel
	}
};
export default connect(mapToProps)(PrintOrders);