import React, { Component, Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from 'dva/router';
import Dashboard from '../../pages/dashboard';

import UsersList from '../../pages/users/list';
import ReviewsList from '../../pages/users/reviewList';
import AddEditUser from '../../pages/users/action/addEdit';
import Reports from '../../pages/reports/list';
import CarList from '../../pages/cars/list';
import AddEditCar from '../../pages/cars/action/addEditCar';
import CarModelList from '../../pages/cars-model/list';
import AddEditCarModel from '../../pages/cars-model/action/addEdit';
import CarColorList from '../../pages/colors/list';
import AddEditCarColor from '../../pages/colors/action/addEdit';
import CarTypeList from '../../pages/types/list';
import AddEditCarType from '../../pages/types/action/addEdit';
import Notifications from '../../pages/notifications';
import FAQ from '../../pages/FAQ/list';
import FAQAdd from '../../pages/FAQ/actions/addEdit';
import PagesList from '../../pages/pages/list';
import AddEditPages from '../../pages/pages/action/addEdit';
import WithdrawRequestLists from '../../pages/withdraw-requests/list';
import UserTrips from '../../pages/user-trips/list'
import WalletAddCash from '../../pages/wallet-add-cash/list'








function hasAdmin() {
	let role = localStorage.getItem('role');
	if (role === "ADMIN") {
		return true;
	}
	else { return false }
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
				<Route exact name="Dashboad" breadcrumbName="Dashboad" path={'/'} component={Dashboard} />
				{/* User List */}
				<PrivateRoute exact path='/users' component={UsersList} />
				<PrivateRoute exact path='/users/edit/:id' component={AddEditUser} />
				<PrivateRoute exact path='/post-report' component={Reports} />

				<Route exact path={"/pages"} component={PagesList} />
				<Route exact path={"/pages/add"} component={AddEditPages} />
				<PrivateRoute exact path='/pages/edit/:id' component={AddEditPages} />

				<Route exact path={"/car-brands"} component={CarList} />
				<Route exact path={"/car-brand/add"} component={AddEditCar} />
				<PrivateRoute exact path='/car-brand/edit/:id' component={AddEditCar} />

				{/* car model routes */}
				<Route exact path={"/car-models"} component={CarModelList} />
				<Route exact path={"/car-models/add"} component={AddEditCarModel} />
				<PrivateRoute exact path='/car-models/edit/:id' component={AddEditCarModel} />
				<Route exact path={"/car-colors"} component={CarColorList} />
				<Route exact path={"/car-colors/add"} component={AddEditCarColor} />
				<PrivateRoute exact path='/car-colors/edit/:id' component={AddEditCarColor} />
				<Route exact path={"/car-types"} component={CarTypeList} />
				<Route exact path={"/car-type/add"} component={AddEditCarType} />
				<PrivateRoute exact path='/car-type/edit/:id' component={AddEditCarType} />
				<Route exact path={"/withdraw-request"} component={WithdrawRequestLists} />
				<Route exact path={"/user-trips"} component={UserTrips} />

				<Route exact path={"/wallet-add-cash"} component={WalletAddCash} />
			</div>



		);
	}
}

export default SubRoute;