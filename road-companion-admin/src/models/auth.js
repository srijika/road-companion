import { login, resetpass, Register, forgetpassword, resetPassword, resendOTPTOUser, varifyUser } from '../services/api'
import { message } from 'antd';
export default {
  namespace: 'auth',

  state: {
    //data: null,
    login: { count: 0 },
    forgot: { count: 0 },
    reg: { count: 0 },
    alrdreg: { count: 0 },
    varify: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *varifyOtp({ payload }, { call, put }) {
      const response = yield call(varifyUser, payload);
      if (!response.status) {
        message.error(response.msg || response.message || response.err, 5);
      } else {
        yield put({ type: 'varifySuccess', ...response });
      }
    },
    *resendOtp({ payload }, { call, put }) {
      const response = yield call(resendOTPTOUser, payload);
      if (!response.status) {
        message.error(response.msg || response.message || response.err, 5);
      } else {
        if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      }
    },
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);


      if (!response.status) {
        if (response.msg == "Your account is not verified" || response.message == "Your account is not verified") {
          localStorage.setItem("flow", 'sin');
          localStorage.setItem('user_email', payload.username);
          localStorage.setItem("LoginCred", JSON.stringify(payload));
          yield put({ type: 'varify', ...response });
        } else {
          message.error(response.msg || response.message || response.err, 5);
        }
      }
      if (response.status) {
        let hostname = window.location.hostname;

        let activeRole = 'ADMIN';




        console.log(window.location.hostname === 'localhost');

        // if (role === activeRole) // For Production

        if(window.location.hostname === 'localhost') {
            let role = response.user.role;
            if (role !== "CUSTOMER" && role !== "GUEST") //For localhost 
            {
              localStorage.removeItem('flow');
              localStorage.removeItem('LoginCred')
              localStorage.setItem('token', response.accessToken);
              localStorage.setItem('role', role);
              localStorage.setItem('user', JSON.stringify(response.user));
              localStorage.setItem('userId', response.user._id);
  
              localStorage.setItem('isEmailVerified', response.user_detail.isEmailVerified ? response.user_detail.isEmailVerified === true ? 'true' : 'false' : 'false');
              yield put({ type: 'save', ...response });
            } else {
              message.error("You are not authorized to Login...!", 5);
            }
          }else {
            let role = response.user.role;
            if (role === activeRole) //For localhost 
            { 
              localStorage.removeItem('flow');
              localStorage.removeItem('LoginCred')
              localStorage.setItem('token', response.accessToken);
              localStorage.setItem('role', role);
              localStorage.setItem('user', JSON.stringify(response.user));
              localStorage.setItem('userId', response.user._id);
              localStorage.setItem('isMobileVerified', response.user.isMobileVerified ? response.user.isMobileVerified === true ? 'true' : 'false' : 'false');
              localStorage.setItem('isEmailVerified', response.user.isEmailVerified ? response.user.isEmailVerified === true ? 'true' : 'false' : 'false');
              yield put({ type: 'save', ...response });
            } else {
              message.error("You are not authorized to Login...!", 5);
            }
          }
        }
    },
    *forgotFun({ payload }, { call, put }) {
      const response = yield call(forgetpassword, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success(response.msg || response.message || response.err, 5); }
      localStorage.setItem("flow", 'forgot');
      localStorage.setItem('user_email', payload.username);
      yield put({ type: 'forgot', ...response });
    },
    *resetPassword({ payload }, { call, put }) {
      const response = yield call(resetPassword, payload);
      console.log(response)
      if (!response.status) {
        message.error(response.msg || response.message || "Something Went to wrong...Please Try Again!", 5);
      } else {
        message.success(response.msg || response.message || "Password Successfully Changed... Login again!", 5);
        yield put({ type: 'resetPasswordSuccess', ...response });
      }

    },
    *register({ payload }, { call, put }) {
      const response = yield call(Register, payload);
      if (!response.status) {
        if (response.msg == "This Email is already registered" || response.message == "This Email is already registered") {
          message.success("Your email is already register in Choovoo Barber so login with your email & password..!", 5);
          yield put({ type: 'alrdreg', ...response });
        } else if (response.msg == "This Mobile No is already registered" || response.message == "This Mobile No is already registered") {
          message.success("Your mobile number is already register in Choovoo Barber so login with your mobile number & password..!", 5);
          yield put({ type: 'alrdreg', ...response });
        } else {
          message.error(response.msg || response.message || response.err, 5);
        }
      } else {
        if (response.status) { message.success("Register Successfully!", 5); }
        yield put({ type: 'reg', ...response });
      }

    },
    *logoutApp({ _ }, { call, put }) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      yield put({ type: 'logout' });
    },
  },

  reducers: {
    otpSendSuccess(state, action) {
      return {
        ...state,
        varify: { ...action }, login: { count: 0 }
      };
    },
    varifySuccess(state, action) {
      return {
        ...state,
        varify: { ...action }, login: { count: 0 }
      };
    },
    save(state, action) {
      action.count = state.login.count + 1;
      return {
        ...state,
        login: action, varify: {}
      };
    },
    varify(state, action) {
      return {
        ...state,
        login: 'varify', varify: {}
      };
    },
    forgot(state, action) {
      action.count = state.forgot.count + 1;
      return { ...state, forgot: action };
    },
    resetPasswordSuccess(state, action) {
      return {
        ...state,
        resetPassword: { ...action }, forgot: {}
      };
    },
    resetPasswordSuccessDone(state, action) {
      return { ...state, resetPassword: {} };
    },
    registerSuccess(state, action) {
      action.count = 0;
      return { ...state, reg: { count: 0 } };
    },
    alrdregisterSuccess(state, action) {
      return { ...state, varify: {}, login: { count: 0 } };
    },
    verifyBackNuttunSuccess(state, action) {
      return { ...state, varify: {}, login: { count: 0 } };
    },
    verotpSuccess(state, action) {
      action.count = 0;
      return { ...state, alrdreg: { count: 0 } };
    },
    alrdreg(state, action) {
      action.count = state.alrdreg.count + 1;
      return {
        ...state,
        alrdreg: { action }
      };
    },
    reg(state, action) {
      action.count = state.reg.count + 1;
      return {
        ...state,
        reg: { action }
      };
    },
    logout(state) {
      return { ...state, login: { count: 0 }, reg: { count: 0 } };
    },
  },
};