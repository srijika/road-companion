import React from 'react';
import { Modal, Button } from 'antd';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Checkbox, Select } from 'antd';
const { Option } = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}



export class AddEdit extends React.Component {
  state = {
    loading: false,
    imageUrl: null,
    file: null,
    noFile: false,
    suggestion : '',
  };
  formRef = null;
  fillDetails = true;

  componentDidUpdate(prevPros) {
    const { detail } = this.props;
    if (detail != prevPros.detail && detail != null) {
      setTimeout(() => {
        console.log('detail', detail.banner_size);
        if(detail.banner_size ==='Large'){
          this.setState({suggestion:"( 3000px x 1200px )"});
        }else{
          this.setState({suggestion:"( 379px x 188px )"});
        }
        this.formRef.setFieldsValue({
          ['title']: detail.title,
          ['description']: detail.description,
          ['banner_size']: detail.banner_size,
          ['isActive']: detail.isActive,
          ['image']: null
        })
        this.setState({ imageUrl: process.env.REACT_APP_ApiUrl + '/' + detail.thumbnailImage, noFile: true });
      }, 10);
    }
  }

  handelSuggestion = (e) => {
    if(e==='Large'){
      this.setState({suggestion:"( 3000px x 1200px )"});
    }else{
      this.setState({suggestion:"( 379px x 188px )"});
    }
  }

  handleChange = info => {
    if (info.file.type === 'image/jpeg' || info.file.type === 'image/png') {
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          file: info.file.originFileObj,
          imageUrl,
          loading: false,
        }),
      );
    }

  };

  handleOkpress() {
    if (this.state.file || this.state.noFile) {
      this.formRef.submit();
    } else {
      message.error('No image selected. Please Choose an image');
    }
  }

  handleCancelPress() {
    this.setState({
      loading: false,
      imageUrl: null,
      file: null,
      suggestion: '',

    });
    this.formRef.resetFields();
    this.props.handleCancel();
  }


  render = () => {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const tailLayout = {
      wrapperCol: {
        offset: 8,
        span: 16,
      },
    };
    const validateMessages = {
      required: '${label} is required!',
      types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
      },
      number: {
        range: '${label} must be between ${min} and ${max}',
      },
    };
    const { isModalVisible, modalTitle, handleOk, handleCancel } = this.props;

    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    const dummyUploadRequest = ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    };
    const onFinish = values => {

      if (this.state.file) {
        values.image = this.state.file;
      } else {
        delete values.image;
      }
      this.setState({
        loading: false,
        imageUrl: null,
        file: null
      });
      this.formRef.resetFields();
      if (this.props.detail) {
        values._id = this.props.detail._id;
      }
      this.props.handleOk(this.props.detail ? true : false, values);
    };

   

    return (
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onOk={() => this.handleOkpress()}
        onCancel={() => this.handleCancelPress()} >

        <Form {...layout} ref={(formRef) => this.formRef = formRef} name="nest-messages"
          onFinish={onFinish} validateMessages={validateMessages}>
          <Form.Item name={'title'} label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={'description'} label="URL">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="banner_size" label="Banner Size" rules={[{ required: true }]}>
            <Select placeholder="Select a option" allowClear onChange={(info) => this.handelSuggestion(info)}>
              <Option value="Large">Large</Option> 
              <Option value="Small">Small</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout} name="isActive" valuePropName="checked" rules={[{ required: true }]}>
            <Checkbox>isActive</Checkbox>
          </Form.Item>
          <div className="ant-col">
            <label className="ant-form-item-required"> <span style={{color:"red"}}>* </span>Banner Image </label>
            <span className="banner_sugg" >{this.state.suggestion}</span>
          </div>
         
          <Form.Item name="image" wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Upload
              customRequest={dummyUploadRequest}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={(file) => beforeUpload(file)}
              onChange={(info) => this.handleChange(info)}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>);
  }
}


export default AddEdit;