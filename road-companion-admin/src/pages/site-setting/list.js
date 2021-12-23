import React from 'react';
import { connect } from 'dva';
import { Card, Typography, Input, Button, Table, Row, Col, Tabs, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode"
import Moment from 'react-moment';
import AddEdit from './action/addEdit';
import axios from 'axios';


const { Search } = Input;
const { Text } = Typography;
const baseUrl = process.env.REACT_APP_ApiUrl

class SiteSetting extends React.Component {
  constructor(props) { 
    super(props);
    this.state = { count: 0, Addcount: 0, limit: 25, current: 1, searchText: '', loader: false, detail: '', addModel: false, listData: [], data: [], pagination: { current: 1, pageSize: 10 }, loading: false, sortBy: 'asc', inactive: false }
    setTimeout(() => document.title = 'Setting List', 100);
  }
  componentDidMount() {
    this.ListFun();
  }

  ListFun = async () => {
    const user = jwt_decode(localStorage.getItem('token'));

    const res = await axios.post(`${baseUrl}/api/list/setting`);

    this.setState({ listData: res.data.settings  })

  }

ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

  searchVal = (val) => {
    this.state.searchText = val
    const resultAutos = this.props.blogsCategory.list.result.filter((auto) => auto.category_name.toLowerCase().includes(val.toLowerCase()))

    this.setState({ listData: resultAutos })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {
			this.ListFun()
		}
  }
  
  createCat = (val) => {
    this.ListFun();
    this.setState({addModel: false})
  }
  
  deleteCat = id => {
		this.props.dispatch({ type: 'blogsCategory/deleteblogsCategory', payload: { id: id }, });
  }
  

  render() {

    const {loading, addModel, detail, searchText} = this.state;
    const total = 0; 
    const totalActive = 0;


    const columns = [
      {
        title: <strong>Option</strong>,
        dataIndex: 'option',
      },
      {
        title: <strong>Value</strong>,
        dataIndex: 'value',  
      },
      {
        title: <strong>Action</strong>, width: 100, align: 'center',
        render: (val, data) => <div onClick={e => e.stopPropagation()}>
           {console.log("val" , val)} <Button type="primary" onClick={() => this.setState({ addModel: true, detail: val }) }  > Edit </Button>
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
          columns={columns}
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


export default connect(({ loading }) => ({
  loading
}))(SiteSetting);
