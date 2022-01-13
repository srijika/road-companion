import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm , List} from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
const { Search } = Input;
const { Text } = Typography;


class AccountHealth extends React.Component {

    state = {
        sortBy :'asc',
        limit : 10
    };

 

    componentDidUpdate() {
      const { orders } = this.props;
      console.log('orders:',orders);
    }
   
    render(){
        
        const columnsCSP = [
          {
            title: 'title',
            dataIndex: 'title',
            width:200,
          },
          {
            title: <span>Seller Fullfilled</span>,
            dataIndex: 'Seller Fullfilled',
            render:(val,data) => {
                return data.seller_fullfilled?`${data.seller_fullfilled}% ${data.seller_outof} of ${data.seller_total} orders`:'N/A';
            }
          },
          
          {
            title: <span>Fullfilled by Galinukkad</span>,
            dataIndex: 'Seller Fullfilled',
            render:(val,data) => {
                return data.amazone_fullfilled?`${data.amazone_fullfilled}% ${data.amazone_outof} of ${data.amazone_total} orders`:'N/A';
            }
          },
          
        ];

        const dataCSP = [
            {
                title:'Order Defect Rate',
                amazone_fullfilled:'0.06',
                amazone_outof:'1',
                amazone_total:'1,603',
            }
        ] 
        const dataCSPMetrics = [
            {
                title:'Negative feedback',
                amazone_fullfilled:'0.06',
                amazone_outof:'1',
                amazone_total:'1,603',
            },
            {
                title:'Negative feedback',
                amazone_fullfilled:'0.06',
                amazone_outof:'1',
                amazone_total:'1,603',
            },
            {
                title:'Negative feedback',
                amazone_fullfilled:'0.06',
                amazone_outof:'1',
                amazone_total:'1,603',
            }
        ] 
        const data = [
            'Recived Intellectual Property Complaints.',
            'Product Authenticity USER Complaints.',
            'Product Condition USER Complaints.',
            'Product Safety USER Complaints.',
            'Listing Policy Violations.',
            'Restricted Product Policy Violations.',
            'USER Product Review Policy Violations.'
          ];
        const shippingData = [
            'Late Shipment Rate.',
            'Pre-fullfillment Cancel Rate.'
          ];
      return (
        <div>
            <Apploader show={false}/>
            <div>

                <h2>Account Health</h2>
                <p>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                </p>
            </div>
            <Row gutter={5}>
            <Col span={14}>
                <Card title="USER Service Performance" bordered={true}>
                            <Table columns={columnsCSP} dataSource={dataCSP} 
                                rowKey={record => record.no}
                                pagination={false} 
                        />
                        <p
                        style={
                            {
                                fontSize: "12px",
                                color: "#333",
                                marginLeft: "10px"
                            }
                        }
                        >Order Defect Rate consists of three different metrics:</p>
                        <Table columns={columnsCSP} dataSource={dataCSPMetrics} 
                                rowKey={record => record.no}
                                pagination={false} 
                        />
                </Card>
            </Col>
            <Col span={10}>
           
                <Card title="Product Policy Compliance" bordered={true}>
                <List
                        header={false}
                        footer={false}
                        bordered
                        dataSource={data}
                        renderItem={item => (
                            <List.Item style={{background:'#e4f2fd',padding:'8px 5px',color:'#4c8fdb',fontSize:'14px',marginBottom:'5px'}}>
                            <div style={
                                {
                                    display:'flex',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    width: "100%"
                                }
                            } >
                                {item}
                                <span
                                style={{
                                    color:"#000",
                                    fontSize:'1.5rem'
                                }}
                                >
                                    0
                                </span>
                            </div>
                            </List.Item>
                    )}
                    />
                </Card>
            </Col>
            </Row>  

            <Row style={{marginTop:'1rem'}}>
            <Col span={14}>
                <Card title="Shipping Performance" bordered={true}>
                <List
                        header={false}
                        footer={false}
                        bordered
                        dataSource={shippingData}
                        renderItem={item => (
                            <List.Item style={{background:'#e4f2fd',padding:'8px 5px',color:'#4c8fdb',fontSize:'14px',marginBottom:'5px'}}>
                            <div style={
                                {
                                    display:'flex',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    width: "100%"
                                }
                            } >
                                {item}
                                <span
                                style={{
                                    color:"#333",
                                    fontSize:'1rem'
                                }}
                                >
                                    N/A
                                </span>
                            </div>
                            </List.Item>
                    )}
                    />
                </Card>
            </Col>
</Row>            
        </div>
      );
        }
};


export default connect()(AccountHealth);