import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
require('echarts/map/js/china.js');
export default class Region extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: {},
            option: {},
        };
    }
    componentDidMount() {
        this.getRegion().then(()=>{
            this.setState({option: this.getOption()})
        });
    }

    getRegion = async () => {
        const res = await axios.get('/getRegion');
        let region = {
            hebei: 0,
            shandong: 0,
            liaoning: 0,
            heilongjiang: 0,
            jilin: 0,
            gansu: 0,
            qinghai: 0,
            henan: 0,
            jiangsu: 0,
            hubei: 0,
            hunan: 0,
            jiangxi: 0,
            zhejiang: 0,
            guangdong: 0,
            yunnan: 0,
            fujian: 0,
            taiwan: 0,
            hainan: 0,
            shanxi: 0,
            sichuan: 0,
            _shanxi: 0,
            guizhou: 0,
            anhui: 0,
            chongqing: 0,
            beijing: 0,
            shanghai: 0,
            tianjin: 0,
            guangxi: 0,
            neimenggu: 0,
            xizang: 0,
            xinjiang: 0,
            ningxia: 0,
            aomen: 0,
            xianggang: 0,
            haiwai: 0,
            qita: 0,
            count: 0,
        };
        res.data.forEach((x) => {
            if (/海外/.test(x.Region.split(" ")[0]))
                region.haiwai++;
            else if (/其他/.test(x.Region.split(" ")[0]))
                region.qita++;
            else if (/河北/.test(x.Region.split(" ")[0]))
                region.hebei++;
            else if (/山东/.test(x.Region.split(" ")[0]))
                region.shandong++;
            else if (/辽宁/.test(x.Region.split(" ")[0]))
                region.liaoning++;
            else if (/黑龙江/.test(x.Region.split(" ")[0]))
                region.heilongjiang++;
            else if (/吉林/.test(x.Region.split(" ")[0]))
                region.jilin++;
            else if (/甘肃/.test(x.Region.split(" ")[0]))
                region.gansu++;
            else if (/青海/.test(x.Region.split(" ")[0]))
                region.qinghai++;
            else if (/河南/.test(x.Region.split(" ")[0]))
                region.henan++;
            else if (/江苏/.test(x.Region.split(" ")[0]))
                region.jiangsu++;
            else if (/湖北/.test(x.Region.split(" ")[0]))
                region.hubei++;
            else if (/湖南/.test(x.Region.split(" ")[0]))
                region.hunan++;
            else if (/江西/.test(x.Region.split(" ")[0]))
                region.jiangxi++;
            else if (/浙江/.test(x.Region.split(" ")[0]))
                region.zhejiang++;
            else if (/广东/.test(x.Region.split(" ")[0]))
                region.guangdong++;
            else if (/云南/.test(x.Region.split(" ")[0]))
                region.yunnan++;
            else if (/福建/.test(x.Region.split(" ")[0]))
                region.fujian++;
            else if (/台湾/.test(x.Region.split(" ")[0]))
                region.taiwan++;
            else if (/海南/.test(x.Region.split(" ")[0]))
                region.hainan++;
            else if (/山西/.test(x.Region.split(" ")[0]))
                region.shanxi++;
            else if (/四川/.test(x.Region.split(" ")[0]))
                region.sichuan++;
            else if (/陕西/.test(x.Region.split(" ")[0]))
                region._shanxi++;
            else if (/贵州/.test(x.Region.split(" ")[0]))
                region.guizhou++;
            else if (/安徽/.test(x.Region.split(" ")[0]))
                region.anhui++;
            else if (/重庆/.test(x.Region.split(" ")[0]))
                region.chongqing++;
            else if (/北京/.test(x.Region.split(" ")[0]))
                region.beijing++;
            else if (/上海/.test(x.Region.split(" ")[0]))
                region.shanghai++;
            else if (/天津/.test(x.Region.split(" ")[0]))
                region.tianjin++;
            else if (/广西/.test(x.Region.split(" ")[0]))
                region.guangxi++;
            else if (/内蒙古/.test(x.Region.split(" ")[0]))
                region.neimenggu++;
            else if (/新疆/.test(x.Region.split(" ")[0]))
                region.xinjiang++;
            else if (/西藏/.test(x.Region.split(" ")[0]))
                region.xizang++;
            else if (/宁夏/.test(x.Region.split(" ")[0]))
                region.ningxia++;
            else if (/澳门/.test(x.Region.split(" ")[0]))
                region.aomen++;
            else if (/香港/.test(x.Region.split(" ")[0]))
                region.xianggang++;
        });

        Object.entries(region).forEach((x)=>{
            if(x[1]>=region.count)
                region.count = x[1];
        });

        this.setState({
            data: region,
        })
    }

    getOption =  () => {
        let max =  this.state.data.count;
        return  {
            title: {
                text: '微博用户地域分布',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data:['微博使用人群']
            },
            visualMap: {
                min: 0,
                max: max,
                left: 'left',
                top: 'bottom',
                text: ['高','低'],           // 文本，默认为数值文本
                calculable: true
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [
                {
                    name: '微博使用人群',
                    type: 'map',
                    mapType: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data:[
                        {name: '北京',value: this.state.data.beijing },
                        {name: '天津',value: this.state.data.tianjin },
                        {name: '上海',value: this.state.data.shanghai },
                        {name: '重庆',value: this.state.data.chongqing },
                        {name: '河北',value: this.state.data.hebei },
                        {name: '河南',value: this.state.data.henan },
                        {name: '云南',value: this.state.data.yunnan },
                        {name: '辽宁',value: this.state.data.liaoning },
                        {name: '黑龙江',value: this.state.data.heilongjiang },
                        {name: '湖南',value: this.state.data.hunan },
                        {name: '安徽',value: this.state.data.anhui },
                        {name: '山东',value: this.state.data.shandong },
                        {name: '新疆',value: this.state.data.xinjiang },
                        {name: '江苏',value: this.state.data.jiangsu },
                        {name: '浙江',value: this.state.data.zhejiang },
                        {name: '江西',value: this.state.data.jiangxi },
                        {name: '湖北',value: this.state.data.hubei },
                        {name: '广西',value: this.state.data.guangxi },
                        {name: '甘肃',value: this.state.data.gansu },
                        {name: '山西',value: this.state.data.shanxi },
                        {name: '内蒙古',value: this.state.data.neimenggu },
                        {name: '陕西',value: this.state.data._shanxi },
                        {name: '吉林',value: this.state.data.jilin },
                        {name: '福建',value: this.state.data.fujian },
                        {name: '贵州',value: this.state.data.guizhou },
                        {name: '广东',value: this.state.data.guangdong },
                        {name: '青海',value: this.state.data.qinghai },
                        {name: '西藏',value: this.state.data.xizang },
                        {name: '四川',value: this.state.data.sichuan },
                        {name: '宁夏',value: this.state.data.ningxia },
                        {name: '海南',value: this.state.data.hainan },
                        {name: '台湾',value: this.state.data.taiwan },
                        {name: '香港',value: this.state.data.xianggang },
                        {name: '澳门',value: this.state.data.aomen }
                    ]
                },
            ]        
        }
    };

    render() {
        return (
            <div>
                <ReactEcharts theme="dark"
                    option={this.state.option}
                    style={{ height: '500px', width: '90%' }}
                    className='react_for_echarts' />
            </div>
        );
    }
}
