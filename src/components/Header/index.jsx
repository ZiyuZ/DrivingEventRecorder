import React, { Component } from "react";
import Pages from "../../config/pagesMetaInfo";
import { Menu, Layout, Icon } from "antd";
import { NavLink } from "react-router-dom";
import logo from "../../static/logo.svg";
import "./index.less"

export default class Header extends Component {

  state = {}

  componentDidMount = () => {
    const menu = this.renderMenu(Pages);
    this.setState({ menu });
  };

  renderMenu = data => {
    return data.map(item => {
      return (
        <Menu.Item key={item.id}>
          <NavLink to={item.pageUrl}>
            <Icon type={item.icon} />
            <span>{item.pageTitle}</span>
          </NavLink>
        </Menu.Item>
      );
    });
  };

  render() {
    const { Header } = Layout;
    return (
      <Header>
        <div className="logo">
          <img src={logo} alt="logo" />
          <span>事件记录器</span>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          className="menu"
          defaultSelectedKeys={["0"]}
        >
          {this.state.menu}
        </Menu>
      </Header>
    );
  }
}
