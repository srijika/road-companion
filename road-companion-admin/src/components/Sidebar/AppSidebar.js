import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './AppSidebar.less'
import {DashboardOutlined, UnorderedListOutlined, AreaChartOutlined, CreditCardOutlined, CodeOutlined, TeamOutlined, IdcardOutlined, ProfileOutlined, BankOutlined, NotificationOutlined, BellOutlined, SettingOutlined, UserOutlined, ContactsOutlined ,AppstoreOutlined, UserAddOutlined, SnippetsOutlined, BookOutlined, InboxOutlined, MessageOutlined ,CalendarOutlined  } from '@ant-design/icons';
import { Menu, } from 'antd';

import axios from 'axios';
import {Modal} from 'antd';


const { SubMenu } = Menu;
const baseUrl = process.env.REACT_APP_ApiUrl;





// const menu = [
// 	{ path: '/', name: 'Dashboard', icon: <DashboardOutlined />, auth: ['SELLER', 'ADMIN'] },
// 	{ path: '/notification', name: 'Notifications', icon: <BellOutlined />, auth: ['ADMIN', 'SELLER'] },
// 	{ path: '/announcement', name: 'Announcement', icon: <NotificationOutlined /> , auth: ['ADMIN'] },
// 	{ path: '/account', name: 'Profile', icon: <UserAddOutlined /> , auth: ['ADMIN', 'SELLER'] },
// 	{
// 		path: '#', name: 'Users', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
// 			{ path: '/users', name: 'User List', icon: <TeamOutlined />, auth: ['ADMIN'] },
// 			{ path: '/seller', name: 'Seller List', icon: <TeamOutlined />, auth: ['ADMIN'] }
// 		]
// 	},
// 	{
// 		path: '#', name: 'Categories', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
// 			{ path: '/attribute', name: 'Attributes List', icon: <AppstoreOutlined />, auth: ['ADMIN'] },
// 			{ path: '/unit', name: 'Unit List', icon: <AppstoreOutlined />, auth: ['ADMIN'] },
// 			{ path: '/category', name: 'Categories List', icon: <AppstoreOutlined />, auth: ['ADMIN'] },
// 			{ path: '/subcategory', name: 'Sub Categories List', icon: <AppstoreOutlined />, auth: ['ADMIN'] }
// 		]
// 	},
// 	{ path: '/products', name: 'Product List', icon: <IdcardOutlined />, auth: ['SELLER'] },
// 	{ path: '/products', name: 'All Product List', icon: <IdcardOutlined />, auth: ['ADMIN'] },
// 	{ path: '/orders', name: 'Orders', icon: <ProfileOutlined />, auth: ['SELLER', 'ADMIN'] },
// 	{ path: '/return-policy', name: 'Return Policy', icon: <CalendarOutlined />	, auth: [ 'ADMIN'] },

// 	{ path: '/razorpay-transaction', name: 'Razorpay Transactions', icon: <ProfileOutlined />, auth: ['ADMIN'] },

	
// 	{
// 		path: '#', name: 'Account Management', icon: <TeamOutlined />, auth: ['ADMIN','SELLER'], children: [
// 			{ path: '/business-verification', name: 'Business Verification', icon: <DashboardOutlined />, auth: ['SELLER'] },
// 			{ path: '/approve', name: 'Approve Business', icon: <BankOutlined />, auth: ['ADMIN'] },

