import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import './BasicLayout.less';
import SubRoute from '../components/SubRoute/SubRoute'
import AppSidebar from '../components/Sidebar/AppSidebar'
import AppHeader from '../components/AppHeader/AppHeader'
import axios from 'axios';
import {Modal,  Layout } from 'antd';


// import './announcement.scss' 
const {  Content, Sider } = Layout; //Footer,
const baseUrl = process.env.REACT_APP_ApiUrl;
class BasicLayout extends Component {

	state = { collapsed: false, broke:false, mobileview:'', announcement: ""};
	sidebarFun=()=> this.state.mobileview ? this.props.dispatch({type: 'global/toggle'}) : null;	
	brokenFun = (val)=>{
		this.setState({mobileview:val})
		if(val)
			{if(!this.props.global.toggleval) 
				this.props.dispatch({type: 'global/toggle'})}
		if(!val)
			{if(this.props.global.toggleval)
				this.props.dispatch({type: 'global/toggle'})}
	}

	
	async componentDidMount() {

		let user_role = localStorage.getItem('role');
		if(user_role === "SELLER") {
			const res = await axios.post(`${baseUrl}/get/announcement/for/seller`);
			let announcement = res.data.announcement;
			if(announcement != undefined && announcement != "" && announcement != null) {
				this.setState({
					announcement: res.data.announcement.message
				})
			}
		}	
	}
	




	render() {
		const {global} =this.props;
		const toggle = global.toggleval;
		return (
			<Layout>
				<header className="headerdiv">
					<AppHeader/>
				</header>

			
				{/* { this.state.announcement ? 
                <div style={{ height: '50px', background: 'white' }}>
                <section class="section_my">
                    <p class="marquee text-styling" style={{ color: 'black' }}> {this.state.announcement}.</p>
                </section>
                </div>
                : ""}  */}

				
 
				<Layout>
					<Sider className="sidebarDiv"  breakpoint="sm" collapsedWidth="35"  collapsed={toggle} onClick={this.sidebarFun}>
						<AppSidebar {...this.props} /> 
					</Sider>
					{/* <Layout> */}
					<Content className="contentDiv">
						<Suspense fallback={<div>Loading...</div>} >
						<SubRoute {...this.props}/>						
						</Suspense>
					</Content> 
				</Layout>


			
			</Layout>
		);
   	}
} 
export default connect(({global, loading}) => ({
	global, loading
}))(BasicLayout);