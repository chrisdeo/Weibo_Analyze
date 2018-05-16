import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import Length from './length';
import Ratio from './ratio';
import Time from './time';
import Total from './total';
import { Row, Col } from 'antd';

export default class postCharts extends PureComponent {
    render() {
        let styleObj = {marginTop:64}
        return (
            <div>
                <Row>
                    <Col span={9}><Length /></Col>
                    <Col span={15}><Time /></Col>                    
                </Row>
                <Row style={styleObj}>
                    <Col span={21}><Ratio /></Col>
                </Row>
                <Row style={styleObj}>
                    <Col span={12}><Total /></Col>
                </Row>
            </div>
        );
    }
}
