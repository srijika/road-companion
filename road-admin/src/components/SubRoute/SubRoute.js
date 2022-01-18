import React, { Component, Suspense, lazy } from 'react';
import {Route } from 'react-router-dom';
import { Redirect } from 'dva/router';
import Dashboard from '../../pages/dashboard';
import BarberIndex from '../../pages/barber/index';
import AddEditBarber from '../../pages/barber/action/addEdit';
import barberShop from '../../pages/barber/action/barberShop';

import UsersList from '../../pages/users/list';
import AddEditUser from '../../pages/users/action/addEdit';
import Tags from '../../pages/tags/list';
import AddEditTag from '../../pages/tags/action/addEdit';
import Reports from '../../pages/reports/list';
import CarList from '../../pages/cars/list';
import AddEditCar from '../../pages/cars/action/addEditCar';

import CarModelList from '../../pages/cars-model/list';
import AddEditCarModel from '../../pages/cars-model/action/addEdit';

import CarColorList from '../../pages/colors/list';
import AddEditCarColor from '../../pages/colors/action/addEdit';

import CarTypeList from '../../pages/types/list';
import AddEditCarType from '../../pages/types/action/addEdit';













import ProductList from '../../pages/products/list';
import AddEditProduct from '../../pages/products/action/addEdit';
import QAns from '../../pages/products/action/qA';
import CategoryList from '../../pages/category/list';
import SubCategoryList from '../../pages/subcategory/list';
import Notifications from '../../pages/notifications';



import Billing from '../../pages/billing';
import Setting from '../../pages/setting/setting';
import VerifySellerForm from '../../pages/setting/verify-seller-form';
import BusinessVarificationForm from '../../pages/business-varification/verify-seller-form';
import ApproveBusiness from '../../pages/business';
import Account from '../../pages/account/index';
import Orders from '../../pages/orders/orders';
import OrdersDetails from '../../pages/orders/details/order-details';
import AccountHealth from '../../pages/account-health/account-health';
import Help from '../../pages/help/help';
import HelpAdd from '../../pages/help/action/add';
import HelpDetail from '../../pages/help/action/detail';
import Advertising from '../../pages/advertising/advertising';
import News from '../../pages/news/news';
import AddEditNews from '../../pages/news/action/addEdit';
import NewsCategory from '../../pages/news-category/list';
import ManageOrders from '../../pages/manage-orders/manage-orders';
import ManageReturn from '../../pages/manage-return/manage-return';
import ManageCaselog from '../../pages/manage-caselog/manage-caselog';
import CampaignsManager from '../../pages/campaigns-manager/campaigns-manager';
import CampaignsAdd from '../../pages/campaigns-manager/action/addEdit';
import Communication from '../../pages/communication/communication';
import NewsDetails from '../../pages/news/details/news-details';
import Plans from "../../pages/plans/plans";
import PlanAddEdit from '../../pages/plans/actions/addEdit';
import BusinessVarification from '../../pages/business-varification/business-varification';
import CouponsList from '../../pages/coupons/list'
import HompageBanners from '../../pages/homepage-banner/list';
import ShippingRates from '../../pages/shipping-rates/list';
import ShippingRatesAdd from '../../pages/shipping-rates/actions/addEdit';
import ShippingRatesEdit from '../../pages/shipping-rates/actions/addEdit';
import FAQ from '../../pages/FAQ/list';
import FAQAdd from '../../pages/FAQ/actions/addEdit';
import PagesList from '../../pages/pages/list';
import AddEditPages from '../../pages/pages/action/addEdit';
import Transaction from '../../pages/transaction/seller/transaction';
import RazorpayTransactions from '../../pages/razorpay-transactions/list';
import RazorpayView from '../../pages/razorpay-transactions/view';

import Announcement from '../../pages/announcement/list';
import AnnouncementAdd from '../../pages/announcement/action/addEdit';
import AnnouncementEdit from '../../pages/announcement/action/addEdit';
import BlogsList from '../../pages/blogs/list';
import AddEditBlogs from '../../pages/blogs/action/addEdit';
import BlogsCategory from '../../pages/blog-category/list';
import AddEditBlogsCategory from '../../pages/blog-category/action/addEdit';
import AttributeList from '../../pages/attribute/list';
import AttributeAdd from '../../pages/attribute/action/addEdit';
import AttributeEdit from '../../pages/attribute/action/addEdit';

