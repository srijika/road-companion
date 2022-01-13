import React from 'react';
import { Link  } from 'react-router-dom';
import {Router} from 'react-router';
import Apploader from './../../../components/loader/loader'
import { connect } from 'dva';
import {Card, Row, Col} from 'antd';
import { LeftOutlined } from '@ant-design/icons';



class HelpDetails extends React.Component {

    state = {
    };
   
    componentDidMount() {
        this.props.dispatch({ type: 'ticket/detailTicket', payload:{'ticket_id':this.props.match.params.id} })
    } 

    


   
    render(){
        const {detail} = this.props;
        console.log('d:',detail);
        return (
            <div>
                 <Apploader show={this.props.loading.global}/>
            <Card title={<span><LeftOutlined onClick={() => this.props.history.push('/help')} /> Ticket Detail </span>} style={{ marginTop: "0" }}>
            <Row style={{marginBottom:'0.625rem'}}>
                <Col span={8}>
                        <span style={{color:'#666', fontWeight:'700'}}>Title</span>
                </Col>
                <Col span={16}>
                    {detail && detail.title}
                </Col>
            </Row> 
            <Row style={{marginBottom:'0.625rem'}} >
                <Col span={8}>
                        <span  style={{color:'#666', fontWeight:'700'}} >Email</span>
                </Col>
                <Col span={16}>
                {detail && detail.email || '-'}
                </Col>
            </Row> 
            <Row style={{marginBottom:'0.625rem'}} >
                <Col span={8}>
                        <span  style={{color:'#666', fontWeight:'700'}} >Priority</span>
                </Col>
                <Col span={16}>
                        {detail && detail.priority || '-'}
                </Col>
            </Row >
            <Row style={{marginBottom:'0.625rem'}}>
                <Col span={8}>
                        <span  style={{color:'#666', fontWeight:'700'}} >Status</span>
                </Col>
                <Col span={16}>
                { detail && (detail.status?<span style={{color : "green"}}>open</span>:<span style={{color : "red"}}>closed</span>) || '-'  }
                </Col>
            </Row>
            <Row style={{marginBottom:'0.625rem'}}>
                <Col span={8}>
                        <span  style={{color:'#666', fontWeight:'700'}} >Description</span>
                </Col>
                <Col span={16}>
                {(detail && detail.description) || '-'}
                </Col>
            </Row>
        </Card>
            </div>
       );
        }
};

const mapToProps = (state) => {
return {
    detail: state.ticket.detail,
    loading:state.loading
}
};

export default connect(mapToProps)(HelpDetails);