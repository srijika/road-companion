import React from 'react';
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import fetch from 'dva/fetch';
import Moment from 'react-moment';
import AddEdit from './action/addEdit';

const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;
const baseUrl = process.env.REACT_APP_ApiUrl

class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, Addcount: 0, limit: 25, current: 1, searchText: '', loader: false, detail: '', addModel: false, listData: [], data: [], pagination: { current: 1, pageSize: 10 }, loading: false, sortBy: 'asc', inactive: false }
    setTimeout(() => document.title = 'Tag List', 100);
  }
  componentDidMount() {
    this.ListFun();
    this.props.dispatch({ type: 'tag/clearAction' });
  }

  ListFun = () => {
    const user = jwt_decode(localStorage.getItem('token'));
if (user.role === "ADMIN") {
  let search = 'page=' + (this.state.current - 1) + "&limit=" + this.state.limit + "&inactive=" + this.state.inactive + "&searchText=" + this.state.searchText + "&sortBy=" + this.state.sortBy;
  localStorage.setItem('newsSearch', JSON.stringify(this.state));
  let searchval = { page: this.state.current - 1, limit: this.state.limit, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy }
  this.props.dispatch({ type: 'tag/tagList', payload: searchval, });
} else {
  let search = 'page=' + (this.state.current - 1) + "&limit=" + this.state.limit + "&inactive=" + this.state.inactive + "&searchText=" + this.state.searchText + "&sortBy=" + this.state.sortBy;
  localStorage.setItem('newsSearch', JSON.stringify(this.state))

  let searchval = { page: this.state.current - 1, limit: this.state.limit, inactive: this.state.inactive, searchText: this.state.searchText, sortBy: this.state.sortBy, _id: user._id }
  this.props.dispatch({ type: 'tag/tagList', payload: searchval, });
}

}
ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

  searchVal = (val) => {
    this.state.searchText = val
    const resultAutos = this.props.tag.list.data.filter((auto) => auto.tag_name.toLowerCase().includes(val.toLowerCase()))

    this.setState({ listData: resultAutos })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {
			this.ListFun()
		}
  }
  
  createCat = (val) => {
		console.log(val)
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
  }
  
  deleteCat = id => {
		this.props.dispatch({ type: 'tag/tagDelete', payload: { _id: id }});
  }
  
  getSnapshotBeforeUpdate(prevProps, prevState) {

		if (this.props.tag.del && this.props.tag.del.count > this.state.count && this.props.tag.del.status) {
			this.setState({ count: this.props.tag.del.count })
			return true
		}
		if (this.props.tag.add && this.props.tag.add.count > this.state.Addcount && this.props.tag.add.status) {
			this.setState({ Addcount: this.props.tag.add.count, addModel: false })
			return true
		}
		return null;
	}
 
  render() {
    const {loading, addModel, detail, searchText} = this.state;
    const { tag } = this.props;
    const total = 0; 
    const totalActive = 0;
    if (this.state.searchText == '') {
      this.state.listData = tag.list ? tag.list.data : [];
    }



    const productsAvilabilityColumns = [
      {
        title: <strong>Service Name</strong>,
        dataIndex: 'tag_name',
        render:(val,data) => {
          return (data.tag_name? <span className="text-info" >{data.tag_name}</span>:'-')
        }
      },
      {
        title: <strong>Created Date</strong>,
        dataIndex: 'created_at',  
        render:(val,data) => {
          return (data.created_at? <Moment format="MM- DD-YYYY" >{data.created_at}</Moment>:'-')
        }
      },
      {
        title: <strong>Action</strong>, width: 100, align: 'center',
        render: (val, data) => <div onClick={e => e.stopPropagation()}>
          <Popconfirm title="Are you sure delete Tag?" onConfirm={e => { this.deleteCat(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
            <Button type="danger" ><DeleteOutlined /></Button>
          </Popconfirm>
        </div>
      },
    ];

    return (
      <>
      <Card>
        <Row style={{ marginBottom: "0.625rem" }} className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
          <Col>
            <Search placeholder="Search..." loading={this.props.submitting} onChange={(e) => this.searchVal(e.target.value)} value={searchText} />
          </Col>
          <Col>
            <Button type="primary" onClick={() => this.setState({ addModel: true })}>Add</Button>
          </Col>
        </Row>
        <Table
          columns={productsAvilabilityColumns}
          rowKey={record => record._id}
          dataSource={this.state.listData}
          onChange={this.paginationFun}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => this.setState({ addModel: true, detail: record })
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
      <AddEdit visible={addModel} returnData={this.createCat} closeModel={() => this.setState({ addModel: false, detail: '' })} detail={detail} />
      </>

    );
  }
};


export default connect(({ tag, loading }) => ({
  tag, 
  loading
}))(Tags);
