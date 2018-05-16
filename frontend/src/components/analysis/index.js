import React, { PureComponent } from 'react';
import { Table, Button, Modal, Upload, Icon, message } from 'antd';
import axios from 'axios';
import io from 'socket.io-client';
import { setInterval } from 'timers';
export default class Analysis extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: [],
            pic: '',
            id: '',
            visibility: true,
        };
        this.columns = [{
            title: '序号',
            key: 'index',
            render: (text, record, index) => <span>{index + 1}</span>
        }, {
            title: '热搜话题',
            dataIndex: 'topic_name',
            key: 'topic_name',
        },
        {
            title: '微博id',
            dataIndex: 'topic_id',
            key: 'topic_id',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <span>
                    {
                        record.status == 0 ?
                            <span>
                                {
                                    this.state.visibility == true ? 
                                    <a href="javascript:void(0)" onClick={this.spiderForComment.bind(this, record.topic_id)}>热搜评论抓取</a>
                                    : <span>评论抓取中...</span>
                                }
                            </span>

                            :
                            <span>
                                <a href="javascript:void(0)" onClick={this.nlpAnalyze.bind(this, record.topic_id)}>NLP情感分析</a>
                                <span>&ensp; | &ensp;</span>
                                <a href="javascript:void(0)" onClick={this.showModal.bind(this,record.topic_id)}>词云生成</a>
                            </span>
                    }

                </span>
            )
        }]
    }
    componentWillMount() {
        this.getTopicUrl();
    }
    // socketConn(){
    //     const socket = io('http://localhost:3007')
    //     socket.on('spider',(res)=>{
    //         console.log(res);
    //         socket.emit('please start spider',{my:'data'})
    //     })
    // }
    getTopicUrl = async () => {
        const res = await axios.get('/getTopicUrl');
        this.setState({
            data: res.data,
        })
    }
    spiderForTopic = () => {
        axios.get('/spiderForTopic');
    }

    getStatus = async (id) =>{
        const res = await axios.get('/getStatus',{
            params:{
                id: id
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        this.setState({
            visibility: res.data[0].status==0,
        })
    }

    spiderForComment = (id) => {
        axios.get('/spiderForComment', {
            params: {
                id: id
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        // let timer = setInterval(this.getTopicUrl(id),10000);
    }

    nlpAnalyze = (id) => {
        axios.get('/nlpAnalyze', {
            params: {
                id: id
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    generateWordCloud = (pic) => {
        axios.get('/generateWordCloud', {
            params: {
                id:this.state.id,
                pic:pic,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }

    showModal = (id) => {
        this.setState({
            visible: true,
            id: id,
        })
    }

    handleOk = (event) => {
        console.log(event.target.file);
        this.setState({
            visible: false,
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }
    
    handleChange = (info) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功。`);
            this.generateWordCloud(info.file.name);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败。`);
        }
    }

    render() {
        const Dragger = Upload.Dragger;
        const props = {
            multiple: false,
            action: 'http://localhost:3007/upload',
            headers: {
                authorization: 'authorization-text',
            },
            onChange: this.handleChange,
            beforeUpload(file) {
                const limitType = ['image/jpeg', 'image/png', 'image/jpg'];
                const type = file.type;
                let isImage = false;
                for (var item of limitType) {
                    if (item == type) {
                        isImage = true;
                        break;
                    }
                }
                if (!isImage) {
                    message.error('请上传图片格式文件');
                }
                return isImage;
            },
        };
        return (
            <div>
                <Button style={{ marginTop: 10, marginBottom: 10 }} onClick={this.spiderForTopic} type="primary" icon="down-square">Top热搜榜单获取</Button>
                <Button style={{ marginLeft: 25, marginTop: 10, marginBottom: 10 }} onClick={this.getTopicUrl} type="primary" icon="bars">Top热搜榜单显示</Button>
                <Table columns={this.columns} dataSource={this.state.data} />
                <Modal ref="modal"
                    visible={this.state.visible}
                    title="请上传词云背景图" onOk={this.handleOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>返 回</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                            提 交
                    </Button>,
                    ]}
                >
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击或将背景图片拖拽到此区域上传</p>
                    </Dragger>
                </Modal>
            </div>
        )
    }
}