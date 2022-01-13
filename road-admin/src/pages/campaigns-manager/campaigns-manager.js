import React from 'react';
import { Link } from 'react-router-dom';
import { Router } from 'react-router';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import fetch from 'dva/fetch';

const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;
const baseUrl = process.env.REACT_APP_ApiUrl

class CampaignsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, Addcount: 0, limit: 25, current: 1, searchText: '', loader: false, detail: '', fileModel: false, listData: [], data: [], pagination: { current: 1, pageSize: 10 }, loading: false, roleType: '' }
    setTimeout(() => document.title = 'Campaign List', 100);
  }
  componentDidMount() {
    this.state.roleType = localStorage.getItem('role');
    this.ListFun();
    //this.props.dispatch({ type: 'campaign/clearAction' });
  }

  ListFun = () => {
    const roleType = localStorage.getItem('role');
    if (roleType === "ADMIN") {
      localStorage.setItem('campaignSearch', JSON.stringify(this.state));
      let searchval = { page: this.state.current - 1, limit: this.state.limit }
      this.props.dispatch({ type: 'campaign/campaignList', payload: searchval, });
    } else {
      localStorage.setItem('campaignSearch', JSON.stringify(this.state))

      let searchval = { page: this.state.current - 1, limit: this.state.limit }
      this.props.dispatch({ type: 'campaign/sellerCampaignList', payload: searchval, });
    }
  }

  ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
  switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
  ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
  paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

  searchVal = (val) => {
    this.setState({ searchText: val })
    const resultAutos = this.props.campaign.list.result.filter((auto) => auto.name.toLowerCase().includes(val.toLowerCase()) ||
      auto.name_of_group.toLowerCase().includes(val.toLowerCase()) ||
      auto.start_date.toLowerCase().includes(val.toLowerCase()) ||
      auto.end_date.toLowerCase().includes(val.toLowerCase()) ||
      auto.budget.toLowerCase().includes(val.toLowerCase()))
    this.setState({ listData: resultAutos })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.ListFun()
    }

    if (this.props.campaign.edit.count && this.props.campaign.edit.count > 0 && this.props.campaign.edit.status) {
      this.props.dispatch({ type: 'campaign/clearAction' });
      this.ListFun();
    }

    if (this.props.campaign.del.count && this.props.campaign.del.count > 0 && this.props.campaign.del.status) {
      this.props.dispatch({ type: 'campaign/clearAction' });
      this.ListFun();
    }

  }

  updateStatus = (id, flag) => {
    if (flag == 1) {
      this.props.dispatch({ type: 'campaign/campaignEdit', payload: { campaign_id: id, status: true } });
    } else {
      this.props.dispatch({ type: 'campaign/campaignEdit', payload: { campaign_id: id, status: false } });
    }
  }

  deleteCampaign = (id) => {
    this.props.dispatch({ type: 'campaign/campaignDelete', payload: { campaign_id: id } });
  }

  render() {
    const { pagination, loading } = this.state;
    const { campaign } = this.props;
    if (this.state.searchText == '') {
      this.state.listData = campaign.list ? campaign.list.result : [];
    }
    const productsAvilabilityColumns = [
      {
        title: <strong>Name</strong>,
        dataIndex: 'name',
      },
      {
        title: <strong>Group name</strong>,
        dataIndex: 'name_of_group',
      },
      {
        title: <strong>StartDate</strong>,
        dataIndex: 'start_date',
      },
      {
        title: <strong>EndDate</strong>,
        dataIndex: 'end_date',
      },
      {
        title: <strong>Budget</strong>,
        dataIndex: 'budget',
      },
      {
        title: <strong>Daily Budget</strong>,
        dataIndex: 'daily_budget',
      },
      {
        title: <strong>Default Bid</strong>,
        dataIndex: 'default_bid',
      },
      {
        title: <strong>Status</strong>,
        render: (val, data) => {
          if (this.state.roleType == 'ADMIN') {
            if (data.status == 1) {
              return <div>
                  <Button type="primary" className="btn-w25" onClick={() => this.props.history.push('/campaigns-manager/edit/'+ data._id)} >Edit</Button>&nbsp;&nbsp;
                  <Button type="danger" className="btn-w25" onClick={() => this.updateStatus(data._id, 0)}>DeActive</Button>&nbsp;&nbsp;
                  <Button type="danger" className="btn-w25" onClick={() => this.deleteCampaign(data._id)}>DELETE</Button>
              </div>
            } else {
              return <div>
                    <Button type="primary" className="btn-w25" onClick={() => this.props.history.push('/campaigns-manager/edit/'+ data._id)} >Edit</Button>&nbsp;&nbsp;
                    <Button type="primary" className="btn-w25" onClick={() => this.updateStatus(data._id, 1)}>Active</Button>&nbsp;&nbsp;
                    <Button type="danger" className="btn-w25" onClick={() => this.deleteCampaign(data._id)}>DELETE</Button>
              </div>

            }
          } else {
            return <div>
                {data.status == 1 ? 
                  <span style={{ color: "green" }}>Active</span> : 
                  <span style={{ color: "red" }}>DeActive</span> } &nbsp;&nbsp;
                <Button type="primary" className="btn-w25" onClick={() => this.props.history.push('/campaigns-manager/edit/'+ data._id)} >Edit</Button>&nbsp;&nbsp;
                <Button type="danger" className="btn-w25" onClick={() => this.deleteCampaign(data._id)}>DELETE</Button>
            </div>
          }
        }
      }
    ];

    return (
      <Card>
        <Row style={{ marginBottom: "0.625rem" }} className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
          <Col>
            <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={this.state.searchText} loading={this.props.submitting} />
          </Col>
          <Col>
            <Button type="primary" onClick={() => this.props.history.push('/campaigns-manager/add')}>Add Campaign</Button>&nbsp;
                        {/* <Button type="primary">Download Excel</Button>&nbsp; */}
          </Col>
        </Row>
        <Table
          columns={productsAvilabilityColumns}
          rowKey={record => record._id}
          dataSource={this.state.listData}
          onChange={this.paginationFun}
          pagination={{
            position: ['bottomLeft'],
            showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
            responsive: true,
            onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
            pageSizeOptions: ['25', '50', '100', '250', '500'],
          }}
          loading={loading}
        />
      </Card>


    );
  }
};


export default connect(({ campaign, loading }) => ({
  campaign, loading
}))(CampaignsManager);
