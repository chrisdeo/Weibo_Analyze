import React,{Component} from 'react';
import { Row, Col } from 'antd';
import weibologo from '../assets/weibo.jpg';
import reactlogo from '../assets/react.jpg';
import scrapylogo from '../assets/scrapy.jpg';
import antdlogo from '../assets/antd.png';
export default class HomePage extends Component {
 render(){
     return (
        <div>
            <div style={{ fontSize: '50px', color: 'black', textAlign: 'center'}}>
            基于新浪微博数据爬取的用户行为分析
            </div>
            <div style={{marginTop: '250px'}}>
            <Row type="flex" justify="space-between">
            <Col span={6}><img style={{height: '100%', width: '100%'}} src={weibologo} alt="图片加载失败"/></Col>
            <Col span={6}><img style={{height: '100%', width: '100%'}} src={reactlogo} alt="图片加载失败"/></Col>
            <Col span={6}><img style={{height: '100%', width: '100%'}} src={antdlogo} alt="图片加载失败"/></Col>
            <Col span={6}><img style={{height: '100%', width: '100%'}} src={scrapylogo} alt="图片加载失败"/></Col>
            </Row>
            </div>      
        </div>
     );
 }
}

