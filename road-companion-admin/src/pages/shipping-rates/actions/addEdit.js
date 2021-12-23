import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm  } from 'antd';
import { LeftOutlined , UserOutlined, LockOutlined, DeleteOutlined,EyeOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import {Form , Checkbox} from 'antd';
const { Search } = Input;
const { Text } = Typography;


class ShippingRatesAddEdit extends React.Component {

    isLoadedDetils = false;
    state = {
        availability:true
    };
    constructor(props) {
        super(props);
        this.formRef = null;
    }

    componentDidUpdate() {
       

        if(this.props.single && !this.isLoadedDetils) {
            this.isLoadedDetils = true;
            this.formRef.resetFields();
            setTimeout(() => {
                this.formRef.setFieldsValue({
                    ...this.props.single 
                });
                this.setState({availability:this.props.single.availability})
            },100);
        }
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            this.isLoadedDetils = false;
            this.props.dispatch({type: 'shippingRate/shippingRate',  payload: {id:this.props.match.params.id}});
            
        }
    }
    render(){
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          };
          const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
          };
          const onFinish = (data) => {
              data.availability = this.state.availability;
              console.log({data:data})
              if(!this.props.match.params.id) {
                this.props.dispatch({type: 'shippingRate/createRate',  payload: {...data}});
              } else {
                data._id = this.props.match.params.id;
                this.props.dispatch({type: 'shippingRate/updateRate',  payload: {...data}});
              }
              this.formRef.resetFields();
              this.setState({availability:false});
              setTimeout(() => {
                this.props.history.push('/shipping-rates');
            },500);
          }
          const onChangeAvailability = (e) => {
            this.setState({availability:e.target.checked});
          }
          
          
      return (
        <div>
            {/* <Apploader show={this.props.loading.global}/> */}
            <div className="innerContainer">
                    <Card title={<div><span><LeftOutlined onClick={() => this.props.history.push('/shipping-rates')} /></span>&nbsp;{this.props.match.params.id?"Edit Shipping Charge":"Add Shipping Charge"}</div>} bodyStyle={{padding:'0 15px 15px'}}>
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
                    onFinish={onFinish}
                    ref={(ref) => this.formRef = ref}
                    >
                    <Form.Item
                        label="Weight"
                        name="weight"
                        rules={[{ required: true, message: 'Please input weight!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Zone"
                        name="zone"
                        rules={[{ required: true, message: 'Please input zone!' }]}
                    >
                        <Input />
                    </Form.Item>
                        <Form.Item
                        label="Price"
                        name="price"
                        type="number"
                        rules={[{ required: true, message: 'Please input price!' }]}
                    >
                            <Input type="number" />
                    </Form.Item>
                  
                    <Form.Item
                    label="Availability"
                    name="availability"
                    >
                        <Checkbox checked={this.state.availability} onChange={onChangeAvailability}>availability</Checkbox>
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
export default connect(({shippingRate}) => shippingRate)(ShippingRatesAddEdit);