// 			// { path: '/communication', name: 'Vendor Details', icon: <NotificationOutlined />, auth: ['SELLER'] },
// 			// { path: '/campaigns-manager', name: 'Campaigns Manager', icon: <AreaChartOutlined />, auth: ['SELLER', 'ADMIN'] },
// 			// { path: '/account-health', name: 'Account Health', icon: <UserAddOutlined />, auth: ['SELLER', 'ADMIN'] },

			
// 			// { path: '/shipping-rates', name: 'Shipping Rates', icon: <InboxOutlined />, auth: ['SELLER'] },
// 			{ path: '/transaction/seller/'+localStorage.getItem('userId'), name: 'Transactions', icon: <ProfileOutlined />, auth: ['SELLER' ] },
// 			{ path: '/setting', name: 'Settings', icon: <SettingOutlined />, auth: ['SELLER'] },
// 		]
// 	},
// 	{
// 		path: '#', name: 'Support', icon: <TeamOutlined />, auth: ['ADMIN','SELLER'], children: [
// 			{ path: '/manage-caselog', name: 'User Help', icon: <UnorderedListOutlined />, auth: ['ADMIN'] },
// 			{ path: '/help', name: 'Seller Help', icon: <UserOutlined />, auth: ['SELLER', 'ADMIN'] },
// 			{ path: '/contact', name: 'Contact Us', icon: <ContactsOutlined />, auth: [ 'ADMIN'] },

// 		]
// 	},
// 	{
// 		path: '#', name: 'Extra', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
// 			{ path: '/blogs-category', name: 'Blogs Category', icon: <ProfileOutlined />, auth: ['ADMIN'] },
// 			{ path: '/blogs', name: 'Blogs', icon: <AppstoreOutlined />, auth: ['ADMIN'] },
// 			{ path: '/pages', name: 'Pages', icon: <CodeOutlined />, auth: ['ADMIN'] }, 
// 			{ path: '/settings', name: 'Settings', icon: <CodeOutlined />, auth: ['ADMIN'] }, 
// 			{ path: '/FAQ', name: 'FAQ', icon: <MessageOutlined />, auth: ['ADMIN'] },
// 			{ path: '/banners', name: 'Banners', icon: <ProfileOutlined />, auth: ['ADMIN'] },
// 			{ path: '/coupons', name: "Coupons", icon: <CreditCardOutlined />, auth: ['ADMIN'] },
// 			{ path: '/news-category', name: 'News Category', icon: <ProfileOutlined />, auth: ['ADMIN'] },
// 			{ path: '/news', name: 'News List', icon: <ProfileOutlined />, auth: ['ADMIN'] }
// 		]
// 	},
	
	
// ]

