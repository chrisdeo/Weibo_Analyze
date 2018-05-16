import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
export default class Label extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: {},
        };
    }
    componentWillMount() {
        this.getLabel();
    }
    getLabel = async () => {
        const res = await axios.get('/getLabel');
        let resolvedData = res.data.filter((x) => {
            return x.Label;
        });
        resolvedData = resolvedData.map((x) => {
            return x.Label.split(',').join('');
        })
        let pattern = [/(电影)|(演员)|(影迷)|(剧)|(明星)/,
            /(动漫)|(漫画)|(海贼王)|(火影)|(死神)|(新番)|(番剧)|(绘画)|(同人)|(二次元)|(党)|(饭)/,
            /(IT数码)|(摄影)|(拍照)|(旅拍)|(美图)/,
            /(妆)|(穿衣)|(生活)|(养生)|(护肤)|(美容)|(造型)|(情感)|(服饰)|(搭配)|(星座)|(座)|(潮)|(搞笑)|(幽默)|(段子手)|(两性)|(旅游)|(户外)/,
            /(音乐)|(演唱会)|(听歌)/,
            /(八卦)|(杂谈)|(新闻)|(资讯)|(互联网)|(媒体)|(工作室)/,
            /(美食)|(吃)|(菜)/];
        let labelObj = {
            movie: 0,
            anime: 0,
            photography: 0,
            life: 0,
            music: 0,
            information: 0,
            food: 0,
            count: 0,
        };

        resolvedData.forEach((x) => {
            if (pattern[0].test(x))
                labelObj.movie++;
            else if (pattern[1].test(x))
                labelObj.anime++;
            else if (pattern[2].test(x))
                labelObj.photography++;
            else if (pattern[3].test(x))
                labelObj.life++;
            else if (pattern[4].test(x))
                labelObj.music++;
            else if (pattern[5].test(x))
                labelObj.information++;
            else if (pattern[6].test(x))
                labelObj.food++;
        })

        Object.entries(labelObj).forEach((x)=>{
            if(x[1]>=labelObj.count)
            labelObj.count = x[1];
        });

        this.setState({
            data: labelObj,
        })
    }
    getOption = () => {
        let max = this.state.data.count;
        return {
            title: {
                text: '微博用户偏好'
            },
            tooltip: {},
            legend: {
                orient: 'vertical',
                x: '10px',
                y: '45px',
                data: ['数据显示']
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 6,
                        padding: [3, 5]
                    }
                },
                indicator: [
                    { name: '影视', max: max },
                    { name: '二次元', max: max },
                    { name: '摄影', max: max },
                    { name: '生活', max: max },
                    { name: '音乐', max: max },
                    { name: '资讯', max: max },
                    { name: '美食', max: max }
                ]
            },
            series: [{
                name: '偏好标签Radar',
                type: 'radar',
                // areaStyle: {normal: {}},
                data: [
                    {
                        value: [this.state.data.movie,this.state.data.anime,this.state.data.photography,
                                this.state.data.life, this.state.data.music,this.state.data.information,
                                this.state.data.food],
                        name: '数据显示'
                    },
                ]
            }]
        };
    };
    render() {
        return (
            <div>
                <ReactEcharts
                    option={this.getOption()}
                    style={{ height: '350px', width: '100%' }}
                    className='react_for_echarts' />
            </div>
        );
    }
}
