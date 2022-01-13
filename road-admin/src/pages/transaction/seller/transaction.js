import React from 'react';
import {Card, Form, Input, DatePicker, Button, Table, message, Row, Col, Modal} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import moment from 'moment';
const { RangePicker } = DatePicker;

class Transaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seller_id: this.props.match.params.id,  
            searchText:'',
            dateRange:{
                from: moment().format("YYYY-MM-01"),
                to:moment().add(1,'days').format("YYYY-MM-DD")
            },
            isAddMoneyModalVisible:false,
            name:'',
            email:'',
            contact:'',
            ifsc:'',
            account_number:'',
            amount:'',
            
        }
    }

    componentDidMount() {
        this.ListFun();
    } 

    ListFun=()=>{
		let payload = {
            limit: 100000,
            page: 0,
            dateFilter: { 
                "from_date": this.state.dateRange.from, 
                "to_date": this.state.dateRange.to
            },
            seller_id: this.props.match.params.id 
        }
        this.props.dispatch({type: 'transaction/getDataList',  payload: payload });
	}

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if(this.props.transaction.transaction && this.props.transaction.transaction.buss){
            let business = this.props.transaction.transaction.buss;
            this.setState({ name:business.username,
                email:business.bussnessInfo[0] ? business.bussnessInfo[0].bemail : '',
                contact:business.bussnessInfo[0] ? business.bussnessInfo[0].phone : '',
                ifsc: business.bussnessInfo[0] ? business.bussnessInfo[0].ifsc : '',
                account_number: business.bussnessInfo[0] ? business.bussnessInfo[0].acNumber : '',
                isAddMoneyModalVisible : true})  
            this.props.dispatch({type: 'transaction/clear' });
        }

        if(this.props.transaction.transaction && this.props.transaction.transaction.add){
            this.setState({isAddMoneyModalVisible : false})
            message.success('SuccessFully transfer money');
        }
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {}
	}

    searchVal=(val)=>{}

    onStartDateChange = (value, dateString) => {
        let dateRange = {
            from: dateString[0],
            to: dateString[1],
        }
        this.setState({dateRange:dateRange},()=>{ this.ListFun(); })
    }

    payNowAmount = () => {
        let payload = {
            seller_id : this.props.match.params.id
        }
        this.props.dispatch({type: 'transaction/getBussinessData',  payload:payload  });
    }
    
    addBankTransfer = () =>{
        if(parseFloat(this.state.amount) >= 0){
            let payload = {
                name: this.state.name,
                email: this.state.email,
                contact: this.state.contact,
                contact_type:"employee",
                account_type:"bank_account",
                ifsc: this.state.ifsc,
                account_number:this.state.account_number,
                amount:this.state.amount,
                currency:"INR",
                purpose:"refund"
            }
            this.props.dispatch({type: 'transaction/createBankTrn',  payload:payload  });
        }else{
            message.error('Add amount for bank transfer');
        }
        

    }
    handleCancel = () =>{
        this.setState({isAddMoneyModalVisible : false})
    }

    render(){
        let roleType = localStorage.getItem('role');
        const {transaction} = this.props;
        let dataSource = transaction.transaction.list ? transaction.transaction.list : []
        
        let footerFinalTotal = 0
        dataSource.forEach((item)=>{
            footerFinalTotal += parseFloat(item.total)
        })

          const columns = [
            {
                title: 'Product Name',
                render:(val,data)=> {
                    return data.product_details ? data.product_details.title ? data.product_details.title : '-' : '-'
                }
            },
            {
                title: 'Product Amount',
                render:(val,data)=> {
                    return data.amount ? '₹ ' + data.amount : '-'
                }
            },
            {
                title: 'Shipping Charge',
                render:(val,data)=> {
                    return data.shippingCharges ? '₹ ' + data.shippingCharges : '-'
                }
            },
            {
                title: 'Place Order',
                render:(val,data)=> {
                    return data.place_order ? '₹ ' + data.place_order : '-'
                }
            },
            {
                title: 'Commission',
                render:(val,data)=> {
                    let commission_per = data.category_details ? ' ('+data.category_details.commission+'%)' : ''
                    return data.commission_amount ? '₹ ' + data.commission_amount + commission_per  : '-'
                }
            },
            {
                title: 'GST',
                render:(val,data)=> {
                    let gst_per = data.category_details ? ' ('+data.category_details.gst+'%)' : ''
                    return data.gst ? '₹ ' + data.gst + gst_per  : '-'
                }
            },
            {
               title: 'Total',

                render:(val,data)=> {
                    return data.total ? '₹ ' + data.total  : '0'
                }
            },
          ];
       return (
           <div>
                <Row className="TopActionBar" justify="space-between" align="middle">
                    <Col span={12}>
                        <RangePicker 
                            onChange={this.onStartDateChange } 
                            format="YYYY-MM-DD"
                            value={[moment(this.state.dateRange.from), moment(this.state.dateRange.to)]}
                        />
                    </Col>
                    <Col span={12}>
                        <Card style={{ marginTop: "0" }}>
                            <div>
                                <h2> Total Amount : ₹ {footerFinalTotal} </h2>
                                {roleType=='ADMIN' ?  <Button className="ant-btn ant-btn-primary" onClick={() => this.payNowAmount() }>Pay Now</Button> : '' }
                            </div>   
                         </Card>
                    </Col>
                </Row>
                <Card title={<span>
                    {roleType=='ADMIN' ? <LeftOutlined onClick={()=> this.props.history.push('/seller') } /> : '' }
                    Transaction Details </span>}  style={{ marginTop: "0" }}>
                    <Table 
                    {... {size: 'small'}} 
                    rowKey={record => record._id}
                    dataSource={dataSource} columns={columns} />
                </Card>

                <Modal title="Transfer Money" visible={this.state.isAddMoneyModalVisible} onOk={() => this.addBankTransfer()} onCancel={this.handleCancel} >
                
                    <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Field required!', },]}  >
                        <Input placeholder="Full Name" defaultValue={this.state.name} onChange={(event)=> this.setState({name : event.target.value }) } />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Field required!', },]}  >
                        <Input placeholder="Email" defaultValue={this.state.email} onChange={(event)=> this.setState({email : event.target.value }) } />
                    </Form.Item>
                    <Form.Item name="contact" label="Mobile" rules={[{ required: true, message: 'Field required!', },]}  >
                        <Input placeholder="Mobile" defaultValue={this.state.contact} onChange={(event)=> this.setState({contact : event.target.value }) } />
                    </Form.Item>
                    <Form.Item name="ifsc" label="IFSC Code" rules={[{ required: true, message: 'Field required!', },]}  >
                        <Input placeholder="IFSC Code" defaultValue={this.state.ifsc} onChange={(event)=> this.setState({ifsc : event.target.value }) } />
                    </Form.Item>
                    <Form.Item name="account_number" label="Account Number" rules={[{ required: true, message: 'Field required!', },]}  >
                        <Input placeholder="Bank Account Number" defaultValue={this.state.account_number} onChange={(event)=> this.setState({account_number : event.target.value }) } />
                    </Form.Item>
                    <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Field required!', },]}  >
                        <Input placeholder="Amount" defaultValue={this.state.amount} onChange={(event)=> this.setState({amount : event.target.value }) } />
                    </Form.Item>
                </Modal>
           </div>
             
       );
        }
};

const mapToProps = (transaction, loading) => {
    return {
        transaction: transaction,
        global: global
    }
};

export default connect(mapToProps)(Transaction);