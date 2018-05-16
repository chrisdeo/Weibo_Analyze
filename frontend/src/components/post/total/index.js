import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
export default class Total extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: [],
        };
    }
    componentWillMount(){
        this.getBlogNum();
    }
    getBlogNum = async () => {
        const res = await axios.get('./getBlogNum');
        this.setState({
            data: res.data,
        })
    }
    getOption = () => {
        return {
            title: {
                text: '用户发博数量分布'
            },
            xAxis: {
                scale: true,
                name: '发博数量(lg)'
            },
            yAxis: {
                scale: true,
                name: '用户人数(lg)'
            },
            series: [{
                data: this.state.data,
                type: 'scatter',
            }]
        }
    }
    render() {
        return (
            <div>
                <ReactEcharts
                    option={this.getOption()}
                    style={{ height: '350px', width: '100%' }}
                    className='react_for_echarts' />
            </div>
        )
    }
}