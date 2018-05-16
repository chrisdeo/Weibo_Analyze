import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Row, Col } from 'antd';
import axios from 'axios';

export default class PersonalInform extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            op1: {
                rep: 0,
                unrep: 0,
            },
            op2: {
                com: 0,
                uncom: 0,
            },
            op3: {
                repcom: 0,
                unrepcom: 0,
            }
        };
    }
    componentWillMount() {
        this.getRepostCommentNum();
    }
    getRepostCommentNum = async () =>{
        const res = await axios.get('/getRepostCommentNum');
        this.setState({
            op1: {
                rep: res.data[0],
                unrep: res.data[2]-res.data[0],
            },
            op2: {
                com: res.data[1],
                uncom: res.data[2]-res.data[1],
            },
            op3: {
                repcom: res.data[3],
                unrepcom: res.data[2]-res.data[3],
            }
        })
    }

    getRepOption = () => {
        return {
            title : {
                text: '博文转发占比统计',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: '10px',
                y: '45px',
                data: ['转发博文','非转发博文'],
            },
            series : [
                {
                    name: '微博转发占比情况',
                    type: 'pie',
                    radius : '55%',
                    data: [{
                        value: this.state.op1.rep, name: '转发博文'
                    },{
                        value: this.state.op1.unrep, name: '非转发博文'
                    }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            color : ['#9B30FF','#FFC125']
        }
    }

    getComOption = () => {
        return {
            title : {
                text: '博文评论占比统计',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: '10px',
                y: '45px',
                data: ['评论博文','未评论博文'],
            },
            series : [
                {
                    name: '微博评论占比情况',
                    type: 'pie',
                    radius : '55%',
                    data: [{
                        value: this.state.op2.com, name: '评论博文'
                    },{
                        value: this.state.op2.uncom, name: '未评论博文'
                    }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            color: ['#CD6889','#CD8162']
        }
    }

    getRepComOption = () => {
        return {
            title : {
                text: '博文评论转发占比统计',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: '10px',
                y: '45px',
                data: ['被评论和转发博文','未评论及转发博文'],
            },
            series : [
                {
                    name: '微博评论转发占比情况',
                    type: 'pie',
                    radius : '55%',
                    data: [{
                        value: this.state.op3.repcom, name: '被评论和转发博文'
                    },{
                        value: this.state.op3.unrepcom, name: '未评论及转发博文'
                    }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            color: ['#8B5F65','#54FF9F']
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={8}>
                        <ReactEcharts
                            option={this.getRepOption()}
                            style={{ height: '350px', width: '100%' }}
                            className='react_for_echarts' />
                    </Col>
                    <Col span={8}>
                        <ReactEcharts
                            option={this.getComOption()}
                            style={{ height: '350px', width: '100%' }}
                            className='react_for_echarts' />
                    </Col>
                    <Col span={8}>
                        <ReactEcharts
                            option={this.getRepComOption()}
                            style={{ height: '350px', width: '100%' }}
                            className='react_for_echarts' />
                    </Col>                      
                </Row>
            </div>
        )
    }
}