import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from './../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { CheckOutlined, UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined , IdcardOutlined , LaptopOutlined , DatabaseOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import './advertising.css';
const { Search } = Input;
const { Text } = Typography;

class Advertising extends React.Component {
  constructor(props) {
		super(props);
		this.state = {
			limit: 25, current: 1, sortBy: 'asc', searchText: '', listData: []
		}
		setTimeout(() => document.title = 'AdvertisingList', 100,);
  }
  
    componentDidMount() {
      this.getAdvtisementPlan();  
    } 

    deleteBookPlan(id){
      this.props.dispatch({type: 'advertising/deleteBookPlan',  payload: { planId:id, role:"ADMIN" },}).then(()=>{
        this.getAdvtisementPlan(); 
      });
    }

    getAdvtisementPlan = () => {
        const roleType = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        if(roleType === "ADMIN") {
          this.props.dispatch({type: 'advertising/advPlanList',  payload: { seller_id:userId, role:"ADMIN" },});
        }else{
          this.props.dispatch({type: 'advertising/advPlanList',  payload: { seller_id:userId, role:"SELLER" },});
        }
    }

    searchVal = (val) => {
        this.state.searchText = val
        const resultAutos = this.props.advertising.filter((auto) => auto.plan[0].type.toLowerCase().includes(val.toLowerCase()) || auto.users[0].username.toLowerCase().includes(val.toLowerCase()))
        this.setState({ listData: resultAutos })
    }

    bookPlan = (planId) => {
      const roleType = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      if(roleType === "ADMIN") {
        
      }else{
        this.props.dispatch({type: 'advertising/bookPlanSeller',  payload: {
          seller_id:userId,
          planId : planId,
          role:"SELLER"
        },}).then(()=>{ this.getAdvtisementPlan(); });
      }
    }
    
    ShowSizeChange=(current, size)  => {
      this.setState({limit:size});
      this.getAdvtisementPlan();
    }

    render(){
      const roleType = localStorage.getItem('role');
      if(roleType === "ADMIN") {
        const { advertising } = this.props;
        const {limit , sortBy, searchText } = this.state;
        if(this.state.searchText == '') {
          this.state.listData = advertising.map((items, k)=> { items['key'] = (k+1).toString(); return items; });
        }
        const total = advertising.length;
        const columns = [
          {
            title: 'Sr.No',
            dataIndex: 'no',
            width:100,
            render:(val,data) => {
              return advertising.findIndex((o) => data == o)+1;
            }
          },
          {
            title: <strong className="primary-text cursor">Seller.<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'seller_id',
            render:(val,data) => {
              return data.users[0] ? data.users[0].username : '';
            }
          },
          {
            title: <strong className="primary-text cursor">Plan Type<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'advplan_id',
            render:(val,data) => {
              return data.users[0] ? data.plan[0].type : '';
            }
          },
          {
            title: <strong className="primary-text cursor">Plan Price<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'advplan_id',
            render:(val,data) => {
              return data.users[0] ? data.plan[0].price : '';
            }
          },
          {
            title: <strong className="primary-text cursor">Created Date<i className={' fal fa-sm '+(this.state.sortBy === 'asc'? "fa-long-arrow-up":"fa-long-arrow-down")} ></i></strong>,
            dataIndex: 'created_at',
            render:(val,data) => {
              return val;
            }
          },
          { 
              title:<strong>Action</strong>,
               width:310, 
               render:(val,data)=> {
                return (
                  <div>
                      <div style={{display:"flex", flexWrap:'wrap', alignItems:'center', justifyContent:'flex-start'}}>
                          <Button onClick={() => this.deleteBookPlan(data._id)} style={{ marginBottom:'5px', textAlign:'center', width:'135px' , marginRight:'5px' }} type="primary">Cancel</Button>
                    </div>
                  </div>
                );
               } 
         },
        ];

        return (
          <div>
            <Apploader show={this.props.loading.global}/>
            <Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					<Col>
						<Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText} />
					</Col>
				</Row>
            <div>
                  <h2>Advertising List</h2>
                  <Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
                    <Table columns={columns} dataSource={this.state.listData} 
                          pagination={{position: ['bottomLeft'], 
                          showTotal:(total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger:true,
                          responsive:true,
                          onShowSizeChange:(current, size)=> this.ShowSizeChange(current, size),
                          pageSizeOptions:['25','50','100','250','500'],
                      }}
                    />
                  </Card>
                  
              </div>  
            </div>
            )
      }else{
        const { advertising } = this.props;
        return (
          <div>
          <Apploader show={this.props.loading.global}/>
           <div>
                <h2>Advertising</h2>
                <p>
                  Seller better with our best plans. 
                </p>
            </div>  
            <div className="app-plans-container">
              {
                advertising.map((value, index) =>{
                    return <div key={index + 1}>
                      <div  className="app-plans-card">
                        <h3>{value.type} Plan</h3>
                        <h2 style={{margin:'0', fontSize:'60px' }}>₹{value.price}</h2>
                        <ul>
                          <li><IdcardOutlined /><br/>
                          {value.banner} Banner</li>
                          <li>
                          <LaptopOutlined /><br/>
                            {value.video} Promo video</li>
                          <li>
                          <UserOutlined /><br/>
                              Support</li>
                          <li>
                          <DatabaseOutlined /><br/>
                          {value.product} Products</li>
                        </ul>
                        <div className="app-plans-card-actions"> 
                          <Button type="primary" block onClick={() => this.bookPlan(value._id)} disabled = {value.activated}>Choose plan</Button>
                        </div>
                    </div>
                  </div>
                })
              }  
              </div>
          </div>
        );
      }
 
    }
};

const mapToProps = (state) => {
    return {
      advertising:state.advertising.list,
      loading:state.loading
    }
  };
export default connect(mapToProps)(Advertising);