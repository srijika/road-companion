
import React , { useEffect ,  useState} from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import BasicLayout from './layout/BasicLayout';
import AppLogin from './layout/login';
import AppTest from './layout/test';
import AppRegister from './layout/register';
import AppReset from './layout/reset';
import AppVarify from './layout/varify';




function hasLogin(props){

		let token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    const objUser = JSON.parse(user);

		if(token && objUser){
			return true;
		}
		else{ return false }
	}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasLogin() ? (<Component {...props} />) : (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />)
    }
  />
);


function RouterConfig({ history }) {
  return (
    <Router history={history} basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path='/login' component={AppLogin} />
        <Route exact path='/verify' component={AppVarify} />		
        <Route exact path='/test' component={AppTest} />		
        <Route exact path='/register' component={AppRegister} />
        <Route exact path='/reset' component={AppReset} />
        <PrivateRoute path='/' component={BasicLayout} />
      </Switch>
    </Router>
  );
}




export default RouterConfig;


// import React from 'react';
// import { Router, Route, Switch, Redirect } from 'dva/router';
// import BasicLayout from './layout/BasicLayout';
// import AppLogin from './layout/login';
// import AppTest from './layout/test';
// import AppRegister from './layout/register';
// import AppReset from './layout/reset';
// import AppVarify from './layout/varify';

// function hasLogin(){
// 		let token = localStorage.getItem('token');
// 		if(token){
// 			return true;
// 		}
// 		else{ return false }
// 	}
	
// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props =>
//       hasLogin() ? (<Component {...props} />) : (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />)
//     }
//   />
// );


// function RouterConfig({ history }) {
//   return (
//     <Router history={history} basename={process.env.PUBLIC_URL}>
//       <Switch>
//         <Route exact path='/login' component={AppLogin} />
//         <Route exact path='/verify' component={AppVarify} />		
//         <Route exact path='/test' component={AppTest} />		
//         <Route exact path='/register' component={AppRegister} />
//         <Route exact path='/reset' component={AppReset} />
//         <PrivateRoute path='/' component={BasicLayout} />
//       </Switch>
//     </Router>
//   );
// }

// export default RouterConfig;