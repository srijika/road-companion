import React, {useState, useEffect} from 'react'
import { Card, Typography, Input, Button, Table, Row, Col, Avatar, Tabs, Modal, message } from 'antd';
import axios from 'axios'
import { EyeOutlined, QuestionOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { Text } = Typography;
const baseUrl = process.env.REACT_APP_ApiUrl
const { confirm } = Modal;
var moment = require('moment');


export default function AnnouncementList(props) {

	const [announcements, setAnouncements] = useState([]);

	useEffect(() => {
		getAnnouncements();
	}, [])

	const getAnnouncements = async () => {
		const res = await axios.post(`${baseUrl}/list/announcement`);
		let announcements =  res.data.announcements;
		setAnouncements(announcements);
	}

	const handleDelete = async (id) => {
		confirm({
			title: 'Do you Want to delete these items?',
			icon: <ExclamationCircleOutlined />,
			//content: 'Some descriptions',
			okText: 'Yes',
			cancelText: 'No',
			onOk() { return deleteItemFun(id) },
			onCancel() { console.log('Cancel'); },
		});
	}

	const deleteItemFun = async (id) => {
		let announcementData = announcements.filter((data) => {
			return data._id !== id
		});
		setAnouncements(announcementData);
		const res = await axios.post(`${baseUrl}/delete/${id}/announcement`);
	}


	const handleStatusAnnouncement = async (id) => {


		const res = await axios.post(`${baseUrl}/status/${id}/announcement`);
		console.log(res);

	}

	const columns = [
		
		{ title: <strong>Title</strong>, width: 100, dataIndex: 'title' },
		{ title: <strong>Message</strong>, width: 100, dataIndex: 'message', render: (val, data) => {
			return (
			<span className="ann_message">{data.message}</span>
			)
		}  },
		{ title: <strong> For Customer </strong>, width: 100, dataIndex: 'for_customer', render: (val, data) => {
			return (
				<h6> {data.for_customer === true ? "Yes" : "No"} </h6>
			)
		} },
		{ title: <strong> For Seller </strong>, width: 100, dataIndex: 'for_seller', render: (val, data) => {
			return (
				<h6> {data.for_seller === true ? "Yes" : "No"} </h6>
			)
		} },
		{ title: <strong> Status </strong>, width: 100, dataIndex: 'status', render: (val, data) => {
			return (
				<h6> {data.status === "1" ? "Active" : "Deactive"} </h6>
			)
		}},
		{ title: <strong> Created At </strong>, width: 100, dataIndex: 'created_at', render: (val, data) => {
			return (
				moment(data.created_at).format('DD-MM-YYYY')
			)
		} },

		{ title: <strong>Action</strong>, width: 100, render: (val, data) => 
					<div>
						<Button type="ghost" className="ant-btn-sm" title="Edit" onClick={() => { props.history.push(`announcement/${data._id}/edit`)  } }><EyeOutlined  /></Button>&nbsp;

						<Button type="danger" className="ant-btn-sm" title="Delete" onClick={() => { handleDelete(data._id) } }><DeleteOutlined  /></Button>&nbsp;
						
						{/* <Button type="danger" className="ant-btn-sm" title={`${(data.status === 0) ? "Active" : "Deactive"}  Announcement`} onClick={() => { handleStatusAnnouncement(data._id) } }> {(data.status === 0) ? "Active" : "Deactive"} </Button>&nbsp; */}
				</div>
		},
	];

	return (
		<div>
				
				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					{/* <Col>
						<Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText}
							loading={this.props.submitting} />
					</Col> 
					<Col>
						 <Button type="primary" onClick={() => this.downloadFile()}>Download Excel</Button>&nbsp;
				<Button type="primary" onClick={() => this.setState({ fileModel: true })}>Upload Excel</Button>&nbsp; 
					 <Button type="primary" onClick={() => this.props.history.push('/products/add')}>Add</Button>
					</Col>*/}
					<Col>
						<Button type="primary" onClick={() => props.history.push('/announcement/add')}>Add</Button>
					</Col>
				
				</Row> 

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns}  
							dataSource={announcements}
							// onChange={this.paginationFun} 
							rowKey={record => record._id}
							onRow={ (record) => {
								return {
									// onClick: () => this.props.history.push('/products/edit/' + record._id)
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
				{/* <UploadFile visible={fileModel} returnData={this.SelectedFile} closeModel={() => this.setState({ fileModel: false })} /> */}
		</div>
	)
}
