import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider, Select ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
const { Search } = Input;
const { Text } = Typography;
const dateFormat = 'YYYY/MM/DD';
class ApproveBusiness extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			limit:25, current:1, sortBy:'asc', isDropDown: false, addModel:false, 
			inactive:false, searchText:'', loader:false, detail:'', count:0,
			modelVisible:false, 
			RejectionMessage:'', 
			selectedUsers:0, 
			isBussinessVerified: false, 
			cancelModalShowError:''
		}

		setTimeout(()=>document.title = 'BusinessList', 100);
	}
	componentDidMount(){
		this.ListFun();
	}
	
	ListFun=()=>{
		let search = 'page='+(this.state.current-1)+"&limit="+this.state.limit+"&inactive="+this.state.inactive+"&searchText="+this.state.searchText+"&sortBy="+this.state.sortBy;
		localStorage.setItem('serviceSearch', JSON.stringify(this.state))
		let searchval = {page:this.state.current-1, limit:this.state.limit, inactive:this.state.inactive, searchText:this.state.searchText, sortBy:this.state.sortBy}
		this.props.dispatch({type: 'setting/AllBussiness', payload: searchval});
	  }
  
	ShowSizeChange=(current, size)  => this.setState({limit:size},()=>this.ListFun());
	switchFun=(val)  => this.setState({inactive:val},()=>this.ListFun());	
	ChangeOrder=(val)  =>this.setState({sortBy: this.state.sortBy === 'asc' ? 'desc':'asc'},()=>this.ListFun());
	paginationFun=(val)=> this.setState({current: val.current},()=>this.ListFun());
	
	searchVal = (val) => {
		this.state.searchText = val
		const resultAutos = this.props.setting.busslist.data.filter((auto) => auto.storeName.toLowerCase().includes(val.toLowerCase()))
		this.setState({ listData: resultAutos })
	}

	onChangeFilter = (val) => {
		if(val == "true"){
			let searchval = {page:this.state.current-1,"isGstNo": true, limit:this.state.limit, inactive:this.state.inactive, searchText:this.state.searchText, sortBy:this.state.sortBy}
			this.props.dispatch({type: 'setting/AllBussiness', payload: searchval});
		}
		else{
			let searchval = {page:this.state.current-1,"isGstNo": false, limit:this.state.limit, inactive:this.state.inactive, searchText:this.state.searchText, sortBy:this.state.sortBy}
			this.props.dispatch({type: 'setting/AllBussiness', payload: searchval});
		}
	}
	
	GetNoteForRejection = (event) => {
		this.setState({RejectionMessage : event.target.value});
	}

	RejectItem=(data)=>{
		this.setState({selectedUsers:data, isBussinessVerified:false , modelVisible:true})
	} 
	
	approvedItem=(user_id)=>{
		let data = {
			user_id: user_id,
			isBussinessVerified: true,
			note: "congratulations galinukkad team will contact you shortly"
		}
		this.props.dispatch({type: 'setting/approveBuss', payload: data});
		this.setState({RejectionMessage:'',selectedUsers:0, isBussinessVerified:false, modelVisible:false, cancelModalShowError:''})
		// this.setState({selectedUsers:data, isBussinessVerified:true , modelVisible:true})
	} 
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		let approve = this.props.setting.approve;	
        if (approve && approve.status && approve.count > this.state.count) {
            this.setState({count:approve.count})
			return true
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            this.ListFun()
        }
    }
	
	handleModelOk = () => {
		if(!this.state.RejectionMessage || this.state.RejectionMessage.length == 0) {
			this.state.RejectionMessage = 'Your request is not approved as we could not verify this details. Please reach out to our team or share the time convenient to you. We will get in touch';
        }
		let data = {
			user_id: this.state.selectedUsers,
			isBussinessVerified: this.state.isBussinessVerified,
			note: this.state.RejectionMessage
		}
		this.props.dispatch({type: 'setting/approveBuss', payload: data});
		this.setState({RejectionMessage:'',selectedUsers:0, isBussinessVerified:false, modelVisible:false, cancelModalShowError:''})
	};

	handleModelCancel = () => {
		this.setState({RejectionMessage:'', selectedUsers:0, isBussinessVerified:false,  modelVisible:false, cancelModalShowError:'' })
	};

	render(){
	const {inactive, limit, searchText, addModel, detail } = this.state;
	const {setting} = this.props;
	if(this.state.searchText == '') {
		this.state.listData = setting.busslist ? setting.busslist.data:[];
	}
	const total = 0;//list ? list.total : 0;
	const totalActive = 0 //list ?  list.totalActive : 0;
	const columns = [
		{ title:<strong>Submited On</strong>, dataIndex: 'updated', render: val=> moment(val).format(dateFormat)},
	  {
		title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>Business Name <i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
		dataIndex: 'storeName',
		render:(val,data)=> <div className={data.isActive ?"":'danger-text'}>{val}</div>
	  },
	  { title:<strong>Phone</strong>, dataIndex: 'phone',},
	  { title:<strong>Verified</strong>, dataIndex: 'user.isEmailVerified', render:(val,data)=> <div className={data.isActive ?"":'danger-text'}>{data.user.isBussinessVerified ?'Yes':'No'}</div>},
	  { title:<strong>GST</strong>, dataIndex: 'gstno',},	  
	  
	  { title:<strong>Action</strong>,render:(val, data)=> 
	  <div onClick={e=> e.stopPropagation()}>
		<div>
		&nbsp;
		<Popconfirm title="Do you want to approve this?" onConfirm={e=> {this.approvedItem(data.user ? data.user._id : ''); e.stopPropagation()}} 
		okText="Yes" cancelText="No" disabled={data.user.isBussinessVerified}>
			<Button type="primary" disabled={data.user.isBussinessVerified}><CheckOutlined /></Button>
		</Popconfirm>
		&nbsp;
		<Popconfirm title="Do you want to reject this?" onConfirm={e=> {this.RejectItem(data.user ? data.user._id : ''); e.stopPropagation()}} 
		okText="Yes" cancelText="No" disabled={!data.user.isBussinessVerified}>
			<Button type="danger" disabled={!data.user.isBussinessVerified}><CloseOutlined /></Button>
	  </Popconfirm>
	  &nbsp;
	  <Button type="primary" onClick={()=>this.props.history.push('/approve/business-verify/'+data._id)}><EyeOutlined /></Button>
	  </div>

	  </div>
	  },
	];
  return (
	<div>
		<Apploader show={this.props.loading.global}/>
		<Row className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
			<Col>
				<Search placeholder="Search..." onChange={(e)=>this.searchVal(e.target.value)} value={searchText}
				loading={this.props.submitting}	/>
				<Select placeholder="Business GST Status" onChange={(e)=>this.onChangeFilter(e)}>
					<Select.Option value="true">Bussiness with GST</Select.Option>
					<Select.Option value="false" selected>Bussiness without GST</Select.Option>
				</Select>
			</Col>
			<Col>
			</Col>
		</Row>
		
		<Modal
			title="Write Some Note Here!"
			visible={this.state.modelVisible}
			onOk={this.handleModelOk}
			onCancel={this.handleModelCancel} >
			 <Input size="large" placeholder="Note" onChange={(e)=>this.GetNoteForRejection(e)} prefix={<UserOutlined />} />
			 <br/>
              <span style={{color: 'red'}}>
                <small>{this.state.cancelModalShowError ? this.state.cancelModalShowError : ""}</small>
              </span>
		</Modal>

		<div className="innerContainer">
				<Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px'}}>
				  <Table columns={columns} dataSource={this.state.listData} 
					onChange={this.paginationFun}
						rowKey={record => record._id}
						onRow={(record, rowIndex) => {
							return {
							};
						}}
					
					pagination={{position: ['bottomLeft'], 
						defaultCurrent:1,
						total:total, pageSize: limit,
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

export default connect(({setting, loading}) => ({
	setting, loading
}))(ApproveBusiness);