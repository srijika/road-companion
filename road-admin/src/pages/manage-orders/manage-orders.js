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
const { TabPane } = Tabs;

class ManageOrders extends React.Component {

    state = {
        data: [],
        pagination: {
          current: 1,
          pageSize: 10,
        },
        loading: false,
      };


  


   
    render(){
        const { pagination , loading } = this.state;
        const productsAvilabilityColumns = [
            {
                title: 'Image',
                dataIndex: 'image',
            },
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Price',
              dataIndex: 'price',
            },
            {
              title: 'In Stock',
              dataIndex: 'avialable_quantity',
            },
            {
              title: 'Actions',
              dataIndex: 'actions',
              render: () => {
                return <Button style={{ marginBottom:'5px', textAlign:'center', width:'100%' }}  type="primary">Details</Button>
              }
            },
          ];

          const defectiveProductsColumns = [
            {
                title: 'Image',
                dataIndex: 'image',
            },
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Price',
              dataIndex: 'price',
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                render: () => {
                  return <Button style={{ marginBottom:'5px', textAlign:'center', width:'100%' }}  type="primary">Details</Button>
                }
              },
          ];

          const ordersDeliveredColumns = [
            {
                title: 'Image',
                dataIndex: 'image',
            },
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Price',
              dataIndex: 'price',
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                render: () => {
                  return <Button style={{ marginBottom:'5px', textAlign:'center', width:'100%' }}  type="primary">Details</Button>
                }
              },
          ];

        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Product Availability" key="1">
                <Card>
                <Row style={{marginBottom: "0.625rem"}} className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
                    <Col>
                        <Search placeholder="Search..."  loading={this.props.submitting}	/>
                    </Col>
                    <Col>
                        <Button type="primary">Download Excel</Button>&nbsp;
                    </Col>
		        </Row>
                <Table
                    columns={productsAvilabilityColumns}
                    rowKey={record => record._id}
                    dataSource={[]}
                    pagination={pagination}
                    loading={loading}
                    />
                </Card>
                </TabPane>
                <TabPane tab="Defective Products" key="2">
                    <Card>
                <Row style={{marginBottom: "0.625rem"}} className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
                    <Col>
                        <Search placeholder="Search..."  loading={this.props.submitting}	/>
                    </Col>
                    <Col>
                        <Button type="primary">Download Excel</Button>&nbsp;
                    </Col>
		        </Row>
                <Table
                    columns={defectiveProductsColumns}
                    rowKey={record => record._id}
                    dataSource={[]}
                    pagination={pagination}
                    loading={loading}
                />
                </Card>
                </TabPane>
                <TabPane tab="Orders Delivered" key="3">
                    <Card>
                <Row style={{marginBottom: "0.625rem"}} className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
                    <Col>
                        <Search placeholder="Search..."  loading={this.props.submitting}	/>
                    </Col>
                    <Col>
                        <Button type="primary">Download Excel</Button>&nbsp;
                    </Col>
		        </Row>
                <Table
                    columns={ordersDeliveredColumns}
                    rowKey={record => record._id}
                    dataSource={[]}
                    pagination={pagination}
                    loading={loading}
                />
                </Card>
                </TabPane>
          </Tabs>
        );
        }
};


export default ManageOrders;