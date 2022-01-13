import React from 'react';
import { Link } from 'react-router-dom';
import { Router } from 'react-router';
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { LeftOutlined, UserOutlined, LockOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import { Form, Checkbox } from 'antd';
const { Search } = Input;
const { Text } = Typography;


class FAQAddEdit extends React.Component {

    isLoadedDetils = false;
    state = {
        availability: true,
        faqEdit:[],
    };
    constructor(props) {
        super(props);
        this.formRef = null;
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            let data = JSON.parse(localStorage.getItem('faqedit'))
            this.formRef.resetFields();
            this.formRef.setFieldsValue({
                ['questions']: data.questions, 
                ['answers']: data.answers, 
            })    
        }
    }


    onFinish = (data) => {
        if (!this.props.match.params.id) {
            data.userId = localStorage.getItem('userId');
            this.props.dispatch({ type: 'FAQ/createFAQ', payload: { ...data } });
        } else {
            data.userId = localStorage.getItem('userId');
            data.faq_id = this.props.match.params.id;
            this.props.dispatch({ type: 'FAQ/updateFAQ', payload: { ...data } });
        }
        this.formRef.resetFields();
        setTimeout(() => {
            this.props.history.push('/FAQ');
        }, 500);
    }

    onChangeAvailability = (e) => {
        this.setState({ availability: e.target.checked });
    }

    render() {
        let roleType = localStorage.getItem('role');
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };
        
        return (
            <div>
                <div className="innerContainer">
                    <Card title={<div><span><LeftOutlined onClick={() => this.props.history.push('/FAQ')} /></span>&nbsp;{this.props.match.params.id ? "Edit FAQ" : "Add FAQ"}</div>} bodyStyle={{ padding: '0 15px 15px' }}>
                        <div style={{ padding: "1rem" }} >
                            <Form
                                {...layout}
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={this.onFinish}
                                ref={(ref) => this.formRef = ref} >

                                <Form.Item
                                    label="Question"
                                    name="questions"
                                    style={{width:"500px"}}
                                    rules={[{ required: true, message: 'Please input questions!' }]} >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Answer"
                                    name="answers"
                                    style={{width:"500px"}}
                                    rules={[{ required: true, message: 'Please input Answer!' }]} >
                                    <Input.TextArea />
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
export default connect(({ FAQ }) => FAQ)(FAQAddEdit);