import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from './../../../components/loader/loader'
import { connect } from 'dva';
import {Empty, Card, Typography, Alert,Input, Button, Table, Radio, Divider ,Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Popconfirm } from 'antd';
import { UserOutlined, LockOutlined, DeleteOutlined, ExclamationCircleOutlined , IdcardOutlined , LaptopOutlined , DatabaseOutlined , LeftOutlined} from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import Slider from "react-slick";
import  './news-details.css';
const {Meta}  = Card;
const { Search } = Input;
const { Text } = Typography;

class NewsDetails extends React.Component {

    state = {
        sortBy :'asc',
        limit : 10
    };   
    render(){
         var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
      return (
        <div>
         <div>
              <h2><span><LeftOutlined onClick={() => this.props.history.push('/news')} /></span>&nbsp;News title</h2>
              <p>
                News subheading
              </p>
          </div>  
        
        <Card size="small" >
                <Slider className="app-news-detail-slider" {...settings}>
                  <div>
                  <img src="https://cdn.pixabay.com/photo/2014/05/21/22/28/old-newspaper-350376_960_720.jpg" />
                  </div>
                  <div>
                  <img src="https://cdn.pixabay.com/photo/2015/11/07/12/02/business-1031754_960_720.jpg" />
                  </div>
              </Slider>
              <p  className="app-news-detail-date" >Category - 05/05/2020</p>
              <div className="app-news-detail-desc" >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris molestie risus a diam eleifend, bibendum consectetur velit luctus. Etiam eu faucibus leo, non pulvinar dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec commodo consectetur ex, eu auctor justo porttitor porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam sit amet massa suscipit, sollicitudin turpis sed, efficitur risus. Curabitur eleifend ullamcorper egestas. Donec cursus ligula tristique luctus elementum. Donec interdum ac lectus ut vulputate.

                      Aliquam et magna lectus. Nunc sodales nunc quis felis suscipit dignissim. Curabitur faucibus enim non eleifend pharetra. Nulla eget viverra felis, vitae semper risus. Curabitur et dapibus tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque rhoncus convallis risus, vitae dapibus metus consectetur non. Quisque pretium ex elit, at imperdiet leo luctus ac. Suspendisse malesuada imperdiet nunc quis dapibus. Suspendisse justo libero, accumsan malesuada viverra vel, lacinia vel turpis. Duis vel molestie ex, nec suscipit urna. Nullam vitae eros suscipit, tristique lacus at, tincidunt ipsum. Sed at lacus eu ligula fermentum viverra.

                      Duis est dui, sagittis vel fringilla eu, mollis sed risus. Morbi finibus ipsum felis, at sodales nisl luctus in. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras tempor dui risus, sit amet imperdiet velit feugiat non. Suspendisse interdum non mauris id egestas. Nulla in nisi a nisl mattis accumsan quis in dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce diam felis, molestie eu iaculis quis, varius sit amet lorem. Maecenas id ultrices lacus, sed fermentum sapien. Maecenas leo purus, consequat in justo in, aliquet congue eros. Suspendisse vel consequat orci.

                      Donec vulputate condimentum purus. Suspendisse dictum sagittis ante sed dignissim. Fusce et sollicitudin tortor. Sed interdum pharetra pharetra. Pellentesque vitae auctor dui. Quisque mattis, arcu et commodo condimentum, sapien dolor finibus ligula, sit amet vehicula nibh velit eget mi. Nam enim nulla, pharetra a convallis id, tincidunt eu tellus. Duis tristique ligula libero, a eleifend sem bibendum in. Suspendisse urna mauris, bibendum eget dolor id, pellentesque tincidunt libero.

                      Donec ultricies tincidunt ex, et egestas erat suscipit sit amet. Cras pulvinar consectetur quam, eget interdum felis placerat ut. Morbi vel eros vitae purus consequat ullamcorper. Donec ornare eros et est mattis vestibulum. Donec tempus, turpis sagittis vestibulum viverra, tellus felis condimentum sem, id sollicitudin dui leo eu ex. Nunc accumsan felis vel purus accumsan, nec porttitor nulla elementum. Duis imperdiet ante ac velit consequat dapibus.
              </div>
        </Card>
        </div>
      );
    }
};


export default NewsDetails;