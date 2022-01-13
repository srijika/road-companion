import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
const { Search } = Input;
const { Text } = Typography;


class ShippingRates extends React.Component {

    state = {
        sortBy :'asc',
        limit : 10,
        listData: [],
        searchText: ''
    };

    componentDidMount() {

      this.getList();  
    } 

    getList = () => {
        this.props.dispatch({type: 'shippingRate/shippingRateList',  payload: {}});
    }

    searchVal = (val) => {
      this.state.searchText = val
      console.log('banners',this.props)
      
      const resultAutos = this.props.shippingRate.list.filter((auto) => auto.zone.toLowerCase().includes(val.toLowerCase()) || auto.weight.toLowerCase().includes(val.toLowerCase()))
      
      this.setState({ listData: resultAutos })
  
    }

    ShowSizeChange=(current, size)  => {
      this.setState({limit:size});
      this.getList();
    }

    deleteItem(id) {
      this.props.dispatch({type: 'shippingRate/deleteRate',  payload: {id:id} });
      setTimeout(() => {
        this.getList();
      },500);
    }

   
    render(){
        const {limit , sortBy, searchText } = this.state;
        const { shippingRate } = this.props;
        console.log('shippinf rates',shippingRate);
        if(this.state.searchText == '') {
          this.state.listData = shippingRate.list ? shippingRate.list : [];
        }
        // const listData = shippingRate.list || [];
        const total = this.state.listData.length;
        const totalActive = 0 //list ?  list.totalActive : 0;
        console.log('list data', this.state.listData);
        const columns = [
          {
            title: 'Sr.No',
            dataIndex: 'no',
            width:100,
            render:(val,data) => {
              return this.state.listData.findIndex((o) => data == o)+1;
            }
          },
          {
            title: <strong className="primary-text cursor">Price</strong>,
            dataIndex: 'price',
            render:(val,data) => {
              return '₹ '+val;
            }
          },
          {
            title: <strong className="primary-text cursor">Weight</strong>,
            dataIndex: 'weight',
            render:(val,data) => {
              return val?val:'-';
            }
          },
          {
            title: <strong className="primary-text cursor">Zone</strong>,
            dataIndex: 'zone'
          },
          {
            title: <strong className="primary-text cursor">Availability</strong>,
            dataIndex: 'availability',
            render:(val,data) => {
              return val?'Available':'Not Available';
            }
          },
          { 
              title:<strong>Action</strong>,
               width:310, 
               render:(val,data)=> {
                return (
                  <Button type="danger" onClick={e=> {this.deleteItem(data._id); e.stopPropagation()}}><DeleteOutlined /></Button>
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
                {/* <Col>
                    <Button type="primary" onClick={()=> this.downloadFile()}>Download Excel</Button>&nbsp;
                    <Button type="primary" onClick={()=> this.setState({fileModel:true})}>Upload Excel</Button>&nbsp;
                    <Button type="primary" onClick={()=> this.props.history.push('/products/add')}>Add</Button>
                </Col> */}
                <Col>
                  <Button type="primary" onClick={()=> this.props.history.push('/shipping-rates/add')}>Add</Button>
                </Col>
            </Row>
            
            <div className="innerContainer">
                    <Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
                      <Table columns={columns} dataSource={this.state.listData} 
                            rowKey={record => record._id}
                            onRow={(record, rowIndex) => {
                              return {
                                onClick: event => this.props.history.push('/shipping-rates/edit/'+record._id)
                              };
                              }}
                            pagination={{position: ['bottomLeft'], 
                            //size:'small',
                            defaultCurrent:1,
                            total:total, pageSize: limit,
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

const mapToProps = ({shippingRate,loading}) => {
return {shippingRate,loading}
};
export default connect(mapToProps)(ShippingRates);