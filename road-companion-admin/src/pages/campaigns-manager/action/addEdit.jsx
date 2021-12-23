import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Row, Col, Table, Card, Typography, Form, Input, Button, DatePicker,Image,  Avatar, InputNumber } from 'antd';
import { connect } from 'dva';
import { LeftOutlined, LoadingOutlined, EditOutlined, CloseOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

import moment from 'moment';
import Item from 'antd/lib/list/Item';
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const { Text } = Typography;
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const baseUrl = process.env.REACT_APP_ApiUrl;

const AddEditCampaign = props => {
    const [form] = Form.useForm();
    const { dispatch, campaign  } = props;
    const [prodlist, setProdlist] = useState([]);
    const [selectedRowKeyList, setSelectedRowKeylist] = useState([]);
    const [defaultBid, setDefaultBid] = useState([]);
    const [count, setCount] = useState(0);
	const [ecount, setECount] = useState(0);
    const dateFormat = 'YYYY/MM/DD';
   
    const onFinish = val => {
        val.start_date = moment(val.start_date).format('YYYY/MM/DD');
        val.end_date = moment(val.end_date).format('YYYY/MM/DD');
        val.products = selectedRowKeyList;
        if (props.match.params.id) {
            val.campaign_id = props.match.params.id;
            dispatch({ type: 'campaign/campaignUpdate', payload: val });
        }else{
            dispatch({ type: 'campaign/campaignAdd', payload: val });
        }
    }

    useEffect(() => {
        let unmounted = false;
        window.scroll(0, 0);
        props.dispatch({ type: 'campaign/productList' });
        if (props.match.params.id) {
            DetailFun(props.match.params.id)  
        }
                
        // props.dispatch({ type: 'campaign/campaignDetail' });

        return () => { unmounted = true; }
    }, [dispatch])

    const DetailFun = (id) => {
        props.dispatch({ type: 'campaign/campaignDetail', payload: { campaign_id: id } });
    }

    useEffect (()  => {
        let unmounted = false;
        
        // console.log(props.campaign);

        if (props.campaign.plist.data && props.campaign.plist.data.length > 0) {
            setProdlist(props.campaign.plist.data)
        }  
		
        let add = props.campaign.add
        if (!unmounted && add.count > count && add.status) {
            setCount(add.count);
            props.dispatch({ type: 'campaign/clearAction'})
            props.history.push('/campaigns-manager');
        }

        let update = props.campaign.update
        if (!unmounted && update.count > count && update.status) {
            setCount(update.count);
            props.dispatch({ type: 'campaign/clearAction'})
            props.history.push('/campaigns-manager');
        }
        // Edit
        let edit = props.campaign.edit
        if (!unmounted && edit.count > ecount && edit.status) {
            setECount(edit.count);
        } else if (!unmounted && edit.count > ecount && !edit.status) {
            setECount(edit.count);
        }


        // detail
        
        console.log(props.campaign)
        if (props.match.params.id) {
            let detail = props.campaign.detail
            if (!unmounted && detail && detail.status) {
                let data = detail.result.campaign;
                
                form.setFieldsValue({
                    ['campaign_name']: data.name, 
                    ['budget']: data.budget, 
                    ['daily_budget']: data.daily_budget, 
                    ['name_of_group']: data.name_of_group, 
                    ['default_bid']: data.default_bid,
                    ['start_date']: moment(data.start_date, dateFormat), 
                    ['end_date']: moment(data.end_date, dateFormat)
                });
                setSelectedRowKeylist(data.products);
            }
        }
        return () => { unmounted = true; }
    }, [props.campaign])

    const onSelectedRowKeysChange = (selectedRowKeys) => {
        console.log("onSelectedRowKeysChange :", selectedRowKeys);
        setSelectedRowKeylist(selectedRowKeys);
    }

    return (

        <Card title={<span><LeftOutlined onClick={() => props.history.push('/campaigns-manager')} /> {props.detail ? 'Edit Campaign' : 'Add Campaign'}</span>} style={{ marginTop: "0" }}>
            <Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
                <Row gutter={15}>
                    <Col flex="auto">
                        <Row gutter={15}>
                            <Col sm={24} md={12}>
                                <Form.Item name="campaign_name" label="CAMPAIGN NAME" rules={[{ required: true, message: 'Field required!' },]}  >
                                    <Input placeholder="Campaign Name" />
                                </Form.Item>
                            </Col>
                            <Col sm={24} md={12}>
                                <Form.Item name="budget" label="BUDGET" rules={[{ required: true, message: 'This field is required!' }]} >
                                    <InputNumber min={0} placeholder="Budget" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={15}>
                            <Col sm={24} md={12}>
                                <Form.Item name="daily_budget" label="DAILY BUDGET" rules={[{ required: true, message: 'This field is required!' }]} >
                                    <InputNumber min={0} placeholder="Daily Budget" />
                                </Form.Item>
                            </Col>
                            <Col sm={24} md={12}>
                                <Form.Item name="name_of_group" label="NAME OF GROUP" rules={[{ required: true, message: 'This field is required!' }]}>
                                    <Input min={0} placeholder="Name of group" />
                                </Form.Item>
                            </Col>
                        </Row>

                       
                        <Row gutter={15}>
                            <Col sm={24} md={12}>
								<Form.Item name="default_bid" label="DEFAULT BID" rules={[{ required: true, message: 'This field is required!' }]}>
                                <Input min={0} placeholder="Default Bid" />
								</Form.Item>
							</Col>
                            <Col sm={12} md={6}>
                                <Form.Item name="start_date" label="START DATE" rules={[{ required: true, message: 'This field is required!' }]} >
                                    <DatePicker format={dateFormat}/>
                                </Form.Item>
                            </Col>
                            <Col sm={12} md={6}>
                                <Form.Item name="end_date" label="END DATE" rules={[{ required: true, message: 'This field is required!' }]}>
                                    <DatePicker format={dateFormat}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Table  rowSelection={{
                                    selectedRowKeys: selectedRowKeyList,
                                    onChange: onSelectedRowKeysChange,
                                }}  
                                dataSource={prodlist} 
                                columns={[
                                {
                                    title: <strong className="primary-text cursor">Title</strong>,
                                    render:(val,data) => {
                                        return data.title
                                    }
                                },
                                {
                                    title: <strong className="primary-text cursor">Category</strong>,
                                    render:(val,data) => {
                                        return (data.category ? data.category[0].name:'-')
                                    }
                                },
                                {
                                    title: <strong className="primary-text cursor">SKU</strong>,
                                    render:(val,data) => {
                                        return data.sku
                                    }
                                },
                                {
                                    title: <strong className="primary-text cursor">Sale Price</strong>,
                                    render:(val,data) => {
                                        return data.sale_price
                                    }
                                },
                            ]} 
                            rowKey={record => record._id}  />

                         <br/>   
                        <Form.Item className="mb-0">
                            <Button >Cancel</Button>&nbsp;&nbsp;
                            <Button type="primary"  className="btn-w25 btn-primary-light" onClick={() => form.submit()}>Save</Button>
                        </Form.Item>

                    </Col>
                </Row>
            </Form>

        </Card>
    )
        

};

export default connect(({ campaign, global, loading }) => ({
    campaign: campaign,
    global: global
}))(AddEditCampaign);