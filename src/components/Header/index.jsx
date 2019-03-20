import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Pages from "../../config/pagesMetaInfo";
import { Menu, Layout, Icon } from "antd";
import { NavLink } from "react-router-dom";
import logo from "../../static/logo.svg";
import "./index.less";

@inject("store")
@observer
export default class Header extends Component {
  state = {};

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
    const { selectedPageId, changeSelectedPageId } = this.props.store.GlobalStore;
    return (
      <Header>
        <div className="logo">
          <img src={logo} alt="logo" />
          <span>事件记录器</span>
        </div>
        <Menu
          selectedKeys={selectedPageId}
          theme="dark"
          mode="horizontal"
          className="menu"
          onClick={e => changeSelectedPageId(e.key)}
        >
          {this.state.menu}
        </Menu>
      </Header>
    );
  }
}