import UnitList from '../../pages/unit/list';
import UnitAdd from '../../pages/unit/action/addEdit';
import UnitEdit from '../../pages/unit/action/addEdit';

import AddEditReturnPolicy from '../../pages/return-policy/action/addEdit';
import ReturnPolicyList from '../../pages/return-policy/list';
import Contact from '../../pages/contact/contact';



import SiteSetting from '../../pages/site-setting/list';
//Ticket Query Service
import TicketQueries from '../../pages/ticket-query/TicketQueries';
import UserTicketQuery from '../../pages/ticket-query/UserTicketQuery';









function hasAdmin(){
		let role = localStorage.getItem('role');
		if(role === "ADMIN"){
			return true;
		}
		else{ return false }
	}
	
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasAdmin() ? (<Component {...props} />) : (<Redirect to={{ pathname: "/", state: { from: props.location } }} />)
    }
  />
);

class SubRoute extends Component {	




	render() {
		return (
			<div> 
				{/* Dashboard */}
			  <Route exact name="Dashboad" breadcrumbName="Dashboad" path={'/'} component = {Dashboard}/>  

			  {/* Barber List */}
			  <PrivateRoute exact path='/barber' component={BarberIndex} />
			  <PrivateRoute exact path='/barber/edit/:id' component={AddEditBarber} />
			  <PrivateRoute exact path='/barber/shop/:id' component={barberShop} />


			  {/* User List */}
             <PrivateRoute exact path='/users' component={UsersList} />
			  <PrivateRoute exact path='/users/edit/:id' component={AddEditUser} />
			 
			 {/* Tags */}
             <PrivateRoute exact path='/tags' component={Tags} />
			  <PrivateRoute exact path='/tag/edit/:id' component={AddEditTag} />

			 {/* Reports */}
             <PrivateRoute exact path='/post-report' component={Reports} />
			  {/* <PrivateRoute exact path='/tag/edit/:id' component={AddEditTag} /> */}





















			  <Route exact path={'/products'} component = {ProductList}/>
			  <Route exact path={'/products/add'} component = {AddEditProduct}/>
			  <Route exact path={'/products/edit/:id'} component = {AddEditProduct}/>
			  <Route exact path={'/products/qa/:id'} component = {QAns}/>
			  <Route exact path={`/setting`} component={Setting}/>
			  <Route exact path={`/orders`} component={Orders}/>
			  <Route exact path={`/order/:id`} component={OrdersDetails} />
			  <Route exact path={`/advertising`} component={Advertising} />
			  <Route exact path={`/news-category`} component={NewsCategory} />
			  <Route exact path={`/news`} component={News} />
			  <Route exact path={`/news/add`} component={AddEditNews} />
			  <Route exact path={'/news/edit/:id'} component = {AddEditNews}/>
			  <Route exact path={`/account-health`} component={AccountHealth}/>
			  <Route exact path={`/manage-caselog`} component={ManageCaselog}/>
			  <Route exact path={`/campaigns-manager`} component={CampaignsManager}/>
			  <Route exact path={`/campaigns-manager/add`} component={CampaignsAdd}/>
			  <Route exact path={'/campaigns-manager/edit/:id'} component = {CampaignsAdd}/>
			  <Route exact path={`/communication`} component={Communication}/>
			  <Route exact path={`/business-verification`} component={BusinessVarification}/>
			  <Route exact path={`/business-verification/verify/`} component={BusinessVarificationForm}/>
			  <Route exact path='/business-verification/verify/:id' component={BusinessVarificationForm}/>
			  <Route exact path={`/help`} component={Help}/>
			  <Route exact path={`/help/add`} component={HelpAdd}/>
			  <Route exact path={`/help/detail`} component={HelpDetail}/>
			  <Route exact path={`/help/detail/:id`} component={HelpDetail}/>
			  <Route exact path={"/account"} component={Account}/>
			  <Route exact path={"/plans"} component={Plans}/>
			  <Route exact path={"/plans/add"} component={PlanAddEdit}/>
			  <Route exact path={"/coupons"} component={CouponsList}/>
			  <Route exact path={"/banners"} component={HompageBanners}/>
			  <Route exact path={"/shipping-rates"} component={ShippingRates}/>
			  <Route exact path={"/shipping-rates/add"} component={ShippingRatesAdd}/>
			  <Route exact path={"/shipping-rates/edit/:id"} component={ShippingRatesEdit}/>
			  <Route exact path={"/FAQ"} component={FAQ}/>
			  <Route exact path={"/FAQ/add"} component={FAQAdd}/>
			  <Route exact path={'/FAQ/edit/:id'} component = {FAQAdd}/>
			  <PrivateRoute path='/category' component={CategoryList} />
			  <PrivateRoute path='/subcategory' component={SubCategoryList} />
			

			  <PrivateRoute exact path='/approve' component={ApproveBusiness} />
			  <PrivateRoute exact path='/approve/business-verify/:id' component={VerifySellerForm} />
			  <Route exact path={"/pages"} component={PagesList}/>
			  <Route exact path={"/pages/add"} component={AddEditPages}/>
			  <PrivateRoute exact path='/pages/edit/:id' component={AddEditPages} />
			  <Route exact path={"/blogs"} component={BlogsList}/>
			  <Route exact path={"/blogs/add"} component={AddEditBlogs}/>
			  <PrivateRoute exact path='/blogs/edit/:id' component={AddEditBlogs} />
			  <Route exact path={`/notification`} component={Notifications} />
			  <Route exact path={'/transaction/seller/:id'} component = {Transaction}/>


			  <Route exact path={'/razorpay-transaction'} component = {RazorpayTransactions}/>
			  <Route exact path={'/razorpay-transaction/detail/:id'} component = {RazorpayView}/>

			  <Route exact path={'/announcement'} component = {Announcement}/>
			  <Route exact path={'/announcement/add'} component = {AnnouncementAdd}/>
			  <Route exact path={'/announcement/:id/edit'} component = {AnnouncementEdit}/>
			  <Route exact path={`/blogs-category`} component={BlogsCategory} />
			  <Route exact path={"/blogs-category/add"} component={AddEditBlogsCategory}/>
			  {/* <Route exact path={"/blogs-category/add"} component={AddEditBlogsCategory}/> */}
			  <Route exact path='/blogs-category/edit/:id' component={AddEditBlogsCategory} />


			  <Route exact path={'/attribute'} component = {AttributeList}/>
			  <Route exact path={'/attribute/add'} component = {AttributeAdd}/>
			  <Route exact path={'/attribute/:id/edit'} component = {AttributeEdit}/>
			  
			  <Route exact path={'/unit'} component = {UnitList}/>
			  <Route exact path={'/unit/add'} component = {UnitAdd}/>
			  <Route exact path={'/unit/:id/edit'} component = {UnitEdit}/>

			  <Route exact path={`/return-policy`} component={ReturnPolicyList} />
			  <Route exact path={"/return-policy/add"} component={AddEditReturnPolicy}/>
			  <Route exact path='/return-policy/edit/:id' component={AddEditReturnPolicy} />
			  <Route exact path={`/contact`} component={Contact}/>
			  <Route exact path={`/settings`} component={SiteSetting}/>

			 <Route exact path={`/seller/:id/queries`} component={TicketQueries} />
             <Route exact path={`/seller/:id/:ticket_id/queries`} component={TicketQueries} />
			 <Route exact path={`/user/:id/queries`} component={UserTicketQuery} />
             <Route exact path={`/user/:id/:ticket_id/queries`} component={UserTicketQuery} />
			 
			 <Route exact path={"/car-brands"} component={CarList}/>
			 <Route exact path={"/car-brand/add"} component={AddEditCar}/>
			 <PrivateRoute exact path='/car-brand/edit/:id' component={AddEditCar} />

			 {/* car model routes */}
			 
			 <Route exact path={"/car-models"} component={CarModelList}/>
			 <Route exact path={"/car-models/add"} component={AddEditCarModel}/>
			 <PrivateRoute exact path='/car-models/edit/:id' component={AddEditCarModel} />


			 <Route exact path={"/car-colors"} component={CarColorList}/>
			 <Route exact path={"/car-colors/add"} component={AddEditCarColor}/>
			 <PrivateRoute exact path='/car-colors/edit/:id' component={AddEditCarColor} />

			 <Route exact path={"/car-types"} component={CarTypeList}/>
			 <Route exact path={"/car-type/add"} component={AddEditCarType}/>
			 <PrivateRoute exact path='/car-type/edit/:id' component={AddEditCarType} />







		
			</div>



		);
   }
} 

export default SubRoute;