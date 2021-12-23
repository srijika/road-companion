import React from 'react';
import { Link } from 'react-router-dom';
import { Router } from 'react-router';
import Apploader from '../../components/loader/loader'
import Moment from 'react-moment';
import { connect } from 'dva';
import { Empty, Card, message, Typography, Alert, Form, Descriptions, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode";
const { Search } = Input;
const { Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

class Contact extends React.Component {
   
  state = {
    answer:'',
    listData: {},
    isModalVisible: false,
    modalType: '',
    sortBy: 'asc',
    limit: 25,
    searchText: '',
    listAllData:[]
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const roleType = localStorage.getItem('role')
    if (roleType === "ADMIN") {
      this.props.dispatch({
        type: 'ticket/contactList', payload: {
          page: 0,
          limit: this.state.limit,
          role: roleType
        },
      });
    } else {
      this.props.dispatch({
        type: 'ticket/contactList', payload: {
          seller_id: localStorage.getItem('userId'),
          page: 0,
          limit: this.state.limit,
          role: roleType
        },
      });
    }
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.tickets.update) {
      this.setState({isModalVisible: false });
			this.props.dispatch({ type: 'ticket/clear' });
      this.getList();  
			return true
		}
    if (this.props.tickets.close) {
			this.props.dispatch({ type: 'ticket/clear' });
      this.getList();  
			return true
		}
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {}
	}

  ShowSizeChange = (current, size) => {
    this.setState({ limit: size });
    this.getList();
  }

  openModal = (type, listData) => {
    this.setState({answer:'', listData: listData, modalType: type, isModalVisible: true });
  }

  closeTicket = (listData) =>{
    let that = this;
		confirm({
			title: 'Do you Want to close these Ticket?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Yes',
			cancelText: 'No',
			onOk() { return that.closeTicketOK(listData) },
			onCancel() { console.log('Cancel'); },
		});
  }    

  closeTicketOK = (listData) =>{
      let rData = {
          ticket_id: listData._id,
          status : 0
      } 
      this.props.dispatch({ type: 'ticket/closeTicket', payload: rData });
  }
  

  handleModalCancel = () => {
    this.setState({ isModalVisible: false });
  }

  updateAnswer = (event) =>{
    this.setState({ answer: event.target.value });
  }

  handleModalOk = () => {
      if(this.state.answer.length > 0){
         let rData = {
          ticket_id: this.state.listData._id,
           answer : this.state.answer
         } 
        this.props.dispatch({ type: 'ticket/updateTicket', payload: rData });
      }else{
        message.error("You need to write answer!",5)
      }
  }

  searchVal = (val) => {
		this.state.searchText = val
		const resultAutos = this.props.tickets.contactlist.filter((auto) => auto._id.toLowerCase().includes(val.toLowerCase()) || 
                                                                 auto.title.toLowerCase().includes(val.toLowerCase()) || 
                                                                 auto.priority.toLowerCase().includes(val.toLowerCase()) || 
                                                                 auto.email.toLowerCase().includes(val.toLowerCase())
                                                      )
		this.setState({ listAllData: resultAutos })
	}

  render() {
    const roleType = localStorage.getItem('role');
    console.log(this.props)
    let tickets = this.props.tickets.contactlist;
    if (this.state.searchText == '') {
			this.state.listAllData = tickets;
		}

    const columns = [
      // {
      //   title: 'Sr.No',
      //   dataIndex: 'no',
      //   width: 100,
      //   render: (val, data) => {
      //     return this.state.listAllData.findIndex((o) => data == o) + 1;
      //   }
      // },
      // {
      //   title: 'Name',
      //   render: (val, data) => {
      //     return data.name
      //   }
      // },
      {
        title: <strong className="primary-text cursor">Email<i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
        dataIndex: 'email',
        render: (val, data) => {
          return <span style={{ color : "#17a2b8" }}>{data.email}</span>
        }
      },
      {
        title: <strong className="primary-text cursor">Subject<i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
        dataIndex: 'subject',
        
        render: (val, data) => {
          return data.subject
        }
      },
      {
        title: <strong className="primary-text cursor">Message<i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
        dataIndex: 'message',
        render: (val, data) => {
          return <span style={{ fontSize : "12px" }}>{data.message}</span>
        }
      },
      {
        title: <strong className="primary-text cursor">Date<i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
        dataIndex: 'created_at',
        render: (val, data) => {
          return (data.created_at? <Moment format="MM- DD-YYYY" >{data.created_at}</Moment>:'-')
        }
      },
      // {
      //   title: <strong>Action</strong>,
      //   width: 310,
      //   render: (val, data) => {
      //     return (
      //       <div>
      //         <div style={{ display: "flex", flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>
      //           <Button onClick={() => { this.props.history.push('/help/detail/' + data._id) }}
      //             style={{ marginBottom: '5px', textAlign: 'center', width: '135px', marginRight: '5px' }} type="primary">Details</Button>
      //           {
      //             roleType == 'ADMIN' ?
      //               <div>
      //                   <Button style={{ marginBottom: '5px', textAlign: 'center', width: '135px', marginRight: '0px' }} onClick={() => this.openModal('add_response', data)} type="primary">Add Response</Button><br/>
      //                   <Button style={{ marginBottom: '5px', textAlign: 'center', width: '135px', marginRight: '0px' }} onClick={() => this.closeTicket(data)} type="danger">Close</Button>
      //               </div>    
      //               :
      //               <Button style={{ marginBottom: '5px', textAlign: 'center', width: '135px', marginRight: '0px' }} onClick={() => this.openModal('view_response', data)} type="primary">View Response</Button>
      //           }
      //         </div>
      //       </div>
      //     );
      //   }
      // },
    ];
    return (
      <div>
        <Apploader show={this.props.loading.global} />
        <Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
          {/* <Col>
            <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={this.state.searchText}
							loading={this.props.submitting}/>
          </Col> */}
          <Col>
          {
            roleType != 'ADMIN' ?
              <Button type="primary" onClick={() => { this.props.history.push('/help/add') }} >Create Ticket</Button>
            :''
          }
          </Col>
        </Row>

        <div className="innerContainer">
          <Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
            <Table columns={columns} dataSource={this.state.listAllData}
              rowKey={record => record._id}
              pagination={{
                position: ['bottomLeft'],
                showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
                responsive: true,
                onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
                pageSizeOptions: ['25', '50', '100', '250', '500']
              }}
            />
          </Card>
        </div>
        {
            roleType == 'ADMIN' ?
            <Modal title={this.state.modalType == 'add_response' ? 'Add Response' : 'View Response'} visible={this.state.isModalVisible}
              onOk={() => this.handleModalOk()} onCancel={() => this.handleModalCancel()}>

              <Card style={{ marginTop: "0" }}>
                  Write Answer: 
                  <TextArea rows={4} value={this.state.answer} onChange={(e)=> this.updateAnswer(e) }/>
              </Card>
            </Modal>
            :
            <Modal title={this.state.modalType == 'add_response' ? 'Add Response' : 'View Response'} visible={this.state.isModalVisible} 
            onCancel={() => this.handleModalCancel()} footer={null}>
              <Card style={{ marginTop: "0" }}>
                   <p><strong> Question: </strong>{ this.state.listData.title } </p>
                   <p><strong> Answer: </strong>{ this.state.listData.answer } </p> 
              </Card>
            </Modal>
        }
        

      </div>
    );
  }
};

const mapToProps = (state) => {
  return {
    tickets: state.ticket,
    loading: state.loading
  }
};

export default connect(mapToProps)(Contact);