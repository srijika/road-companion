import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from '../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {getHomePageBanner} from '../../services/api'
import jwt_decode from "jwt-decode";
import AddEdit from './actions/addEdit';
const { Search } = Input;
const { Text } = Typography;

class HomepageBanner extends React.Component {
  constructor(props) {
    super(props);
    this.update = false;
		this.state = {
			limit: 25, current: 1, sortBy: 'asc', showModal: false, detail:null,banners:[], searchText: '', listData: []
		}
		setTimeout(() => document.title = 'BannerList', 100,);
	}

    componentDidUpdate() {
      if(this.update) {
        this.getList();
      }
    }

    componentDidMount() {
      this.getList();  
    } 

    componentDidUpdate() {
      if( this.update) {
        this.getList();
        this.update = false;
      }
    }


    getList = () => {
      getHomePageBanner().then((res) => {
       this.setState({banners:res.data})
      })
      //this.props.dispatch({type: 'homepage/list',payload:{}});
    }
    

    ShowSizeChange=(current, size)  => {
      this.setState({limit:size});
      this.getList();
    }

    openBannerModel() {
      
      this.setState({
        showModal:true,
        detail: null
      });
    }

    handleModalOk(isEdit,payload) {
      if(isEdit) {
        this.props.dispatch({type: 'homepage/update', payload })
        this.setState({ showModal:false });
        setTimeout(() => {
          this.update = true;
        },5)
      } else {
        this.props.dispatch({type: 'homepage/create', payload })
        this.setState({ showModal:false });
        setTimeout(() => {
          this.update = true;
        },5)
      }
    }

    handleModalCancel() {
      this.setState({ showModal:false });
    }

    deleteBanner(id) {
      this.props.dispatch({type: 'homepage/delete', payload:{_id:id} });
      this.update = true;
    }

    searchVal = (val) => {
      this.state.searchText = val
      const resultAutos = this.state.banners.filter((auto) => auto.title.toLowerCase().includes(val.toLowerCase()) || auto.description.toLowerCase().includes(val.toLowerCase()))
      this.setState({ listData: resultAutos })
    }

    render(){
        const {limit , sortBy, searchText } = this.state;
        const { banners } = this.state;
        if(this.state.searchText == '') {
          this.state.listData = banners?banners:[];
        }
        const total = banners?banners.length:0;
        const totalActive = 0 //list ?  list.totalActive : 0;
        const columns = [
          {
            title: 'Image',
            dataIndex: 'image',
            width:100,
            render:(val,data) => {
              return <img src={process.env.REACT_APP_ApiUrl+'/'+data.thumbnailImage} style={{ display:'block', width:'80px' }}  />
            } 
          },
          {
            title: 'Title',
            dataIndex: 'title',
            width:100,
            render:(val,data) => {
              return val
            }
          },
          {
            title: 'Description',
            dataIndex: 'description',
            width:100,
            render:(val,data) => {
              return val
            }
          },
          {
            title: 'Banner Size',
            dataIndex: 'banner_size',
            width:100,
            render:(val,data) => {
              return val
            }
          },
          {
            title: 'isActive',
            dataIndex: 'isActive',
            width:100,
            render:(val,data) => {
              return  ''+val
            }
          },
          {
            title: 'Actions',
            dataIndex: 'image',
            width:100,
            render:(v,r) => {
            return (
              <div onClick={e=>e.stopPropagation()}>
                <Button type="primary" onClick={event => this.setState({showModal:true, detail:r })} ><EyeOutlined /></Button>&nbsp;
                <Popconfirm title="Are you sure delete this task?" onConfirm={e=> {this.deleteBanner(r._id); e.stopPropagation()}} okText="Yes" cancelText="No" >
                  <Button type="danger" ><DeleteOutlined /></Button>
                </Popconfirm>
            </div>
            );
            } 
          }
        ];

      return (
        <div>
            <Apploader show={this.props.loading.global}/>
            <AddEdit 
              isModalVisible={this.state.showModal} 
              modalTitle={"Add Banner"} 
              handleOk={(edit,file) => this.handleModalOk(edit,file)} 
              handleCancel={() => this.handleModalCancel()} 
              detail={this.state.detail} >

            </AddEdit>
            <Row className="TopActionBar" gutter={[16,0]} justify="space-between" align="middle">
                <Col>
                    <Search placeholder="Search..." onChange={(e) => this.searchVal(e.target.value)} value={searchText} />
                    {/* <Search placeholder="Search..." /> */}
                </Col>
                <Col>
                    <Button type="primary" onClick={() => this.openBannerModel()} >Add Banner</Button>
                </Col>
            </Row>
            
            <div className="innerContainer">
                    <Card style={{marginTop:"0"}} bodyStyle={{padding:'0 15px 15px'}}>
                      <Table columns={columns} dataSource={this.state.listData} 
                        	onRow={(record, rowIndex) => {
                            return {
                              // onClick: event => this.setState({showModal:true, detail:record })
                            };
                            }}
                            rowKey={record => record._id}
                            pagination={{position: ['bottomLeft'], 
                            defaultCurrent:1,
                            total:total, pageSize: limit,
                            showTotal:(total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger:true,
                            responsive:true,
                            onShowSizeChange:(current, size)=> this.ShowSizeChange(current, size),
                            pageSizeOptions:['25','50','100','250','500'],
                        }}
                      />
                    </Card>
                </div>                
        </div>
      );
        }
};

const mapToProps = (state) => {
return {
  banners:state.homepage.list,
  loading:state.loading
}
};
export default connect(mapToProps)(HomepageBanner);