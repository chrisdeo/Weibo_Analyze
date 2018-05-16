import React, { PureComponent } from 'react';
import { Table } from 'antd';
import axios from 'axios';
export default class PersonalInform extends PureComponent {
    constructor(props){
        super(props);
        // this.data = [];
        this.state = {
            data: [],
            loading: true,
        };
        this.columns = [{
            title: '用户名称',
            dataIndex: 'Nickname',
            key: 'Nickname',
        }, {
            title: '性别',
            dataIndex: 'Gender',
            key: 'Gender',
        }, {
            title: '生日',
            dataIndex: 'Birthday',
            key: 'Birthday',
        },{
            title: '地区',
            dataIndex: 'Region',
            key: 'Region',
        },{
            title: '认证身份',
            dataIndex: 'Authentication',
            key: 'Authentication',
        },{
            title: '简介',
            dataIndex: 'BriefIntroduction',
            key: 'BriefIntroduction',            
        },{
            title: '偏好',
            dataIndex: 'Label',
            key: 'Label',
        },{
            title: '微博数量',
            dataIndex: 'Number_Blog',
            key: 'Number_Blog',  
            sorter: (a,b)=>a.Number_Blog-b.Number_Blog,       
        },{
            title: '粉丝数量',
            dataIndex: 'Number_Fans',
            key: 'Number_Fans',     
            sorter: (a,b)=>a.Number_Fans-b.Number_Fans,            
        },{
            title: '关注人数',
            dataIndex: 'Number_Follow',
            key: 'Number_Follow',       
            sorter: (a,b)=>a.Number_Follow-b.Number_Follow,       
        }];
    }
    componentWillMount(){
        this.getPersonalList();
    }
    getPersonalList = async () => {
        const res = await axios.get('/getPersonalInformation');
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