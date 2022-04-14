import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Badge, Popconfirm } from 'antd';
import { ConsoleSqlOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
//import AddEdit from './action/addEdit';
import { getTitleImage } from '../../utils/functions';
import Moment from 'react-moment';
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

const baseUrl = process.env.REACT_APP_ApiUrl;

class ReviewList extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			limit: 25, 
			current: 1, 
			sortBy: 'asc', 
			addModel: false, 
			inactive: false, 
			searchText: '', 
			loader: false, 
			
			count: 0, 
			Addcount: 0,
			listData: []
		}
		setTimeout(() => document.title = 'User Reviews List', 100);
		this.isUpdate = false;
	}
	
	componentDidMount() {
		this.ListFun();
		
		
		
	}

	handleDeactiveReview = async (data) => {
		let list = this.state.listData;
		let list_update = list.map((item) => {
			if(item._id === data) {
				item.status = item.status == 'Activate' ? 'Deactivate' : 'Activate';
			}
			return item;	
		})
		this.setState({ listData: list_update })
		await axios.post(`${baseUrl}/api/review-status`, {id: data});
	}

	
	
	ListFun = () => {
		this.props.dispatch({ type: 'reviews/reviewList', payload: { user_id: this.props.match.params.userId } });
		//this.props.dispatch({type: 'users/getDetail', payload: { _id:  this.props.match.params.userId, profile_id:  this.props.match.params.userId }});
		
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.reviews.list.filter((auto) => 
									auto.description.toLowerCase().includes(val.toLowerCase()) 
							)
		this.setState({ listData: resultAutos })
	}

	
	deleteReview = id => {
		
		this.props.dispatch({ type: 'reviews/deleteReview', payload: id  });
	}
	
	getSnapshotBeforeUpdate(prevProps, prevState) {
        if ( this.props.reviews.delete) {
			this.props.dispatch({ type: 'reviews/clearAction'});
            this.ListFun();
			return true
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
        }
    }

	render() {
		const { inactive, limit, searchText, addModel, detail } = this.state;
		const { reviews } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = reviews.list ? reviews.list : [];
			
		}

		const columns = [
			{ title:<strong> Users  </strong>, dataIndex: 'data.reviewer_id.email', render:(val,data)=> 

			<div>
				{data.reviewer_id.email}
			</div>
			 },
			{
				title: <strong>Review</strong>,
				dataIndex: 'description'
			},
			{
				title: <strong>Rating</strong>,
				dataIndex: 'rating'
			},
			
			{ title:<strong> Status </strong>, dataIndex: 'status', render:(val,data)=> 

			<div>
				<Popconfirm title={`Are you sure you want to ${data.status ? "Activate" : "Deactivate"} this review?`} onConfirm={e=> {this.handleDeactiveReview(data._id)}} okText="Yes" cancelText="No" >
					<Button type="primary" > {data.status=='Activate' ? data.status : data.status}  </Button>
				</Popconfirm>
			</div>
			},
			{
				title: <strong>Action</strong>,  align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Button type="primary" onClick={()=>{this.props.history.push('/users/reviews/edit/' + data._id )}}><EditOutlined /></Button>
					<Popconfirm title="Are you sure delete this reveiw?" onConfirm={e => { this.deleteReview(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
						<Button type="danger" ><DeleteOutlined /></Button>
					</Popconfirm>
				</div>
			},
		];
		return (
			<div>
				<Apploader show={this.props.loading.global} />
				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					<Col>
						<Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText} />
					</Col>
					{/* <Col>
						<Button type="primary" onClick={() => this.props.history.push('/car-type/add')  }>Add</Button>
					</Col> */}
				</Row>

				<div className="innerContainer">
					<div><h3>User Reviews :   </h3></div>
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							rowKey={record => record._id}
							onRow={(record, rowIndex) => {
								return {
									// onClick: event => this.setState({ addModel: true, detail: record })
								};
							}}
							pagination={{
								position: ['bottomLeft'],
								showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
								responsive: true,
								onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
								pageSizeOptions: ['25', '50', '100', '250', '500'],
							}}
						/>
					</Card>
				</div>

			</div>

		);
	}
};

export default connect(({ reviews,users,global, loading }) => ({
	reviews,users,loading,global
}))(ReviewList);