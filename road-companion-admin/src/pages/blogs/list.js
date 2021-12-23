import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Badge, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddEdit from './action/addEdit';
import { getTitleImage } from '../../utils/functions';
import Moment from 'react-moment'; 
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

class PagesList extends React.Component { 
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
			detail: '', 
			count: 0, 
			Addcount: 0,
			listData: []
		}

		setTimeout(() => document.title = 'Blog List', 100,);
		this.isUpdate = false;
	}
	
	componentDidMount() {
		this.ListFun();
		
	}


	
	ListFun = () => {
		this.props.dispatch({ type: 'blogs/blogsList', payload: {} });
		let data;

	
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.blogs.list.filter((auto) => 
									auto.title.toLowerCase().includes(val.toLowerCase()) || 
									auto.description.toLowerCase().includes(val.toLowerCase())
							)
		this.setState({ listData: resultAutos })
	}

	createCat = (val) => {
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
	}

	deletePages = id => {
		this.props.dispatch({ type: 'blogs/deleteBlogs', payload: id });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
        if ( this.props.blogs.delete) {
			this.props.dispatch({ type: 'blogs/clearAction'});
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

		console.log(this.props);

		const { blogs } = this.props;
		console.log('blogs.list dfgdfg')
		console.log(blogs.list)


		if (this.state.searchText == '') {

			this.state.listData = blogs.list ? blogs.list : [];
		}

		const columns = [
			{
				title: <strong>Title</strong>,
				dataIndex: 'title'
			},
			{ title: <strong>Meta Title</strong>, dataIndex: 'meta_title', },
			{ title: <strong>isActive</strong>, dataIndex: 'status',
				render: (value, row) => {
					console.log(value) 
					return <span>{value === "true" ? "Active" : "Deactive" }</span> 
				}
			},
			{
				title: <strong>Action</strong>, width: 100, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Button type="primary" onClick={()=>{this.props.history.push('/blogs/edit/' + data.slug )}}><EditOutlined /></Button>
					<Popconfirm title="Are you sure delete this coupon?" onConfirm={e => { this.deletePages(data.slug); e.stopPropagation() }} okText="Yes" cancelText="No" >
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
					<Col>
						<Button type="primary" onClick={() => this.props.history.push('/blogs/add')  }>Add</Button>
					</Col>
				</Row>

				<div className="innerContainer">
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

export default connect(({ blogs, loading }) => ({
	blogs, loading
}))(PagesList);