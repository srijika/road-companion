import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm  } from 'antd';
import { LeftOutlined , UserOutlined, LockOutlined, DeleteOutlined,EyeOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import {Form} from 'antd';
const { Search } = Input;
const { Text } = Typography;


class PlanAddEdit extends React.Component {

    render(){
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          };
          const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
          };
          
      return (
        <div>
            {/* <Apploader show={this.props.loading.global}/> */}
            <div className="innerContainer">
                    <Card title={<div><span><LeftOutlined onClick={() => this.props.history.push('/plans')} /></span>&nbsp;Add Plan</div>} bodyStyle={{padding:'0 15px 15px'}}>
                   <div
                   style={
                    {display : "flex",
                     justifyContent: "center",
                     alignItems: "center",
                    padding: "1rem"}
                    }
                   >
                       <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    >
                    <Form.Item
                        label="Plan Name"
                        name="planName"
                        rules={[{ required: true, message: 'Please input plan name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Banner"
                        name="banner"
                        rules={[{ required: true, message: 'Please input no of banner allowed!' }]}
                    >
                        <Input />
                    </Form.Item>
                        <Form.Item
                        label="vidoes"
                        name="promoVideos"
                        rules={[{ required: true, message: 'Please input no of videos!' }]}
                    >
                            <Input />
                    </Form.Item>
                  

                    <Form.Item
                        label="Products"
                        name="support"
                        rules={[{ required: true, message: 'Please input no of products!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input total price!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>
                    </Form>
                   </div>
                    </Card>
            </div>                
        </div>
      );
        }
};

export default connect()(PlanAddEdit);