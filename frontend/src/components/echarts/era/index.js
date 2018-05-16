import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
export default class PersonalInform extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: [],
        };
    }
    componentWillMount() {
        this.getPersonalBirthday();
    }
    getPersonalBirthday = async () => {
        const res = await axios.get('/getPersonalBirthday');
        let pattern = /(1|2)\d{3}?/;
        // 清洗无效数据，未填写或者爬取结果为星座的不参与分析
        let resolvedData = res.data.filter((x) => {
            return (x.Birthday && pattern.test(x.Birthday))
        });
        let eraObj = {
            sixties: 0,
            seventies: 0,
            eighties: 0,
            ninties: 0,
            zeroties: 0,
        }
        resolvedData.forEach((x) => {
            let birthday = pattern.exec(x.Birthday)[0];
            if (birthday >= 1960 && birthday <= 1969)
                eraObj.sixties++;
            else if (birthday >= 1970 && birthday <= 1979)
                eraObj.seventies++;
            else if (birthday >= 1980 && birthday <= 1989)
                eraObj.eighties++;
            else if (birthday >= 1990 && birthday <= 1999)
                eraObj.ninties++;
            else if (birthday >= 2000)
                eraObj.zeroties++;
        })
        let eraArr = [];
        for (var x in eraObj)
            eraArr.push(eraObj[x]);
        this.setState({
            data: eraArr,
        })
    }
    getOption = () => {
        return {
            title: {
                text: '微博用户年代划分'
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['60后', '70后', '80后', '90后', '00后'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            series: [
                {
                    name: '年代人数',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.state.data,
                }
            ]
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
        )
    }
}