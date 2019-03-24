import React, { Component } from "react";
import { Link } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Card, Button } from "antd";
import pagesMetaInfo from "../../config/pagesMetaInfo";
import "./index.less";
@inject("store")
@observer
export default class Home extends Component {
  handleButtonClicked = id => {
    this.props.store.GlobalStore.changeSelectedPageId(id.toString());
  };

  renderButton = item => {
    const { id, pageTitle, pageUrl, icon } = item;
    return (
      <Link
        key={id}
        to={{
          pathname: pageUrl
        }}
      >
        <Button
          type="primary"
          size="large"
          title={pageTitle}
          icon={icon}
          className="router-button"
          onClick={() => this.handleButtonClicked(id)}
        >
          {pageTitle}
        </Button>
      </Link>
    );
  };

  render() {
    return (
      <Card title="首页" className="main card-wrap home-page-card">
        {/*<Alert*/}
          {/*message="注意: 视频事件 模块尚未被完全实现."*/}
          {/*type="warning"*/}
          {/*closable*/}
        {/*/>*/}
        <div className="link-button-group">
          {pagesMetaInfo.map(this.renderButton)}
        </div>
        {/*TODO: 配置后端选项, 一些文本框就行*/}
      </Card>
    );
  }
}
