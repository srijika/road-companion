import React from 'react';
import {Empty, Card, Form,Typography, Alert,Input, InputNumber, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm , Select } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { connect } from 'dva';
const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

class Communication extends React.Component {

    constructor(props) {
        super(props);
        this.formRef = null;
    }

    validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        }
      };
  
    componentDidMount() {
        this.getDataList();  
    } 

    getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.communication.add) {
            this.formRef.resetFields();
            this.props.dispatch({ type: 'communication/clear' });
            this.getDataList();
			return true
		}else if (this.props.communication.update) {
            this.formRef.resetFields();
            this.props.dispatch({ type: 'communication/clear' });
            this.getDataList();
			return true
		}

        let commData = this.props.communication.list;
        if(commData){
            this.formRef.setFieldsValue({
                ['details']: commData[0].product_details, 
                ['specification']: commData[0].specification, 
                ['shipping']: commData[0].shipping_details, 
                ['quality']: commData[0].quality_details, 
                ['manufacture']: commData[0].manufaturer_details, 
                ['source']: commData[0].product_sources 
            })
        }
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {}
	}

    getDataList = () => {
        this.props.dispatch({ type: 'communication/getDataList', payload: { } });
    }

    onFinish = (val) => {
        if(this.props.communication.list){
                let id = this.props.communication.list[0]._id;
                let data = {
                    _id: id,
                    product_details: val.details,
                    specification: val.specification,
                    shipping_details: val.shipping,
                    quality_details: val.quality,
                    manufaturer_details: val.manufacture,
                    product_sources: val.source
                }
                this.props.dispatch({ type: 'communication/updateComm', payload:data});
        }else{
            let data = {
                product_details: val.details,
                specification: val.specification,
                shipping_details: val.shipping,
                quality_details: val.quality,
                manufaturer_details: val.manufacture,
                product_sources: val.source
            }
            this.props.dispatch({ type: 'communication/createComm', payload:data});
        }    
        
    } 

    render(){

       return (
           <div>
        <Card title={<span><LeftOutlined  /> Vendor Details</span>} style={{ marginTop: "0" }}>
                <Row justify="center">
                    <Col span={14} style={ {display : 'flex', justifyContent:'center'}}>
                        
                        <Form style={{maxWidth:'480px'}} onFinish={this.onFinish} ref={(ref) => this.formRef = ref}>

                            <Form.Item name={"details"} label="Product Details" rules={[ { required: true, }, ]} >
                                <TextArea style={{ width:'480px' }} />
                            </Form.Item>

                            <Form.Item name={"specification"} label="Specification" rules={[ { required: true, }, ]} >
                                <TextArea style={{ width:'480px' }} />
                            </Form.Item>

                            <Form.Item name={"shipping"} label="Shipping" rules={[ { required: true, }, ]} >
                                <TextArea style={{ width:'480px' }} />
                            </Form.Item>

                            <Form.Item name={"quality"} label="Quality" rules={[ { required: true, }, ]} >
                                <TextArea style={{ width:'480px' }} />
                            </Form.Item>

                            <Form.Item name={"manufacture"} label="Manufacture" rules={[ { required: true, }, ]} >
                                <TextArea style={{ width:'480px' }} />
                            </Form.Item>

                            <Form.Item name={"source"} label="Sources" rules={[ { required: true, }, ]} >
                                <TextArea style={{ width:'480px' }} />
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
        communication: state.communication,
        loading:state.loading
    }
};

export default connect(mapToProps)(Communication);