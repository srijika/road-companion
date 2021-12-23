import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import styles from './login.less';

const platformList = ['Web', 'IOS', 'Android']

class AppTest extends PureComponent {
  platformNo = 3;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: [
		{title:'Owner', platform1:'', platform2:''},
		{title:'Platform 1 to consider', platform1:'IOS', platform2:''},
		{title:'Platform 2 to consider', platform1:'', platform2:'Web'},
	  ],
      dataDown: [
		{title:'Value of new portfolio', platform1:'12', platform2:'15'},
		{title:'Risk Profile', platform1:'', platform2:'', hints:'If selecting model Portfolio and Moderate or Balanced, state if G50, G60 or G70 model is to be used.'},
		{title:'Profile type', platform1:'', platform2:''},
	  ],
      loading: false,
	  
	  columns : [
      {
        title: 'Existing platform to be reviewed',
        dataIndex: 'title',
        key: 'title',
		width:'200px',
        render: (text, record) => {
            return (
			 <strong>{text}</strong>
            );
        },
      },
      {
        title: 'Platform 1',
        dataIndex: 'platform1',
        key: 'platform1',
		width:'200px',
        render: (text, record, index) => {
            return (
              <Select defaultValue={text} placeholder="Platform" onChange={e=>this.handleFieldChange(e, 'platform1', index)} style={{width:'100%'}}>
				{platformList.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
			</Select>
            );
        },
      },
      {
        title: 'Platform 2',
        dataIndex: 'platform2',
        key: 'platform2',
		width:'200px',
        render: (text, record, index) => {
            return (
              <Select defaultValue={text} placeholder="Platform" onChange={e=>this.handleFieldChange(e, 'platform2', index)} style={{width:'100%'}}>
				{platformList.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
			</Select>
            );
        },
      },
    ]
    };
  }


  
  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    let keyname = Object.keys(newData[0]);
	let n = {}
	keyname.map(item=> n[item]='')
	newData.push({...n, title: `Platform ${data.length} to consider`});
    this.setState({ data: newData });
  };

  /*remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }*/

  /*handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }*/

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }
  
  handleFieldChange(e, key, index) {
	//console.log(e, key, index)
    const { data } = this.state;
    let newData = data.map(item => ({ ...item }));
	newData[index][key] = e;
	this.setState({ data: newData });
	//console.log(newData[index][key], newData)
  }
  handleField(e, key, index) {
	//console.log(e, key, index)
    const { dataDown } = this.state;
    let newData = dataDown.map(item => ({ ...item }));
	newData[index][key] = e;
	this.setState({ dataDown: newData });
	//console.log(newData[index][key], newData)
  }

  handleAddColumn = () => {
    const { columns,data } = this.state;	
	let PlatIndex = this.platformNo
    const newColumn = {title: `Platform${PlatIndex}`, dataIndex: 'age', width:'200px', render: (text, record, index) => {
            return (
              <Select defaultValue={text} placeholder="Platform" onChange={e=>this.handleFieldChange(e, 	`Platform${PlatIndex}`, index)} style={{width:'100%'}}>
				{platformList.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
			</Select>
            );
        },};
    const newData = data.map(item => ({ ...item }));
	newData.map(item => item[`Platform${this.platformNo}`]='')
	this.setState({ columns: [...columns, newColumn], data: [...newData]})
	this.platformNo +=1;
  }
  
	Submit=()=>{
	  const { dataDown, data } = this.state;
	  let values = { platform: data, portfolio : dataDown}
	  console.log(values)
	}
  
  render() {
    const { loading, data } = this.state;

    return (
      <Fragment>
	  <Row>
		<Col span={22} >
        <Table
			tableLayout={'fixed'}
			className={'responsiveTable'}
			rowKey={record => record.title}
          loading={loading}
          columns={this.state.columns}
          dataSource={data}
          pagination={false}
          //rowClassName={styles.responsiveTable}
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
								{no === 0 ? <><strong>{item.title}</strong><br/>
									<span style={{color:'#ccc'}}>{item.hints}</span></>
								:<Input value={item[val.key]} onChange={e=>this.handleField(e.target.value, val.key, index)}/>
								}
							</Table.Summary.Cell>
						  )}
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
		<p></p>
		<Button style={{ width: '200',marginTop: 0, marginBottom: 0 }}
				type="primary" onClick={this.Submit} >
				Submit
			</Button>
      </Fragment>
    );
  }
}

export default connect(({auth, loading}) => ({
	auth, loading
}))(AppTest);