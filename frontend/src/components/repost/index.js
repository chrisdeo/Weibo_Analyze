import React, { PureComponent } from 'react';
import { Table, Button, Modal, Upload, Icon, message } from 'antd';
import axios from 'axios';
import io from 'socket.io-client';
export default class Analysis extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: [],
        };
        this.columns = [{
            title: '序号',
            key: 'index',
            render: (text, record, index) => <span>{index + 1}</span>
        }, {
            title: '转发微博',
            dataIndex: 'OriginalBlogTitle',
            key: 'OriginalBlogTitle',
        },
        {
            title: '微博发出源',
            dataIndex: 'Repost_Nickname',
            key: 'Repost_Nickname',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                            <span>
                                    <a href="javascript:void(0)" onClick={this.repostLink.bind(this,record.collection,record.Repost_Nickname)}>转发链路模型生成</a>
                                    <span>&ensp; | &ensp;</span>
                                    <a href="javascript:void(0)" onClick={this.userLink.bind(this,record.collection,record.Repost_Nickname)}>转发用户链路可视化</a>
                            </span>
            )
        }]
    }
    componentWillMount() {
        this.getRepostList();
    }

    getRepostList = async () => {
        const res = await axios.get('/getRepostList');
        this.setState({
            data: res.data,
        })
    }

    repostLink = (collection,nickname) => {
        axios.get('/repostLink', {
            params: {
                collection: collection,
                nickname: nickname,
                flag: 'False',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    userLink = (collection,nickname) => {
        axios.get('/repostLink', {
            params: {
                collection: collection,
                nickname: nickname,
                flag: 'True',
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    render() {
        return (
            <div>
                <Table columns={this.columns} dataSource={this.state.data} />
            </div>
        )
    }
}