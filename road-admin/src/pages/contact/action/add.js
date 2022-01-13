import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from './../../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Form, Typography, Alert,Input, InputNumber, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm , Select } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
const { Option } = Select;

const { Search } = Input;
const { Text } = Typography;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

class Help extends React.Component {

    state = {
    };
    validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        }
      };
  
    onFinish = (values) => {
        console.log(values);
        this.props.dispatch({ type: 'ticket/createTicket', payload:values});
    }

    componentDidMount() {
    //   this.getList();  
    } 

    componentDidUpdate() {
         const { add } = this.props;
        if(add) {
            this.props.history.push('/help');
        }
    }

    // getList = () => {
    //   const user = jwt_decode(localStorage.getItem('token'));
    //   if(user.role === "ADMIN") {
        // this.props.dispatch({type: 'order/orderList',  payload: {
        //   page:0,
        //   limit:this.state.limit,
        //   role:"ADMIN"
        // },});
    //   } else {
    //     this.props.dispatch({type: 'ticket/ticketList',  payload: {
    //       seller_id:"5f4b6868d775c86026acf17a",
    //       page:0,
    //       limit: this.state.limit,
    //       role:"SELLER"
    //     },});
    //   }
    // }
    


   
    render(){
       return (
           <div>
        <Apploader show={this.props.loading.global}/>
        <Card title={<span><LeftOutlined onClick={() => this.props.history.push('/help')} /> Add Ticket</span>} style={{ marginTop: "0" }}>
                <Row justify="center">
                    <Col span={14} style={ {display : 'flex', justifyContent:'center'}}>
                    <Form {...layout} onFinish={(values) => {this.onFinish(values)}} validateMessages={this.validateMessages} style={{maxWidth:'480px'}}>
                            <Form.Item
                                name={"title"}
                                label="Title"
                                rules={[
                                {
                                    required: true,
                                },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name={"email"}
                                label="Email"
                                rules={[
                                {
                                    type: 'email',
                                    required:true
                                }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
                                <Select
                                placeholder="Select pariority"
                                allowClear
                                >
                                <Option value="Low">Low</Option>
                                <Option value="Medium">Medium</Option>
                                <Option value="High">High</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item 
                            name={"description"} label="Description" rules={[{ required: true }]}>
                                <Input.TextArea />
                            </Form.Item>
                            <div style={{ display:'flex', justifyContent:'center'}}>
                            <Button htmlType="submit" type="primary">
                                Submit
                            </Button>
                            </div>
                     </Form>
                    </Col>
                </Row>
            </Card>
           </div>
       );
        }
};

const mapToProps = (state) => {
return {
    add: state.ticket.add,
    loading:state.loading
}
};

export default connect(mapToProps)(Help);