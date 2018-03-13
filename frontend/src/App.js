import React, { Component } from 'react';
import {Link} from 'react-router';
import { Layout, Menu, Icon } from 'antd';
import HomePage from './page/HomePage';
import RouterConfig from './routes';
const { Header, Content, Footer, Sider } = Layout;
class App extends Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  render() {
    const {children} = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="desktop" />
              <span>首页</span>
              <Link to='/'>Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="pie-chart" />
              <span>图表</span>
              <Link to='/charts'>Charts</Link>
            </Menu.Item>
            {/* <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>User</span></span>}
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span>Team</span></span>}
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu> */}
            <Menu.Item key="9">
              <Icon type="table" />
              <span>表单</span>
              <Link to='/table'></Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
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