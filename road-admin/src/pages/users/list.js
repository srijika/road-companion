import React from 'react';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table,  Row, Col, Popconfirm, Modal, message, Upload} from 'antd';
import { DeleteOutlined, EyeOutlined  , CommentOutlined} from '@ant-design/icons';
import uploadFile from '../products/action/uploadFile';
// import AddEdit from './action/addEdit'
import axios from 'axios';
const { Search } = Input;
const { Text } = Typography;

const baseUrl = process.env.REACT_APP_ApiUrl;

class UsersList extends React.Component {
  constructor(props) {
    super(props);
	this.state = { limit:25, current:1, sortBy:'asc', addModel:false, inactive:false, searchText:'', loader:false, detail:'', count:0, listData: []}
	setTimeout(()=>document.title = 'User List', 100);
  }
	componentDidMount(){
		this.ListFun();
	}
	
	ListFun=()=>{
		let search = 'page='+(this.state.current-1)+"&limit="+this.state.limit+"&inactive="+this.state.inactive+"&searchText="+this.state.searchText+"&sortBy="+this.state.sortBy;
		localStorage.setItem('serviceSearch', JSON.stringify(this.state))

		let searchval = {limit:this.state.limit, role:"USER"}
		this.props.dispatch({type: 'users/getList',  payload: searchval,});
	  }
  
	ShowSizeChange=(current, size)  => this.setState({limit:size},()=>this.ListFun());
	switchFun=(val)  => this.setState({inactive:val},()=>this.ListFun());	
	ChangeOrder=(val)  =>this.setState({sortBy: this.state.sortBy === 'asc' ? 'desc':'asc'},()=>this.ListFun());
	paginationFun=(val)=> this.setState({current: val.current},()=>this.ListFun());
	
	searchVal=(val)=>{
		this.state.searchText = val
		const resultAutos = this.props.users.list.data.filter((auto) => auto.email.toLowerCase().includes(val.toLowerCase()))
		
		this.setState({ listData: resultAutos })
	}
	
	
	deleteItem=(id)=>{
		
		let val = {_id:id}
		this.props.dispatch({type: 'users/deleteItem', payload: val});
	} 
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
		
		let del = this.props.users.del;
        if ( del.count > this.state.count && del.status) {
            this.setState({count:del.count, btndis:false})
			return true
        }else if ( del.count > this.state.count && !del.status) {
			this.setState({count:del.count, btndis:false})
		}
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            this.ListFun();
        }
    }
	
	handleDeactiveUser = async (data) => {
		let list = this.state.listData;
		let list_update = list.map((item) => {
			if(item._id === data) {
				item.user_status = !item.user_status;
			}
			return item;	
		})
		this.setState({ listData: list_update })
		await axios.post(`${baseUrl}/user/status`, {id: data});
	}

	
	render(){
	const { searchText, } = this.state;
	const {users} = this.props;
	
	if(this. state.searchText == '') {
	 this.state.listData = users.list ? users.list.data:[];
	}

	const columns = [
	  {
		title: <strong className="primary-text cursor" onClick={this.ChangeOrder}>Name <i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
		dataIndex: 'name',
	
		render:(val,data)=> <div className={data.isActive ?"":'danger-text'}>{val}</div>
	  },
	  { title:<strong>Email</strong>, dataIndex: 'email',},
	  { title:<strong>Email Verified</strong>, dataIndex: 'isEmailVerified', render:(val,data)=> val?'Yes':'No'},
	  { title:<strong> Status </strong>, dataIndex: 'user_status', render:(val,data)=> 

	  <div>
	
		 <Popconfirm title={`Are you sure you want to ${data.user_status ? "Activate" : "Deactivate"} this user?`} onConfirm={e=> {this.handleDeactiveUser(data._id)}} okText="Yes" cancelText="No" >
			 <Button type="primary" >{data.user_status} {data.user_status ? "Deactivate" : "Activate"}  </Button>
		 </Popconfirm>
	  </div>
 },

	  { title:<strong>Action</strong>, width:150, //align:'center',
		render:(val,data)=> 
		<div>
			
		<Button type="primary" onClick={()=>{
			this.props.history.push('/users/edit/'+data._id)}}><EyeOutlined /></Button>&nbsp;
		<Popconfirm title="Are you sure delete this task?" onConfirm={e=> {this.deleteItem(data._id)}} okText="Yes" cancelText="No" >
		<Button type="danger" ><DeleteOutlined /></Button>
	  </Popconfirm>
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
			</Col>
			<Col>
			</Col>

		
		</Row>
		
		<div className="innerContainer">
				<Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
				  <Table columns={columns} dataSource={this.state.listData} 
					onChange={this.paginationFun}
					rowKey={record => record._id}
					pagination={{position: ['bottomLeft'], 
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

export default connect(({users, loading}) => ({
	users, loading
}))(UsersList);