import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import styles from './login.less';

class AppTest extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: [
		{name:'Owner', workId:'', department:''},
		{name:'Platform 1 to consider', workId:'', department:''},
		{name:'Platform 2 to consider', workId:'', department:''},
	  ],
      dataDown: [
		{name:'Value of new portfolio', workId:'', department:''},
		{name:'Risk Profile', workId:'', department:'', hints:'If selecting model Portfolio and Moderate or Balanced, state if G50, G60 or G70 model is to be used.'},
		{name:'Profile type', workId:'', department:''},
	  ],
      loading: false,
	  columns : [
      {
        title: 'Existing platform to be reviewed',
        dataIndex: 'name',
        key: 'name',
		width:'20%',
        render: (text, record) => {
          //if (record.editable) {
            return (
			 <strong>{text}</strong>
            );
          //}
          //return text;
        },
      },
      {
        title: 'Platform 1',
        dataIndex: 'workId',
        key: 'workId',
        render: (text, record) => {
          //if (record.editable) {
            return (
              <Select placeholder="Platform" onChange={()=>console.log()} style={{width:'100%'}}>
				{[].map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
			</Select>
            );
          //}
          //return text;
        },
      },
      {
        title: 'Platform 2',
        dataIndex: 'department',
        key: 'department',
        render: (text, record) => {
         // if (record.editable) {
            return (
              <Select placeholder="Platform" onChange={()=>console.log()} style={{width:'100%'}}>
				{[].map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
			</Select>
            );
          //}
          //return text;
        },
      },
    ]
    };
  }


  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
	this.index = data.length;
    newData.push({
	  key: `key_${data.length}`,
      workId: '',
      name: `Platform ${data.length} to consider`,
      department: '',
      editable: true,
      isNew: true,
    });
    
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.workId || !target.name || !target.department) {
        message.error('error');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      const { data } = this.state;
      //const { onChange } = this.props;
      delete target.isNew;
      this.toggleEditable(e, key);
      console.log(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  handleAddColumn = () => {
    const { columns } = this.state;
    const newColumn = {title: 'Platform', dataIndex: 'age', render: (text, record) => {
            return (
              <Select placeholder="Platform" onChange={()=>console.log()} style={{width:'100%'}}>
				{[].map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
			</Select>
            );
        },};

    this.setState({ columns: [...columns, newColumn] })
  }
  
  render() {
    const { loading, data } = this.state;

    return (
      <Fragment>
	  <Row>
		<Col span={22}>
        <Table
          loading={loading}
          columns={this.state.columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
		  summary={pageData => {
				let columns = this.state.columns;
				return (
				  <>
				  <Table.Summary.Row>
					  <Table.Summary.Cell colSpan={this.state.columns.length}>
						<Button style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
							  type="dashed" onClick={this.newMember} >
							  Add Platform to consider
							</Button>
					  </Table.Summary.Cell>
					</Table.Summary.Row>
					{this.state.dataDown.map((item,index)=>{
					  return <Table.Summary.Row key={index}>
						  {columns.map((val,no)=>
							<Table.Summary.Cell key={no}>
								{no === 0 ? <><strong>{item.name}</strong><br/>
									<span style={{color:'#ccc'}}>{item.hints}</span></>
								:<Input value={item.workId} />
								}
							</Table.Summary.Cell>
						  )}
						  {/*<Table.Summary.Cell >
							<strong>{item.name}</strong><br/>
							<span style={{color:'#ccc'}}>{item.hints}</span>
						  </Table.Summary.Cell>
						  <Table.Summary.Cell >
							<Input value={item.workId} />
						  </Table.Summary.Cell>
						  <Table.Summary.Cell >
							<Input value={item.department} />
						  </Table.Summary.Cell>*/}
						</Table.Summary.Row>
				  })}
				  </>
				);
			}}
        />
        </Col>
		<Col span={2}>
			<Button style={{ width: '100%',height:'100%', marginTop: 0, marginBottom: 0 }}
				type="dashed" onClick={this.handleAddColumn} >
				Add
			</Button>
		</Col>
		</Row>
      </Fragment>
    );
  }
}

export default connect(({auth, loading}) => ({
	auth, loading
}))(AppTest);