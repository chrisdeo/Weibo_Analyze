import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios';
export default class Gender extends PureComponent {
  constructor(props) {
    super(props);
    // this.data = [];
    this.state = {
      data: {
        male: 0,
        female: 0,
      },
    };
  }
  componentWillMount() {
    this.getGenderCount();
  }
  getGenderCount = async () => {
    const male = await axios.get('/getMaleCount');
    const female = await axios.get('/getFemaleCount');
    this.setState({
      data: {
        male: male.data,
        female: female.data,
      }
    })
  }
  getOption = () => {
    return {
      title: {
        text: '微博用户男女比例'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: '10px',
        y: '45px',
        data: ['男性', '女性']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '微博用户性别',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: this.state.data.male, name: '男性' },
            { value: this.state.data.female, name: '女性' },
          ]
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
    );
  }
}
