import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table,  Row, Col, Tabs, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddEdit from './action/addEdit';
import { getTitleImage } from '../../utils/functions';
import Moment from 'react-moment';
const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

class CarModelList extends React.Component {
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

		setTimeout(() => document.title = 'Car Brand List', 100,);
		this.isUpdate = false;
	}
	
	componentDidMount() {
		this.ListFun();
		
	}


	
	ListFun = () => {
		this.props.dispatch({ type: 'carModels/carModelList', payload: {} });
	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val;
		const resultAutos = this.props.carModels.list.filter((auto) => 
									auto.brand_name.toLowerCase().includes(val.toLowerCase()) 
							)
		this.setState({ listData: resultAutos })
	}

	createCat = (val) => {
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
	}

	deleteCars = id => {

		this.props.dispatch({ type: 'carModels/deleteCarModel', payload: id });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
        if ( this.props.carModels.delete) {
			this.props.dispatch({ type: 'carModels/clearAction'});
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
		const { carModels } = this.props;
		if (this.state.searchText == '') {
			this.state.listData = carModels.list ? carModels.list : [];
			
		}

		const columns = [
			{
				title: <strong>Brand Name</strong>,
				render: (val, data) => <>{data?.car_id?.brand_name}</>
			},
			{
				title: <strong>Model Name</strong>,
				dataIndex: 'car_model'
			},
			
			{ title: <strong>isActive</strong>, dataIndex: 'isActive',
				render: (value, row) => {
					return <span>{value === true ? "True" : "False" }</span> 
				}
			},
			{
				title: <strong>Action</strong>,  align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Button type="primary" onClick={()=>{this.props.history.push('/car-models/edit/' + data._id )}}><EditOutlined /></Button>
					<Popconfirm title="Are you sure delete this car model?" onConfirm={e => { this.deleteCars(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
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
						<Button type="primary" onClick={() => this.props.history.push('/car-models/add')  }>Add</Button>
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

export default connect(({ carModels, loading }) => ({
	carModels, loading
}))(CarModelList);