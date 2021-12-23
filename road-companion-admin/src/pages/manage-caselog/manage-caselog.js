import React from 'react';
import { Link } from 'react-router-dom';
import { Router } from 'react-router';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Empty, Card, Typography, message, Descriptions, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode";

const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { confirm } = Modal;

class ManageCaseLog extends React.Component {

  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 25,
      limit: 25,
    },
    searchText: '',
    listAllData:[],
    loading: false,
    roleType: '',
    isDetailsModalVisible: false,
    detailsModalData: {},
    isResponseModalVisible: false,
    responseModalData: {},
  };

  componentDidMount() {
    this.state.roleType = localStorage.getItem('role');
    this.ListFun();
  }

  ListFun = () => {
    let searchval = {  page: this.state.pagination.current - 1, limit: this.state.pagination.limit }
    this.props.dispatch({ type: 'caseLog/caseLogList', payload: searchval });
  }

  openDetailsModal = (data) => {
    this.setState({ detailsModalData: data, isDetailsModalVisible: true });
  }

  handleDetailsModalCancel = () => {
    this.setState({ detailsModalData: {}, isDetailsModalVisible: false });
  }

  openResponseModal = (data) =>{
    this.setState({ responseModalData: data, isResponseModalVisible: true });
  }

  handleResponseModalCancel = () => {
    this.setState({ responseModalData: {}, isResponseModalVisible: false });
  }

  updateAnswer = (event) =>{
    let data = this.state.responseModalData;
    data.replay = event.target.value
    this.setState({ responseModalData : data });
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.caseLog.edit.status) {
      this.setState({isResponseModalVisible: false });
			this.props.dispatch({ type: 'caseLog/clear' });
      this.ListFun();  
			return true
		}
    if (this.props.caseLog.del.status) {
			this.props.dispatch({ type: 'caseLog/clear' });
      this.ListFun();  
			return true
		}
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {}
	}

  handleResponseModalOk = () =>{
    if(this.state.responseModalData.replay.length > 0){
        let rData = {
          caselog_id: this.state.responseModalData._id, 
          message: this.state.responseModalData.message,
          replay : this.state.responseModalData.replay,
        } 
      this.props.dispatch({ type: 'caseLog/updateCaseLog', payload: rData });
    }else{
      message.error("You need to write answer!",5)
    }
  }

  deleteCaseLog = (listData) => {
    let that = this;
		confirm({
			title: 'Do you Want to Close these Ticket?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Yes',
			cancelText: 'No',
			onOk() { return that.deleteTicketOK(listData) },
			onCancel() { console.log('Cancel'); },
		});
  }

  deleteTicketOK = (listData) =>{
    let rData = {
        _id: listData._id
    } 
    this.props.dispatch({ type: 'caseLog/deleteCaseLog', payload: rData });
  }
  
  searchVal = (val) => {
		this.state.searchText = val;
    const { caseLog } = this.props;
    let ManageCaselog = caseLog.list.ManageCaselog ? caseLog.list.ManageCaselog : [];
		const resultAutos = ManageCaselog.filter((auto) => auto._id.toLowerCase().includes(val.toLowerCase()) || 
                                                        auto.message.toLowerCase().includes(val.toLowerCase()) || 
                                                        auto.seller.username.toLowerCase().includes(val.toLowerCase()) || 
                                                        auto.seller.mobile_number.toLowerCase().includes(val.toLowerCase()) || 
                                                        auto.seller.email.toLowerCase().includes(val.toLowerCase()) 
                                                        )
		this.setState({ listAllData: resultAutos })
	}

  render() {
    const { pagination, loading } = this.state;
    const { caseLog } = this.props;
    if (this.state.searchText == '') {
      this.state.listAllData = caseLog.list.ManageCaselog ? caseLog.list.ManageCaselog : [];
    }

    const productsAvilabilityColumns = [
      {
        title: 'Ticket ID',
        width: 150,
        render: (val, data) => {
          return <a className="text-info" onClick={() => { 
               
            this.props.history.push(`/user/${data.loginid}/${data._id}/queries`) }}>{data._id}</a>
        }
      },
      {
        title: 'UserName',
        width: 150,
        render: (val, data) => {
          return data.seller ? data.seller.username : ''
        }
      },
      {
        title: 'Mobile/Email',
        width: 150,
        render: (val, data) => {
          return data.seller.mobile_number.length > 0 ? data.seller.mobile_number : data.seller.email
        }
      },
      {
        title: 'Title',
        width: 150,
        dataIndex: 'title',
      },
     
      {
        title: 'Status',
        width: 100,
        render: (val, data) => {
          return data.status == 1 ? <span style={{ color: "green" }}>open</span> : <span style={{ color: "red" }}>closed</span>;
        }
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        width: 150,
        render: (val, data) => {
          return <div>
            {/* <Button style={{ marginBottom: '5px', textAlign: 'center', width: '100%' }} onClick={() => this.openDetailsModal(data)} type="primary"  >Query</Button> */}
            <Button onClick={() => { 
               
               this.props.history.push(`/user/${data.loginid}/${data._id}/queries`) }}
               style={{ marginBottom: '5px', textAlign: 'center', width: '100%' }} type="default">Query</Button>
            <Button style={{ marginBottom: '5px', textAlign: 'center', width: '100%' }} onClick={() => this.openDetailsModal(data)} type="primary"  >Details</Button>
            {/* <Button style={{ marginBottom: '5px', textAlign: 'center', width: '100%' }} onClick={() => this.openResponseModal(data)} type="primary">Add Response</Button> */}
           {data.status === 1 ?  <Button style={{ marginBottom: '5px', textAlign: 'center', width: '100%' }} onClick={() => this.deleteCaseLog(data)} type="danger">Close</Button>
          : ''}
         </div>
        }
      },
    ];

    return (
      <Card>
        <Row style={{ marginBottom: "0.625rem" }} className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
          <Col>
            <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={this.state.searchText} loading={this.props.submitting} />
          </Col>
        </Row>
        <Table
          columns={productsAvilabilityColumns}
          rowKey={record => record._id}
          dataSource={this.state.listAllData}
          pagination={pagination}
          loading={loading}
        />

        <Modal title='CaseLog Details' visible={this.state.isDetailsModalVisible}
          onCancel={() => this.handleDetailsModalCancel()} footer={null}>
          <Card style={{ marginTop: "0" }}>
            <Descriptions size={'middle'} column={1} bordered>
              <Descriptions.Item label="User Name">{this.state.detailsModalData.seller ? this.state.detailsModalData.seller.username : ''}</Descriptions.Item>
              <Descriptions.Item label="Email">{this.state.detailsModalData.seller ? this.state.detailsModalData.seller.email : ''}</Descriptions.Item>
              <Descriptions.Item label="Phone">{this.state.detailsModalData.seller ? this.state.detailsModalData.seller.mobile_number : ''}</Descriptions.Item>
              <Descriptions.Item label="Title">{this.state.detailsModalData.title ? this.state.detailsModalData.title : ''}</Descriptions.Item>
              {/* <Descriptions.Item label="Answer">{this.state.detailsModalData.replay ? this.state.detailsModalData.replay : ''}</Descriptions.Item> */}
            </Descriptions>
          </Card>
        </Modal>

        <Modal title='Add Response' visible={this.state.isResponseModalVisible}
          onOk={() => this.handleResponseModalOk()} onCancel={() => this.handleResponseModalCancel()}>
          <Card style={{ marginTop: "0" }}>
            <Descriptions size={'middle'} column={1} bordered>
              <Descriptions.Item label="Question">{this.state.responseModalData.message ? this.state.responseModalData.message : ''}</Descriptions.Item>
            </Descriptions>
            Write Answer: 
            <TextArea rows={4} value={this.state.responseModalData.replay ? this.state.responseModalData.replay : ''} 
              onChange={(e)=> this.updateAnswer(e) }/>
          </Card>
        </Modal>

      </Card>



    );
  }
};

export default connect(({ caseLog, loading }) => ({
  caseLog, loading
}))(ManageCaseLog);