import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Collapse, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined,EyeOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
const { Panel } = Collapse;
const { Search } = Input;
const { Text } = Typography;
const { confirm } = Modal;

class FAQs extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			limit: 100, current: 1, sortBy: 'asc', addModel: false, inactive: false, searchText: '', listData: []
		}
		setTimeout(() => document.title = 'FAQList', 100);
	}

    componentDidMount() {
        this.getList();  
    } 

    getList = () => {
        this.props.dispatch({type: 'FAQ/listFAQ',  payload: {}});
    }

    deleteFAQ = (data) => {
      let that = this;
      confirm({
        title: 'Do you Want to delete these faq`s?',
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        cancelText: 'No',
        onOk() { return that.deleteItemFun(data) },
        onCancel() { console.log('Cancel'); },
      });
    }
    deleteItemFun = (data) => {
      this.props.dispatch({type: 'FAQ/deleteFAQ',  payload: {id: data}});
    }

    editFAQ = (faq) =>{
      localStorage.setItem('faqedit', JSON.stringify(faq));
      this.props.history.push('/FAQ/edit/'+faq._id);
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
      if (this.props.FAQ.delete) {
          this.props.dispatch({ type: 'FAQ/clear' });
          this.getList();
          return true;
      }
      return null;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
      if (snapshot) {}
    }

    ShowSizeChange=(current, size)  => {
      this.setState({limit:size});
      this.getList();
    }

    searchVal = (val) => {
        this.state.searchText = val
        const resultAutos = this.props.FAQ.list.filter((auto) => auto.questions.toLowerCase().includes(val.toLowerCase()) || auto.answers.toLowerCase().includes(val.toLowerCase()))
        this.setState({ listData: resultAutos })
    }

   
    render(){
        const { searchText } = this.state;
        const { FAQ } = this.props;
        if(this.state.searchText == ''){
            this.state.listData = FAQ.list || [];
        }
        let roleType = localStorage.getItem('role');

        const columns = [
          {
            title: 'Sr.No',
            dataIndex: 'no',
            width:100,
            render:(val,data) => {
              return this.state.listData.findIndex((o) => data == o)+1;
            }
          },
          {
            title: <strong className="primary-text cursor">Question</strong>,
            dataIndex: 'questions'
          },
          {
            title: <strong className="primary-text cursor">Answers</strong>,
            dataIndex: 'answers'
          },
          { title: <strong>Action</strong>, width: 140, render: (val, data) => 
            roleType == 'ADMIN' ? 
            <div>
              <Button className="ant-btn-sm" type="primary" onClick={e => { this.editFAQ(data); e.stopPropagation() }}><EyeOutlined /></Button>
              <Button className="ant-btn-sm" type="danger" onClick={e => { this.deleteFAQ(data._id); e.stopPropagation() }}><DeleteOutlined /></Button> 
            </div>
            : ''
          }
        ];
        
      return (
        
        <div>
            {/* <Apploader show={this.props.loading.global}/> */}
            <Row className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
                <Col>
                    <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText}/>
                </Col>
                <Col>
                    { 
                      roleType == 'ADMIN' ? 
                      <Button type="primary" onClick={()=> this.props.history.push('/FAQ/add')}>Add</Button> : ""
                    } 
                </Col>
            </Row>
            { roleType == 'ADMIN' ?
                <div className="innerContainer">
                    <Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
                      <Table columns={columns} dataSource={this.state.listData} 
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
                :
                <div>
                  <br/>
                  { 
                    this.state.listData.length > 0 ?
                      <Collapse>
                          {
                            this.state.listData.map((item, index) => {
                                return ( <Panel header={item.questions} key={index}>
                                   {
                                   item.answers ?
                                      <p > {item.answers}</p>
                                      : <p style={{color:"red"}}>No Answer yet</p>
                                   } 
                              </Panel> );
                            }) 
                          } 
                      </Collapse>
                    :
                    <Card style={{marginTop:"0"}} bodyStyle={{padding:'15px'}}>
                       <p style={{padding:"10px", textAlign:"center", fontSize:"16px"}}>No FAQ's Found!</p>
                    </Card>
                      
                    }
                </div>
            }              
        </div>
      );
        }
};

const mapToProps = ({FAQ,loading}) => {
return {FAQ,loading}
};
export default connect(mapToProps)(FAQs);