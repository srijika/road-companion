import { Alert, Form, Input, Button, Typography, Popover, Tooltip } from 'antd';
import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
//import Apploader from './../../components/loader/loader'
//import ErrorAlert from '@/components/CommonComp/AlertMessage';
import styles from './style.less'
const { Text } = Typography;

const ChangePassword = props => {
  const [form] = Form.useForm();
  const [count, setCount] = useState(0);
  const [fieldType, setFieldType] = useState(false);
  const [error, setError] = useState(false);
  const [charval, setCharval] = useState(false);
  const [upperval, setUpperval] = useState(false);
  const [lowerval, setLowerval] = useState(false);
  const [numval, setNumval] = useState(false);
  const [Scharval, setScharval] = useState(false);
  const [TooltipShow, setTooltipShow] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [valid, setValid] = useState(false);
  //const fieldFocus = useRef();
  const btnFocus = useRef();
  const { dispatch } = props;



  const skipFun = (e) => {
    if (valid) setValid(false);
    if (TooltipShow) setTooltipShow(false);
    if (confirm) setConfirm(false);
    form.resetFields();
    props.skip();
  }

  const onFinish = values => {

    console.log();
    delete values["Cpassword"];
    if (valid) setValid(false);
    if (TooltipShow) setTooltipShow(false);
    if (confirm) setConfirm(false);
    props.successCall(values);
    console.log(valid);
    console.log('working');
  };

  const checkPassword = (value) => {
    //console.log('checkpassword', value)

    var pass = value;
    let special = /[^\w\s]/g;
    let capital = /^(?=\S*[A-Z])/g;
    let number = /^(?=\S*\d)/g;
    let small = /^(?=\S*[a-z])/g;
    let specChar = special.test(pass);

    if (value !== undefined) {
      let showtooltip = number.test(pass) && capital.test(pass) && small.test(pass) && specChar && value.length > 7 && value.length < 17;

      setCharval(value.length > 7 && value.length < 17);
      setUpperval(capital.test(pass));
      setLowerval(small.test(pass));
      setNumval(number.test(pass));
      setScharval(specChar)

      if (showtooltip || value === '') {
        setTooltipShow(false)
        if (value !== '') { setValid(true) }
        return;
      } else {
        setTooltipShow(true)
        setValid(false)
        return Promise.reject('Please enter valid password!');
      }
    } else {
      setValid(false);
      return setTooltipShow(true)
    }

    // {callback();}
    //return Promise.reject('The two passwords that you entered do not match!');
  }

  useEffect(() => {
    let unmounted = false;
    //fieldFocus.current.focus();
    /*if(!unmounted &&  props.userLogin.login.count > 0){
      //dispatch({ type: 'login/clearLogin'});
    }*/
    return () => {
      unmounted = true;
    }
  }, [dispatch])

  const content = (
    <Fragment>
      <h4>Password Requirements</h4>
      <div className="subcontent">
        <p className={charval ? 'active' : ''}>8-16 Characters</p>
        <p className={upperval ? 'active' : ''}>1 Uppercase Letter</p>
        <p className={lowerval ? 'active' : ''}>1 Lowercase Letter</p>
        <p className={numval ? 'active' : ''}>1 Number</p>
        <p className={Scharval ? 'active' : ''}>1 Special Character</p>
      </div>
    </Fragment>
  );
  const suffixpass = valid ? <i className={"far fa-check"} style={{ color: 'rgba(30, 202, 183, 1)' }} /> : <i />;

  return (<Fragment>
    {error}
    <Form layout="vertical" form={form} name="resetpass" className="login-form" onFinish={onFinish} >
      {!props.hideOldPass &&
        <Form.Item name="oldPassword" label="CURRENT PASSWORD"
          rules={[{ required: true, message: 'Please confirm your password!' },]}
        >
          <Input type={'password'} className="hasLeftPrefix"
            prefix={<i className="fas fa-key" name="key" />}
            maxLength="16"
            placeholder="Current Password" />
        </Form.Item>
      }

      <Tooltip placement="right" title={content} trigger={'focus'} overlayClassName="intooltip" visible={TooltipShow}>
        <Form.Item name="password" label="NEW PASSWORD"
          rules={[{ required: true, message: 'This field is required.' },
          {
            validator: async (_, value) => await checkPassword(value)
          }
          ]}
        //validateStatus={error ? "error": !TooltipShow?"success":'' }
        >
          <Input type={fieldType ? 'text' : 'password'} className={(valid ? 'hasEyeIcon' : '') + ' hasLeftPrefix'} prefix={<i className="fas fa-key" name="key" />} placeholder="Password"
            //autoFocus={true}
            //ref={fieldFocus}
            maxLength="16"
            suffix={suffixpass}
            onFocus={() => setTooltipShow(true)}
            onBlur={() => setTooltipShow(false)}
          />
        </Form.Item>
      </Tooltip>

      <Form.Item name="Cpassword" label="CONFIRM PASSWORD"
        dependencies={['password']}
        //validateStatus={error ? "error":''}
        rules={[{ required: true, message: 'Please confirm your password!' },
        ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value) {
              return Promise.reject('');
            }
            if (value && getFieldValue('password') === value) {
              if (getFieldValue('password') === value) {
                setConfirm(true);
                //btnFocus.current.focus();
              }
              return Promise.resolve();
            }
            setConfirm(false)
            return Promise.reject('Passwords not match!');
          },
        }),
        ]}
      >
        <Input type={fieldType ? 'text' : 'password'} className="hasLeftPrefix hasEyeIcon"
          prefix={<i className="fas fa-key" name="key" />}
          maxLength="16"
          placeholder="Confirm Password" />
      </Form.Item>
      <Form.Item style={{ textAlign: 'right', margin: 0 }} >
        {props.cancelBtn && <Button onClick={skipFun}>
          Cancel
          {/*props.cancelText ? props.cancelText : "Cancel"*/}
        </Button>}&nbsp;
        <Button type="primary" htmlType="submit" className="btn-w25"
          ref={btnFocus} >
          {props.buttonText ? props.buttonText : "Set Password"}
        </Button>
      </Form.Item>
    </Form>
  </Fragment>
  );
};

export default connect(({ loading }) => ({

}))(ChangePassword);
