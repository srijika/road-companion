import React from 'react';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Card, Typography, Input, Button, Table, Row, Col, Modal} from 'antd';
import jwt_decode from "jwt-decode";
import Moment from 'react-moment';
import RefundOrder from './details/RefundOrder'
const { Search } = Input;
const { Text } = Typography;


class Orders extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
      limit: 25, current: 1, sortBy: 'asc', searchText: '', listData: [], refundModel: false,
      /** Modal States */
      isModalVisible: false,
      modalOpenFor: "",
      selectedProductId: "",
      modalDescriptionText: "",
      showError: "",
      paymentStatusDropdown: "", 
      userDetail: {}
		}
		setTimeout(() => document.title = 'OrderList', 100,);
  }
  

    showModal = (modalOpenFor, selectedProductId) => {
      this.setState({
        ...this.state,
        modalOpenFor: modalOpenFor,
        selectedProductId: selectedProductId,
        isModalVisible: true,
      });
    };

    handleOk = () => {
      if(this.state.modalOpenFor == "cancellation") {
        this.cancelOrder();
      } else if(this.state.modalOpenFor == "refund") {
        this.refundOrder();
      }
    };

    handleCancel = () => {
      this.setState({
        ...this.state,
        isModalVisible: false,
      })
    };

    componentDidMount() {
      this.getList();  
    } 

    cancelOrder = () => {
      // Check if description is not null
      if(!this.state.modalDescriptionText) {

        this.setState({
          ...this.state,
          showError: "* This field is required."
        });

        setTimeout(() => {

          this.setState({
            ...this.state,
            showError: "",
          });

        }, 3000);

        return;
      }
      const requestPayload = {
        description: this.state.modalDescriptionText,
        id: this.state.selectedProductId
      };

      this.props.dispatch({type: 'order/cancelOrder', payload: requestPayload}).then(()=>{
          this.getList();
          this.handleCancel();
      });
    };


    refundDesc = (val) => {
      if (val) { this.getList() }
      this.setState({ detail: '', refundModel: false })
    }

    getList = (paymentStatusDropdown) => {

      const user = jwt_decode(localStorage.getItem('token'));


      let payment_status_dropdown, status_dropdown;

      if(paymentStatusDropdown ) {
        console.log(paymentStatusDropdown.name);
        if( paymentStatusDropdown.name === 'payment_status') {
          payment_status_dropdown = paymentStatusDropdown.value;
        }

        if( paymentStatusDropdown.name === 'status') {
          status_dropdown = paymentStatusDropdown.value;
        }
      } 

      this.setState({ userDetail: user })

      if(user.roles === "ADMIN") {
        this.props.dispatch({type: 'order/orderList',  payload: {
          page:0,
          limit:this.state.limit,
          role:"ADMIN", 
          payment_status: payment_status_dropdown, 
          status: status_dropdown
        },});
      } else {
        this.props.dispatch({type: 'order/orderList',  payload: {
          seller_id:user._id,
          page:0,
          limit: this.state.limit,
          role:"SELLER", 
          payment_status: payment_status_dropdown, 
          status: status_dropdown
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
              statusReturned = <span style={{'textAlign':'center','color':'red'}}>ed</span>
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
        const {limit , sortBy, searchText, refundModel } = this.state;
        const { orders } = this.props;

        


        if(this.state.searchText == '') {
          this.state.listData = orders.map((items, k)=> { items['key'] = (k+1).toString(); return items; });
        }
        const columns = [
          { title: 'Sr.No', dataIndex: 'no', width:100, render:(val,data) => { return orders.findIndex((o) => data == o)+1; } },
          {
            title: <strong className="primary-text cursor">Order date<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'orderNo',
            render:(val,data) => {
              return (data.create? <Moment format="MM- DD-YYYY" >{data.create}</Moment>:'-')
              
            }
          },
        ];


        // IF USER IS ADMIN THAN SHOWS LOGISTICS AND GALINUKKAD PRICE 
        if(this.state?.userDetail?.roles === "ADMIN") {
          columns.push({
            title: <strong className="primary-text cursor">Amount<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            render:(val,data) => {
              return  data.amount? " ₹ "+data.amount:'-';
            }
          },
          {
            title: <strong className="primary-text cursor">Logistic Price<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
            render:(val,data) => {
              return  data.total_ecom_shipping_price? " ₹ "+data.total_ecom_shipping_price.toFixed(2) :'-';
            }
          },
          {
            title: <strong className="primary-text cursor">Galinukkad Price<i className={' fal fa-sm '+(this.state.sortBy === 'asc' ? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            render:(val,data) => {
              return  data.galinukkad_shipping_price ? " ₹ "+data.galinukkad_shipping_price.toFixed(2) :'-';
            }
          }
          )
        }


        columns.push({
          title: <strong className="primary-text cursor">Status<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i>
          </strong>,
          dataIndex: 'orderDate',
          render:(val,data) => {
            return (
              (data.payment_status == "Paid") ?   this.getOrderStatus(data.status) : <span style={{ color: "red" }}> Payment Pending </span>
            )
              
          }
        },
        {
          title: <strong className="primary-text cursor">Payment Status<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i>
          <br />
            <select style={{ height: "20px", background: "white", borderRadius: "35px" }} placeholder="Select Status" name="payment_status" onChange={(e) => {  this.getList(e.target) } }>
                <option > Select Status </option>
                <option value="1"> Paid </option>
                <option value="0"> Unpaid </option>
            </select>
          </strong>,
          dataIndex: 'orderDate',
          render:(val,data) => {
            let payment_status = data.payment_status
            return payment_status === "Paid" ? <span style={{ color: "green", textTransform: 'uppercase' }}> {payment_status} </span> : <span style={{ color: "red", textTransform: 'uppercase' }}> {payment_status} </span>;
          }
        },
        { 
            title:<strong>Action</strong>,
             width:310, 
             render:(val,data)=> {
              return (
                <div> 
                    <div style={{display:"flex", alignItems:'center', justifyContent:'flex-start'}}>
                        <Button style={{ marginBottom:'5px', textAlign:'center', width:'100%' , }}  onClick={()=> this.props.history.push('/order/'+data._id)} type="primary">Details</Button>
                  </div>
                </div>
              );
             } 
       })
        


      return (
        <div>
            <Apploader show={this.props.loading.global}/>
            <Modal 
              title="Cancellation confirmation" 
              visible={this.state.isModalVisible} 
              onOk={this.handleOk} 
              onCancel={this.handleCancel}
            >
              <Input placeholder="Enter Description" onChange={(e) => this.setState({...this.state, modalDescriptionText: e.target.value })} />
              <br/>
              <span style={{color: 'red'}}>
                <small>{this.state.showError ? this.state.showError : ""}</small>
              </span>
            </Modal>
            <Row className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
                <Col>
                    <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText} />
                </Col>
              </Row>
            
            <div className="innerContainer">
                    <Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
                      <Table columns={columns} dataSource={this.state.listData} 
                            rowKey={record => record._id}
                            onRow={(record, rowIndex) => {
                              return {
                                // onClick: event => this.setState({ refundModel: true, detail: record })
                              };
                            }}
                            pagination={{position: ['bottomLeft'], 
                            showTotal:(total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger:true,
                            responsive:true,
                            onShowSizeChange:(current, size)=> this.ShowSizeChange(current, size),
                            pageSizeOptions:['25','50','100','250','500'],
                        }}
                      />
                    </Card>
                </div>
                <RefundOrder visible={refundModel} returnData={this.refundDesc} closeModel={() => this.setState({ refundModel: false })} />                
        </div>
      );
        }
};

const mapToProps = (state) => {
return {
  orders:state.order.list,
  loading:state.loading
}
};
export default connect(mapToProps)(Orders);