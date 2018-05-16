import React, { PureComponent } from 'react';
import { Table } from 'antd';
import axios from 'axios';
export default class PersonalTag extends PureComponent {
    constructor(props){
        super(props);
        // this.data = [];
        this.state = {
            data: [],
            loading: true,
        };
        this.columns = [{
            title: '用户名称',
            dataIndex: 'nickname',
            key: 'nickname',
        }, {
            title: '官方标签',
            dataIndex: 'label',
            key: 'label',
        }, {
            title: '认证信息',
            dataIndex: 'auth',
            key: 'auth',
        },{
            title: '个人简介',
            dataIndex: 'brief',
            key: 'brief',
        },{
            title: '生成标签',
            dataIndex: 'sign',
            key: 'sign',            
        }];
    }
    componentWillMount(){
        this.getPersonalTag();
    }
    getPersonalTag = async () => {
        const res = await axios.get('/getPersonalTag');
        this.setState({
            data: res.data,
            loading: false,
        })
    }
    render() {       
        return (
             <Table loading={this.state.loading} columns={this.columns}  dataSource={this.state.data} />
        )
    }
}