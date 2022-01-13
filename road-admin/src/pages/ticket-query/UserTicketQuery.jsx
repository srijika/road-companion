import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {  Link } from "react-router-dom";
import { useParams } from "react-router";
import { RetweetOutlined} from '@ant-design/icons';
import {Col, Modal, Card, Typography, Alert,Form,Input, Checkbox,Button,Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';

import { css } from "@emotion/css";
import { Scrollbars } from "react-custom-scrollbars-2";
import ScrollToBottom from "react-scroll-to-bottom";
import Swal from "sweetalert2";
const baseUrl = process.env.REACT_APP_ApiUrl;
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };
const { TextArea } = Input;
const ROOT_CSS = css({
  height: 200,
  width: "100%",
});


export default function UserMultiSupport(props) {
  let { id, ticket_id } = props.match.params;
  const [form] = Form.useForm();
  const [notification, setNotification] = useState("");
  const [reload, setReload] = useState(false);
  const [btnDis, setBtnDis] = useState(false)
  const [status, setStatus] = useState(0);
  let role = localStorage.getItem('role')
   const [user, setUser] = useState({});
  const [tickets, setTickets] = useState([]);
  const [ticketMessageQueries, setTicketMessageQueries] = useState([]);
  const [unreadsMesssages, setUnread] = useState([]);
  const [visiable, setVisiable] = useState(false);


  let email;
  let check;
  if (user.email === undefined) {
    check = "true";
  
  } else {
    email = user.email;
    check = "false";
  }

  useEffect(() => {
    getTicketQueries();
    getTickets();
    // getTicketNotification();
    // getUnreadQuery();
    // getTicketNotificationReadUrl()
  }, [ticket_id]);

  useEffect(() => {
    // getTicketNotificationReadUrl()
  }, [ticket_id , reload]);

 

  const onFinish = async val => {
    setBtnDis(true);
    let data;

  let { id, ticket_id } = props.match.params;
if(role === "ADMIN"){
  data = {
    from: "ADMIN",
    to: id,
    message: val.message,
    ticket_id: ticket_id,
    email: user.email,
  };

}else{
  data = {
    from: id,
    to: "ADMIN",
    message: val.message,
    ticket_id: ticket_id,
    email: user.email,
  };
}
  
    const res = await axios.post(`${baseUrl}/user/send/message-query`, data);

    setTicketMessageQueries((oldArr) => [...oldArr, data]);
    getTicketQueries();
    setBtnDis(false);
    form.resetFields();
	}



  const handleDelete = async (path , ticket_id , user_id ) => {
    let res ;
    const { value: isConfirmedQuery } = await Swal.fire({
        title: "Are you sure!",
        input: 'textarea',
        inputPlaceholder : 'Enter your reason' ,
        text: "Please tell us about your reason :",
        showCloseButton: true,
        confirmButtonColor: '#d33',

        confirmButtonText: 'Close Ticket',
        
      });

if(isConfirmedQuery === undefined){
return false;
}
      if (isConfirmedQuery !== "" && isConfirmedQuery !== undefined) {

      const  data = {
            from: "ADMIN",
            to: id,
            message: isConfirmedQuery,
            ticket_id: ticket_id,
          };
          const response = await axios.post(`${baseUrl}/user/send/message-query`, data);

         
       }

       if (isConfirmedQuery === ""  ) {
let query = "This Ticket has been closed by Admin"
        const  data = {
              from: "ADMIN",
              to: id,
              message: query,
              ticket_id: ticket_id,
            };
            const response = await axios.post(`${baseUrl}/user/send/message-query`, data);

         }



      if (isConfirmedQuery === ""  || isConfirmedQuery !== "") {

        console.log(isConfirmedQuery === "")


         res = await axios.post(`${path}`);
         console.log(res)

        if (res.data.status === 200) {
          Swal.fire({
            title: "Success",
            text: res.data.message,
          });
          getTickets();
    getTicketQueries();

          return true;
        }
      }
  }

  


const reloadQuery = () => {
setReload(true);

setTimeout(() => {
  setReload(false);
}, 500);

    getTicketQueries();
    getTickets();
    // getTicketNotification();
    // getUnreadQuery();
}


  const getTickets = async () => {
    const res = await axios.post(`${baseUrl}/user/get/tickets/index`, { user_id: id });
    setTickets(res.data.tickets);
    
  };

  const getTicketQueries = async () => {
    let data = {
      user_id: id,
      ticket_id: ticket_id,
    };

 
    console.log("res" , baseUrl)

    const res = await axios.post(`${baseUrl}/user/ticket-queries/index`, data);
    setTicketMessageQueries(res.data.tickets_messages);
    setUser(res.data.user);
    setStatus(res.data.status)
 

  };


  const getDateCheck = (item) => {
    console.log("item" , item)
    var created_date = new Date(item.create);

    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = created_date.getFullYear();
    var month = months[created_date.getMonth()];
    var date = created_date.getDate();

    let d = formatAMPM(created_date) + "  " + date + " " + month + " " + year;
    return d;
  };

  const getDateChecks = (item) => {
    var created_date = new Date(item.created_at);
    console.log(item)

    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    var year = created_date.getFullYear();
    var month = months[created_date.getMonth()];
    var date = created_date.getDate();
    var day = days[created_date.getDay()];

    let d = formatAMPM(created_date) + "  " + date + " " + month + " " + year;
    let time = d.slice(0, -12);
    let dd = `${day} , ${date} ${month} ${year} at ${time}`;


    return dd;
  };

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }


 // const getTicketNotificationReadUrl = async (_id) => {
  //   let data = {
  //     user_id: id,
  //     ticket_id: ticket_id,
  //   };
  
  //   const res = await axios.post(" http://localhost:5000/api/admin/ticket-queries-notification/read", data);
  //   getUnreadQuery();
  // };
  //   const getTicketNotificationRead = async (_id) => {
  //   let data = {
  //     user_id: id,
  //     ticket_id: _id,
  //   };
   

  //   const res = await axios.post("http://localhost:5000/api/admin/ticket-queries-notification/read", data);

  //   getUnreadQuery();
  // };


  // const getTicketNotification = async () => {
  //   let data = {
  //     user_id: id,
  //     ticket_id: ticket_id,
  //   };

  //   const res = await axios.post("http://localhost:5000/api/admin/ticket-queries-notification", data);

  //   setNotification(res.data.tickets_notification);
  // };

  // const getUnreadQuery = async () => {
  //   let data = {
  //     user_id: id,
  //   };

  //   const res = await axios.post("http://localhost:5000/api/admin/ticket-queries/notification", data);

  //   setUnread(res.data.unread_ticket_queries);
   
  // };

  const onFinishForm= async val=>{

    setBtnDis(true);
    let data = {
      title : val.title ,
      message : val.message,
      loginid : id
    }

    const res = await axios.post(`${baseUrl}/admin/create-manage-caselog`, data);

    getTicketQueries();
    getTickets();
    setBtnDis(false);
    form.resetFields();
    setVisiable(false)
    props.history.push(`/user/${id}/${res.data.result._id}/queries`);


  }

  const cancelFun = ()=>{
    setVisiable(false)
			form.resetFields();

	}



  return (
    <>
      <section className="content">
       <span className=" float-top float-right  mr-3">
       {role === "ADMIN" ?     <li className=" btn btn-warning btn-sm mr-2" onClick={() => setVisiable(true)}>Create Ticket</li>: ''}

       <Link to={`/`}>
        <li className=" btn btn-primary btn-sm">Back</li>
        </Link>

       </span> 

    <div>
        <h4 className="mb-3 ">Inbox</h4>

        </div>
       
        <div className="card">
          <div className="row g-0">
            <div className="col-12 col-lg-5 col-xl-4 w-100 ">
              <p className=" pl-2 w-100 ticket_bg text-white pt-2 pb-2 div_tickets">All tickets</p>
              <Scrollbars style={{ height: 320 }}>
                {tickets && tickets.map((item, key) => {
                  return (
                    <Link
                      to={`/user/${id}/${item._id}/queries`}
                      className={
                        ticket_id === item._id
                          ? item.status === 1 ? "list-group-item list-group-item-action border-1 bg-warning"
                          :
                          "list-group-item list-group-item-action border-1 bg-danger"
                          
                          : item.status === 0 ? "list-group-item list-group-item-action border-1  " : "list-group-item list-group-item-action border-1 "
                      }
                      key={key}
                      style={{ width: "96%" }}
                    >
                          <storng className="flex-grow-1 font-weight-bold">{item._id}</storng>
                    
                        <div className="d-flex align-items-start">
                          <div className="small">
                            <span className={item.status === 1 ? "fas fa-circle chat-online" : "fas fa-circle chat-offline"} />
                          </div>

                          <div className="flex-grow-1 ml-3">{item.title}</div>
                        </div>

                     
                        {unreadsMesssages && unreadsMesssages.map((val, i) => {
                          return key === i ? (
                      //         <span
                      //   href="javasript:void(0)useParams
                      //   useParams"
                      //   onClick={() => getTicketNotificationRead(item._id)}
                      // >
                      //       <span
                      //         className="badge badge-warning navbar-badge mt-1"
                      //         style={{ fontSize: "16px" }}
                      //       >
                      //         {val}
                      //       </span>
                      // </span>
                      ''

                          ) : (
                            
                            ""
                          );
                        })}

                        <div className="text-black-50 mt-2">
                          {getDateCheck(item)}
                        </div>
                        <hr />
                        {item.status === 1 ? role === "ADMIN" ? <span>  <button type="button" class="btn btn-danger btn-xs " onClick={() => { handleDelete(`${baseUrl}/user/ticket/${item._id}/close` , item._id , item.user_id ,   ) } }>Close Ticket</button></span> : ''
 
                        :
                        ""
                      }

                    </Link>
                  );
                })}

                <hr className="d-block d-lg-none mt-1 mb-0" />
              </Scrollbars>
            </div>

            <div className="col-12 col-lg-7 col-xl-8">
              <div className="py-2 px-4 border-bottom d-none d-lg-block">
                <div className="d-flex align-items-center py-1">
                  <div className="position-relative">
                    <img
                      src={
                        user.image === undefined || user.image === null
                          ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLTPSmPA2vPk7G65d9vG6caXiJpl_OwRuQdlod2dgGqO03AlgAVlUybubLxZRHZqgA-AA&usqp=CAU"
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLTPSmPA2vPk7G65d9vG6caXiJpl_OwRuQdlod2dgGqO03AlgAVlUybubLxZRHZqgA-AA&usqp=CAU"
                      }
                      className="rounded-circle mr-1 img_icon"
                      alt="user"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex-grow-1 pl-3">
                    <strong>{user.username}</strong>
                    <div className="text-muted small">
                      <em>{user.email}</em>
                    </div>
                  </div>
                  <div></div>
                    <div className=" float-top float-right">
                    <a href="javascript:void(0)" onClick={() => reloadQuery()}>
                    <i className={reload ? "fas fa-sync-alt  fa-spin-click" : "fas fa-sync-alt text-secondary "} aria-hidden="true"></i>
                    {/* <RetweetOutlined className="text-dark reload_icon fa-spin-click" className={reload ? "reload_icon fa-spin-click" : "text-dark reload_icon "}/> */}

              </a>
                  
                    </div>
                </div>

              </div>

              {/* <Scrollbars style={{height: 300 }}> */}

              <div className="position-relative">
                <ScrollToBottom
                  className={`chat-body ${ROOT_CSS}`}
                  style={{
                    height: "200px",
                    overflowY: "scroll",
                    position: "relative",
                    bottom: 0,
                  }}
                >
                  <div className="chat-messages p-4">
                    {ticketMessageQueries === undefined
                      ? ""
                      : ticketMessageQueries.map((item, key) => {
                          return (
                            <>
                              {item.to === "ADMIN" ? (
                                <div className="chat-message-left pb-4">
                         
                                  <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                                    <div className=" mb-1">
                                      <span className="font-weight-bold">
                                        {user.username}
                                      </span>
                                      <span className="text-muted">
                                        {" "}
                                        ({getDateChecks(item)})
                                      </span>
                                    </div>
                                    {item.message}
                                  </div>
                                </div>
                              ) : (
                                <div className="chat-message-right pb-4">
                                  <div>
                                    <div className="text-muted small text-nowrap mt-2"></div>
                                  </div>
                                  <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
                                    <div className="mb-1">
                                      <span className="font-weight-bold">
                                        ADMIN
                                      </span>
                                      <span className="text-muted">
                                        {" "}
                                        ({getDateChecks(item)})
                                      </span>
                                    </div>
                                    {item.message}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })}
                  </div>
                </ScrollToBottom>
              </div>

              {/* </Scrollbars> */}
{/* {status === 1 ?

<form method="post" >
<div className="flex-grow-0 py-3 pr-2 border-top">
  <div class="mb-3">
    <textarea
      class="form-control"
      placeholder="Type your reply here..."
      rows="3"
      
    ></textarea>
    <div className="invalid-feedback">
     
    </div>
  </div>

  <button className="btn btn-primary" type="submit" onClick={onSubmit}>Send</button>
</div>
</form> : 
''} */}

{/* <form method="post" style={{ maxWidth : "100%" }}>
<div className="flex-grow-0 py-3 pr-2 border-top">
  <div class="mb-3">
    <textarea
      class="form-control w-100"
      placeholder="Type your reply here..."
      rows="3"
      
    ></textarea>
    <div className="invalid-feedback">
     
    </div>
  </div>

  <button className="btn btn-info btn-sm" type="submit" onClick={onSubmit}>Send</button>
</div>
</form>  */}
{status && status === 1 ? <Form {...formItemLayout} form={form} name="ticket_rply" layout="vertical" onFinish={onFinish} className="innerFields">
  <Col sm={22} md={22}>
						<Form.Item name="message" label="Reply" rules={[{ required: true, message: 'Please some value!' }]} >
                        	<TextArea placeholder="Type your reply here..." type="number" rows={4}/>
						</Form.Item>
					</Col>

          <Form.Item className="mb-0">
				<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light mb-4" onClick={() => form.submit()}>Save</Button>
				</Form.Item>

  </Form> : 
  '' }
	

            </div>
          </div>
        </div>
      </section>


      <Modal visible={visiable} title="Create Ticket" onCancel={cancelFun} footer={<Fragment>
				<Button onClick={cancelFun}>Cancel</Button>
			<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={()=>form.submit()}>Create Ticket</Button>
			</Fragment>} >
		<Form  form={form} name="loc_info" layout="vertical" onFinish={onFinishForm} className="innerFields">
			<Form.Item name="title" label="Title" rules={[{ required: true, message: 'This field is required!' }]} >
				<Input placeholder="Title" />
			</Form.Item>
      <Form.Item name="message" label="Message" rules={[{ required: true, message: 'This field is required!' }]} >
                        	<TextArea placeholder="Message"  rows={3}/>
						</Form.Item>

		</Form>
		
	</Modal>

    </>
  );
}