const menu = [
	{ path: '/', name: 'Dashboard', icon: <DashboardOutlined />, auth: ['ADMIN'] },
	{
		path: '#', name: 'Users', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
			{ path: '/users', name: 'User List', icon: <TeamOutlined />, auth: ['ADMIN'] },
			{ path: '/barber', name: 'Barber List', icon: <TeamOutlined />, auth: ['ADMIN'] }
		]
	},
	{
		path: '#', name: 'Master', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
			{ path: '/tags', name: 'Service', icon: <CodeOutlined />, auth: ['ADMIN'] }, 

			
		]
	},

	// {
	// 	path: '#', name: 'Account Management', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
	// 		{ path: '/approve', name: 'Approve Business', icon: <BankOutlined />, auth: ['ADMIN'] },
	// 	]
	// },


		{
		path: '#', name: 'Support', icon: <TeamOutlined />, auth: ['ADMIN',], children: [
			{ path: '/post-report', name: 'Reports', icon: <UnorderedListOutlined />, auth: ['ADMIN'] },
			
		]
	},

	{
		path: '#', name: 'CMS Management', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
			{ path: '/pages', name: 'Pages', icon: <CodeOutlined />, auth: ['ADMIN'] }, 
			{ path: '/settings', name: 'Settings', icon: <CodeOutlined />, auth: ['ADMIN'] }, 
			{ path: '/FAQ', name: 'FAQ', icon: <MessageOutlined />, auth: ['ADMIN'] },
			
		]
	},
	// { path: '/notification', name: 'Notifications', icon: <BellOutlined />, auth: ['ADMIN', 'SELLER'] },
	// { path: '/announcement', name: 'Announcement', icon: <NotificationOutlined /> , auth: ['ADMIN'] },
	// { path: '/account', name: 'Profile', icon: <UserAddOutlined /> , auth: ['ADMIN', 'SELLER'] },

	// {
	// 	path: '#', name: 'Categories', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
	// 		{ path: '/attribute', name: 'Attributes List', icon: <AppstoreOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/unit', name: 'Unit List', icon: <AppstoreOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/category', name: 'Categories List', icon: <AppstoreOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/subcategory', name: 'Sub Categories List', icon: <AppstoreOutlined />, auth: ['ADMIN'] }
	// 	]
	// },
	// { path: '/products', name: 'Product List', icon: <IdcardOutlined />, auth: ['SELLER'] },
	// { path: '/products', name: 'All Product List', icon: <IdcardOutlined />, auth: ['ADMIN'] },
	// { path: '/orders', name: 'Orders', icon: <ProfileOutlined />, auth: ['SELLER', 'ADMIN'] },
	// { path: '/return-policy', name: 'Return Policy', icon: <CalendarOutlined />	, auth: [ 'ADMIN'] },

	// { path: '/razorpay-transaction', name: 'Razorpay Transactions', icon: <ProfileOutlined />, auth: ['ADMIN'] },

	
	// {
	// 	path: '#', name: 'Account Management', icon: <TeamOutlined />, auth: ['ADMIN','SELLER'], children: [
	// 		{ path: '/business-verification', name: 'Business Verification', icon: <DashboardOutlined />, auth: ['SELLER'] },
	// 		{ path: '/approve', name: 'Approve Business', icon: <BankOutlined />, auth: ['ADMIN'] },

	// 		// { path: '/communication', name: 'Vendor Details', icon: <NotificationOutlined />, auth: ['SELLER'] },
	// 		// { path: '/campaigns-manager', name: 'Campaigns Manager', icon: <AreaChartOutlined />, auth: ['SELLER', 'ADMIN'] },
	// 		// { path: '/account-health', name: 'Account Health', icon: <UserAddOutlined />, auth: ['SELLER', 'ADMIN'] },

			
	// 		// { path: '/shipping-rates', name: 'Shipping Rates', icon: <InboxOutlined />, auth: ['SELLER'] },
	// 		{ path: '/transaction/seller/'+localStorage.getItem('userId'), name: 'Transactions', icon: <ProfileOutlined />, auth: ['SELLER' ] },
	// 		{ path: '/setting', name: 'Settings', icon: <SettingOutlined />, auth: ['SELLER'] },
	// 	]
	// },
	// {
	// 	path: '#', name: 'Support', icon: <TeamOutlined />, auth: ['ADMIN','SELLER'], children: [
	// 		{ path: '/manage-caselog', name: 'User Help', icon: <UnorderedListOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/help', name: 'Seller Help', icon: <UserOutlined />, auth: ['SELLER', 'ADMIN'] },
	// 		{ path: '/contact', name: 'Contact Us', icon: <ContactsOutlined />, auth: [ 'ADMIN'] },

	// 	]
	// },
	// {
	// 	path: '#', name: 'Extra', icon: <TeamOutlined />, auth: ['ADMIN'], children: [
	// 		{ path: '/blogs-category', name: 'Blogs Category', icon: <ProfileOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/blogs', name: 'Blogs', icon: <AppstoreOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/pages', name: 'Pages', icon: <CodeOutlined />, auth: ['ADMIN'] }, 
	// 		{ path: '/settings', name: 'Settings', icon: <CodeOutlined />, auth: ['ADMIN'] }, 
	// 		{ path: '/FAQ', name: 'FAQ', icon: <MessageOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/banners', name: 'Banners', icon: <ProfileOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/coupons', name: "Coupons", icon: <CreditCardOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/news-category', name: 'News Category', icon: <ProfileOutlined />, auth: ['ADMIN'] },
	// 		{ path: '/news', name: 'News List', icon: <ProfileOutlined />, auth: ['ADMIN'] }
	// 	]
	// },
	
	
]

class AppSidebar extends Component {

