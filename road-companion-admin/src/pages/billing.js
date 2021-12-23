import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from '../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import Moment from 'react-moment';
const { Search } = Input;
const { Text } = Typography;


class Billing extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			limit: 25, current: 1, sortBy: 'asc', searchText: '', listData: []
		}
		setTimeout(() => document.title = 'BillingList', 100,);
	}

    componentDidMount() {
      this.getList();  
    } 

    cancelOrder = (id) => {
      this.props.dispatch({type: 'billing/cancelOrder', payload: {id}}).then(()=>{
          this.getList();
      });
    };

    refundOrder = (id, p_id) =>{
      let product_id = new Array(p_id);
      console.log('productt_id', product_id);
      console.log('pp_id', p_id)
      console.log('p', id)
      this.props.dispatch({type: 'billing/refundOrder', payload: {id, product_id }}).then(()=>{
          this.getList();
      })
    };

    getList = () => {
      const user = jwt_decode(localStorage.getItem('token'));
      if(user.role === "ADMIN") {
        this.props.dispatch({type: 'billing/orderList',  payload: {
          page:0,
          limit:this.state.limit,
          role:"ADMIN"
        },});
      } else {
        this.props.dispatch({type: 'billing/orderList',  payload: {
          seller_id:user._id,
          page:0,
          limit: this.state.limit,
          role:"SELLER"
        },});
      }
    }
    

    ShowSizeChange=(current, size)  => {
      this.setState({limit:size});
      this.getList();
    }

    searchVal = (val) => {
      this.state.searchText = val
      // console.log('val', this.props);
      
      const resultAutos = this.props.orders.filter((auto) => auto.amount.toLowerCase().includes(val.toLowerCase()) || auto.payment_method.toLowerCase().includes(val.toLowerCase()) || auto.orderStatus.toLowerCase().includes(val.toLowerCase()))
      
      this.setState({ listData: resultAutos })
  
    }

    getOrderStatus(status) {
      /*
      // 0 for order placed 1 for order delivered 2 for order cancelled 3 for order returned 4 for order refund
      */
      let statusReturned = null;
      switch(status) {
          case 0:
              statusReturned = <span style={{'textAlign':'center','color':'green'}}>Placed</span>
          break;
          case 1:
              statusReturned = <span style={{'textAlign':'center','color':'green'}}>Delivered</span>
          break;
          case 2:
              statusReturned = <span style={{'textAlign':'center','color':'red'}}>Cancelled</span>
          break;
          case 3:
              statusReturned = <span style={{'textAlign':'center','color':'red'}}>Returned</span>
          break;
          case 4:
              statusReturned = <span style={{'textAlign':'center','color':'blue'}}>Refunded</span>
          break;
          default:
              statusReturned = <span style={{'textAlign':'center'}}>-</span>
          break;
      }

      return statusReturned;
    }

   
    render(){
        const {limit , sortBy, searchText } = this.state;
		const { billing } = this.props;
		console.log('billing', billing)
        // console.log('orders',orders);
        const products = billing;
        if(this.state.searchText == '') {
        //   this.state.listData = billing.map((items, k)=> { items['key'] = (k+1).toString(); return items; });
        }
        // const total = products.length;
        const totalActive = 0 //list ?  list.totalActive : 0;
        // console.log('list data', listData);
        const columns = [
          {
            title: 'Sr.No',
            dataIndex: 'no',
            width:100,
            render:(val,data) => {
              return billing.findIndex((o) => data == o)+1;
            }
          },
          {
            title: <strong className="primary-text cursor">Order date<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'orderNo',
            render:(val,data) => {
              return (data.create? <Moment format="MM- DD-YYYY" >{data.create}</Moment>:'-')
              
            }
          },
          {
            title: <strong className="primary-text cursor">Amount<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            render:(val,data) => {
              return data.amount?data.amount+" ₹":'-';
            }
          },
          {
            title: <strong className="primary-text cursor">Payment Method<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'totalPrice',
            render:(val,data) => {
              return data.payment_method;
            }
          },
          {
            title: <strong className="primary-text cursor">Status<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'orderDate',
            render:(val,data) => {
              return this.getOrderStatus(data.status);
            }
          },
          { 
              title:<strong>Action</strong>,
               width:310, 
               render:(val,data)=> {
                return (
                  <div>
                      <div style={{display:"flex", flexWrap:'wrap', alignItems:'center', justifyContent:'flex-start'}}>
                          <Button style={{ marginBottom:'5px', textAlign:'center', width:'135px' , marginRight:'5px' }} type="primary">Confirm Shiping</Button>
                          <Button style={{ marginBottom:'5px', textAlign:'center', width:'135px' , marginRight:'0px' }} type="primary">Buy Shipping</Button>
                          <Button onClick={() => this.cancelOrder(data._id)} style={{ marginBottom:'5px', textAlign:'center', width:'135px' , marginRight:'5px' }} type="danger" disabled={data.status == 2}>Cancel Order</Button>
                          <Button onClick={() => this.refundOrder(data._id, data.products[0] != 'undefined'&& data.products[0] != undefined ? data.products[0].product.id : '')} style={{ marginBottom:'5px', textAlign:'center', width:'135px' , marginRight:'0px' }} type="danger">Refund Order</Button>
                          <Button style={{ marginBottom:'5px', textAlign:'center', width:'100%' , }}  onClick={()=> this.props.history.push('/order/'+data._id)} type="primary">Details</Button>
                    </div>
                  </div>
                );
               } 
         },
        ];
      return (
        <div>
            <Apploader show={this.props.loading.global}/>
            <Row className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
                <Col>
                    <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText} />
                </Col>

                 <Col>
                 <div>
                     total unshipped:1
                 </div>
                 </Col>
                {/* <Col>
                    <Button type="primary" onClick={()=> this.downloadFile()}>Download Excel</Button>&nbsp;
                    <Button type="primary" onClick={()=> this.setState({fileModel:true})}>Upload Excel</Button>&nbsp;
                    <Button type="primary" onClick={()=> this.props.history.push('/products/add')}>Add</Button>
                </Col> */}
            </Row>
            
            <div className="innerContainer">
                    <Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
                      <Table columns={columns} dataSource={this.state.listData} 
                            // rowKey={record => record.no}
                            pagination={{position: ['bottomLeft'], 
                            //size:'small',
                            // defaultCurrent:1,
                            // total:total, pageSize: limit,
                            showTotal:(total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger:true,
                            responsive:true,
                            onShowSizeChange:(current, size)=> this.ShowSizeChange(current, size),
                            pageSizeOptions:['25','50','100','250','500'],
                        }}
                      />
                    </Card>
                </div>                
        </div>
      );
        }
};

const mapToProps = (state) => {
return {
	Billing:state.billing.list,
    loading:state.loading
}
};
export default connect(mapToProps)(Billing);