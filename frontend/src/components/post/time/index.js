import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';

export default class Time extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: [],
        };
    }
    componentWillMount(){
        this.getTimePost();
    }
    getTimePost = async () => {
        const res = await axios.get('./getTimePost');
        this.setState({
            data: res.data,
        })       
    }
    getOption = () => {
        return {
            title: {
                text: '用户发博时段统计'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                name: '单位/时段',
                data: ['24-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7','7-8','8-9','9-10',
                '10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21',
                '21-22','22-23','23-24']
            },
            yAxis: {
                type: 'value',
                name: '单位/篇数',
            },
            series: [{
                data: this.state.data,
                type: 'bar',
                color: '#CD0000',
            },{
                data: this.state.data,
                type: 'line',
                color: '#3A5FCD',                
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