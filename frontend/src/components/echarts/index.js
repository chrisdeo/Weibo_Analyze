import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import Gender from './gender';
import Era from './era';
import Region from './region';
import Label from './label';
import { Row, Col } from 'antd';

export default class Charts extends PureComponent {
  render() {
    return (
      <div>
        <Row>
          <Col span={8}><Gender /></Col>
          <Col span={8}><Era /></Col>
          <Col span={8}><Label /></Col>
        </Row>
        <Row style={{marginTop: '30px'}}>
          <Col span={24}><Region /></Col>          
        </Row>
      </div>
    );
  }
}
