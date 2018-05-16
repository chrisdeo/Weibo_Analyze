import React, { Component } from 'react';
import { Link } from 'react-router';
import { Layout, Menu, Icon } from 'antd';
import HomePage from './page/HomePage';
import RouterConfig from './routes';
const { Header, Content, Footer, Sider } = Layout;
class App extends Component {
  state = {
    collapsed: false,
    selectedKeys: [],
  };
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  onClick = (item) => {
    this.setState({
      selectedKeys: [item.key],
    })
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (this.props.router.location.action === 'PUSH');
  // }
  componentWillMount() {
    // const path = this.props.location.href.substr(this.props.location.href.lastIndexOf('/'));
    // console.log(path);
    const path = this.props.location.pathname;
    this.setState({
      selectedKeys: [path],
    });
  }
  render() {
    const { children } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['/']} mode="inline" selectedKeys={this.state.selectedKeys} onClick={this.onClick}>
            <Menu.Item key="/">
              <Icon type="desktop" />
              <span>首页</span>
              <Link to='/'>Home</Link>
            </Menu.Item>
            <Menu.Item key="/table">
              <Icon type="table" />
              <span>个人信息</span>
              <Link to='/table'></Link>
            </Menu.Item>
            <Menu.Item key="/charts">
              <Icon type="pie-chart" />
              <span>属性统计</span>
              <Link to='/charts'>Charts</Link>
            </Menu.Item>
            <Menu.Item key="/postanalysis">
              <Icon type="laptop" />
              <span>发博统计</span>
              <Link to='/postanalysis'></Link>
            </Menu.Item>
            <Menu.Item key="/compact">
              <Icon type="smile-circle" />
              <span>用户联系</span>
              <Link to='/compact'></Link>
            </Menu.Item>
            <Menu.Item key="/tag">
              <Icon type="tags" />
              <span>生成标签</span>
              <Link to='/tag'></Link>
            </Menu.Item>
            <Menu.Item key="/query">
              <Icon type="search" />
              <span>相似查询</span>
              <Link to='/query'></Link>
            </Menu.Item>
            <Menu.Item key="/analysis">
              <Icon type="appstore" />
              <span>评论分析</span>
              <Link to='/analysis'></Link>
            </Menu.Item>
            <Menu.Item key="/repost">
              <Icon type="arrow-salt" />
              <span>转发链路</span>
              <Link to='/repost'></Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            {children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Weibo Analyze ©2018 Authorized by Leo Chan
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
export default App;