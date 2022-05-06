import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "dva";
import { Row, Col, Menu, Avatar, Dropdown, Modal } from "antd";
import Logo from '../../public/static/images/logo.png';
import {
  LogoutOutlined,
  SettingOutlined,
  MenuOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./AppHeader.less";
import { Link ,withRouter } from "react-router-dom";
import axios from 'axios'
import logo from '../../images/logo.png'
// import VerifiedImg from '../../images/ver.png'



const baseUrl = process.env.REACT_APP_ApiUrl;

let user_data = JSON.parse(localStorage.getItem('user'));
let user_id;
if(user_data != undefined && user_data != "" && user_data != null) {
  user_id = user_data._id;
}



class AppHeader extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    }

   
  }





  onMenuClick = (val) => {
    if (val.key === "logout") {
      this.props.dispatch({ type: "auth/logoutApp" });
      //localStorage.removeItem('token');
      localStorage.clear();
      return <Redirect exact to="/login" />;
    }
  };
  toggle = () => this.props.dispatch({ type: "global/toggle" });

  



  async componentDidMount() {

    

    // if(user_data != undefined && user_data != null && user_data != "") {
    //   const res = await axios.post(`${baseUrl}/seller-notifications`, { seller_id: user_id, role: user_data.role });
    //   let notifications =  res.data.notifications;
    //   this.setState({
    //     notifications: notifications
    //   });

    // }
  }


 




    clearAllNotifications = async () =>  {
      this.setState({
        notifications: ""
      });
      alert('Notification cleared successfully');

      const res = await axios.post(`${baseUrl}/all/messages/mark-as-read`, { user_id: user_id, role: user_data.role });
     
    }

    handleNotificationRedirect = (val) => {
     
      switch(val) {
        case 'approve_business_verify':
          this.props.history.push('business-verification');
          break;
        case 'order':
          this.props.history.push('orders');
          break;
        case 'business_verify':
          this.props.history.push('notification');
          break;

        default:
          // code block
      }






    }


  render() {
    const { global } = this.props;
    const role = localStorage.getItem("role");
    const userData = localStorage.getItem("user");
    let user = JSON.parse(userData);
   
    const toggle = global.toggleval;
    const menu = (
      <Menu onClick={this.onMenuClick}>
        <Menu.Item key="setting">
          <center>
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              
              {/* {user.isBussinessVerified ? <img src={VerifiedImg} style={{ height: "14px", width: "14px", marginTop: "-4px", marginRight: "5px" }} />  : ""} */}
              {user.username} 
            </span>
          </center>
        </Menu.Item>
        {/* {role === "ADMIN" && ( */} 
          <Menu.Item key="account">
            <Link to="/account">
              <UserOutlined /> Account 
            </Link>
          </Menu.Item>
        {/* )} */}
        <Menu.Item key="setting">
          <Link to="/setting">
            <SettingOutlined /> Setting
          </Link>
        </Menu.Item>
        <Menu.Item key="logout">
          <Link to="/">
            <LogoutOutlined /> Logout
          </Link>
        </Menu.Item>
      </Menu>
    );

    let notificationDropdown = (

      this.state.notifications.length > 0 
      ?
      <Menu onClick={this.onMenuClick} >
          {this.state.notifications.map((item, key) => {
            return (
              <Menu.Item key="setting" key={key} style={{ width: '400px' }} onClick={()=>this.handleNotificationRedirect(item.notification_type)}>
                  {item.message}
              </Menu.Item>  
            )  
          })}

          <a href="javascript:void(0)" style={{ marginLeft: '10px' }} onClick={ this.clearAllNotifications } > Clear Notifications </a>
        </Menu>

        : ""
      );

    return (
      <Row
        style={{ color: "#fff", height: 61 }}
        type="flex"
        justify="space-between"
      >
        <Col span={16} className="logoDiv">
          {/*<Icon className="togglemenu" onClick={this.toggle} type={toggle?"menu-unfold":"menu-fold"} theme="outlined" />*/}
          <MenuOutlined className="togglemenu" onClick={this.toggle} />
          <div className="innerlogo">
            <h3 style={{ fontSize: 32, margin: 0 }}>
            <Link to="/">
              <img src={Logo} style={{ height: "50px", marginTop: '5px',  width: "60px" }} />
              <span className="mobile_invisiable " > Road Companion </span>
             </Link>
              
            </h3>
          </div> 
        </Col>
        <Col span={7} className="topmenu">
          <Menu className="headtoplink" mode="horizontal">
            <Menu.Item>
                <Dropdown overlay={notificationDropdown}>
                  <a className="ant-dropdown-link" >
                    <div class="notification-icon right" style={{ marginTop: 3 }}>
                      <BellOutlined style={{ fontSize: 16, marginRight: "-10px", color: 'black' }} />
                      <span style={{ fontSize: '12px', position: 'relative', color: "black", top: "-10px", left: "-2px", fontWeight: "bold" }}>{ this.state.notifications.length ? this.state.notifications.length : "0"  }</span>
                    </div>
                  </a>
                  {/* <a href="#">
                    Clear Notifications
                  </a> */}
                </Dropdown>

            </Menu.Item>

            <Menu.Item>
              <Dropdown overlay={menu}>
                <a className="ant-dropdown-link">
                  <Avatar
                    style={{ color: "#bf3427", backgroundColor: "#fff" }}
                    icon={<UserOutlined />}
                  />
                </a>
              </Dropdown>
            </Menu.Item>
          </Menu>
        </Col>



      </Row>
    );
  }
}
export default withRouter(connect(({ auth, global, loading }) => ({
  auth,
  global,
  loading,
}))(AppHeader));
