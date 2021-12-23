import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import '../../layout/login.less';
import { UserOutlined } from '@ant-design/icons';


const ForgotForm = (props) => {
	const onFinish = val=>{
		props.onCreate(val)
	}
	
      return (
        <Modal className="login_block" visible={props.visible} title="Recover Password" okText="Recover" onCancel={props.onCancel} onOk={props.onCreate} footer={null} width={300}>
			<Form name="normal_login" layout="vertical" className="login_form" initialValues={{ remember: true, }} onFinish={onFinish} >
			  <Form.Item name="username" rules={[ 
					{ 
						required: true,
						message: 'Please input your Email!'
					},
					{
						type: 'email',
						message: 'The input is not valid Email!',
					}, 
				]} >
				<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
			  </Form.Item>

			  <Form.Item>
				<Button type="primary" htmlType="submit" className="login-form-button">Recover Password</Button>
			  </Form.Item>
			</Form>
        </Modal>
      );
}
export default ForgotForm;