import React from 'react';
import { Modal,  } from 'antd';
import style from  '../../layout/login.css';

class AppTerms extends React.Component {
  render() {
    const { visible, onCancel, onCreate } = this.props;
    return (
      <Modal style={{maxWidth:650}} className={style.login_block} visible={visible} title="Terms and condition" okText="Ok" onCancel={onCancel} onOk={onCreate} footer={null}>
        <p>terms and condition</p>
      </Modal>
    );
  }
}



export default AppTerms;