	constructor(props) {
		super(props);
		this.state = {
		  maintenanceModeModal: false
		}
	  }
	  
	  

	componentDidMount() {
		this.getSiteSettingData();	
	}
	

	  
	getSingleSettingData = (cards, id) => {
		let result;
		if (cards != undefined) {
			cards.map((item, key) => {
				if (item.option === id) {
					result = item.value;
				}
			})
		}
		return result;
	};

	getSiteSettingData = async () => {
		try {
		
			let user_id = localStorage.getItem('userId');
			const res = await axios.post(`${baseUrl}/api/list/setting`, { _id: user_id });
			let settings = res?.data?.settings;



			let userStatus = this.getSingleSettingData(settings, 'userStatus');
			let maintenanceMode = this.getSingleSettingData(settings, 'SELLER_WEB_UNDER_MAINTENANCE');
			
			let user_detail =  res?.data?.user_detail;

			console.log('user_detail');
			console.log(user_detail);

			if(user_detail?.maintenance_mode_for_user) {
				this.setState({ maintenanceModeModal: true })
			}else {
				this.setState({ maintenanceModeModal: false })
			}

			if(!user_detail?.maintenance_mode_for_user) {
				
				if(maintenanceMode === "yes" || maintenanceMode === "Yes") {
					this.setState({ maintenanceModeModal: true })
				}else {
					this.setState({ maintenanceModeModal: false })
				}	
			}


				// IF USER STATUS DEACTIVE TRUE THAN 
			if (userStatus) {
				localStorage.clear();
				window.location.reload();
			}
	
		} catch (e) {
			console.log(e);
		}
	};
	








handleRedirect = (path) => {

	let user_role  = localStorage.getItem('role');
	if(user_role != "ADMIN") {
		this.getSiteSettingData();
	}



	this.props.history.push(path)
}






	render() {
		const { location } = this.props;
		const pathSnippets = location.pathname.split('/').filter(i => i);
		const pathval = pathSnippets[pathSnippets.length - 1] || '';
		const routepath = pathval ? '/' + pathval : '/';
		return (
			<>
			<Menu mode="inline" defaultSelectedKeys={[routepath]}
				defaultOpenKeys={['']} selectedKeys={[routepath]} theme="dark">
				 
				{menu.map((item) => {
					let isBusinessVerfied =  JSON.parse(localStorage.getItem('user')).isBussinessVerified; 
					// if (item.auth.find(val => val === localStorage.getItem('role')) && !isBusinessVerfied) 
					if (item.auth.find(val => val === localStorage.getItem('role')) && !isBusinessVerfied) {
						
						if(item.children){
							return ( <SubMenu className="submenu"  key={item.name} title={item.name} >
									{ item.children.map((itemd, index) => {

										if (itemd.auth.find(val => val === localStorage.getItem('role'))) {
											return ( <Menu.Item  key={itemd.path}>
												<a onClick={() => { this.handleRedirect(itemd.path) }}>
													{itemd.img ? <img src={itemd.img} alt={itemd.name} /> : itemd.icon}	
													<span style={{ marginLeft: '5' }}>
														{itemd.name} 
													</span>
													</a>
												</Menu.Item> )
											}
									})	}	
							</SubMenu> )
						}else{
							return (<Menu.Item key={item.path}><a 
							// to={item.path}
							onClick={() => { this.handleRedirect(item.path) }}
							>
								{item.img ? <img src={item.img} alt={item.name} /> : item.icon}
								<span style={{ marginLeft: '5' }}>

								{item.name}
								</span>
								</a></Menu.Item>);
						}
					}
				})
				}
			</Menu>

			<Modal
            centered
            footer={null}
            width={800}
            closable={false}
            visible={this.state.maintenanceModeModal}
          >
                        {/* <img style={{  width: "100%", height: "80vh" }}  src={underMaintenanceImg} alt="Choovoo Barber" /> */}
                </Modal>


</>
		);
	}
}
export default AppSidebar;
