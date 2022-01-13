import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined,EyeOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
const { Search } = Input;
const { Text } = Typography;


class Plans extends React.Component {

  state = {
      sortBy:'asc'
  }

   
    render(){
        const columns = [
          {
            title: 'Sr.No',
            dataIndex: 'no',
            width:100
            // render:(val,data) => {
            //   return orders.findIndex((o) => data == o)+1;
            // }
          },
          {
            title: <strong className="primary-text cursor">Plan Name.<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'orderNo',
            render:(val,data) => {
              return data.address? data.address.fname+' '+data.address.lname+', ' + data.address.add1 + ', ' + data.address.add2 + ', ' + data.address.state + ', ' + data.address.state + ', ' + data.address.country:'-';
            }
          },
          {
            title: <strong className="primary-text cursor">Price<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            render:(val,data) => {
              return data.address?data.address.email:'-';
            }
          },
          { 
              title:<strong>Action</strong>,
               width:310, 
               render:(val,data)=> {
                return (
                  <div>
                      <div style={{display:"flex", flexWrap:'wrap', alignItems:'center', justifyContent:'flex-start'}}>
                          <Button style={{ marginBottom:'5px', textAlign:'center', width:'135px' , marginRight:'5px' }} type="primary"><EyeOutlined /></Button>
                          <Button style={{ marginBottom:'5px', textAlign:'center', width:'135px' , marginRight:'0px' }} type="primary"><DeleteOutlined /></Button>
                    </div>
                  </div>
                );
               } 
         },
        ];
      return (
        <div>
            {/* <Apploader show={this.props.loading.global}/> */}
            <Row className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
                <Col>
                    <Search placeholder="Search..." />
                </Col>

                 <Col>
                 <div>
                     <Button onClick={() => { this.props.history.push('/plans/add')} } >Add Plan</Button>
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
                      <Table columns={columns} dataSource={[]} 
                            // rowKey={record => record.no}
                            pagination={{position: ['bottomLeft'], 
                            //size:'small',
                            defaultCurrent:1,
                            total:100, pageSize: 10 ,
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

export default connect()(Plans);