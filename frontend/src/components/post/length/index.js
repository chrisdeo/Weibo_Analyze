import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
export default class Length extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: [],
        };
    }
    componentWillMount(){
        this.getPostContent();
    }
    getPostContent = async () => {
        const res = await axios.get('./getPostContent');
        this.setState({
            data: res.data,
        })
    }
    getOption = () => {
        return {
            title: {
                text: '用户发博长度统计'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                name: '单位/字',
                data: ['0-20', '20-40', '40-60', '60-80', '80-100', '100-120', '120-140']
            },
            yAxis: {
                type: 'value',
                name: '单位/篇'
            },
            series: [{
                data: this.state.data,
                type: 'bar',
                color: '#00C5CD',
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