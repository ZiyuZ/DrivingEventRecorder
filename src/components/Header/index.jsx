import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Col, Icon, Layout, Menu, Row} from "antd";
import {NavLink} from "react-router-dom";
import logo from "../../static/logo.svg";
import "./index.less";

@inject("store")
@observer
export default class Header extends Component {

  componentDidMount() {
    this.props.store.GlobalStore.initSelectedPageId();
  }

  renderMenu = () => {
    return this.props.store.GlobalStore.pagesMetaInfo.map(item => {
      return (
        <Menu.Item key={item.pageUrl}>
          <NavLink to={item.pageUrl}>
            <Icon type={item.icon}/>
            <span>{item.pageTitle}</span>
          </NavLink>
        </Menu.Item>
      );
    });
  };

  render() {
    const {Header} = Layout;
    const {selectedPageId, changeSelectedPageId, appTexts} = this.props.store.GlobalStore;
    return (
      <Header>
        <Row align="middle">
          <Col className="logo-wrap" xs={{span: 4, offset: 1}} md={{span: 1, offset: 1}}>
            <img src={logo} alt="logo" className="logo"/>
          </Col>
          <Col className="name-wrap" xs={0} md={{span: 4, offset: 0}} lg={{span: 3, offset: 0}}>
            {appTexts.AppName}
          </Col>
          <Col className="menu-wrap" xs={18} md={{span: 17, offset: 0}} lg={{span: 18, offset: 0}}>
            <Menu
              selectedKeys={selectedPageId}
              theme="dark"
              mode="horizontal"
              className="menu"
              onClick={e => changeSelectedPageId(e.key)}
            >
              {this.renderMenu()}
            </Menu>
          </Col>
        </Row>
      </Header>
    );
  }
}
