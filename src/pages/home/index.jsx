import React, {Component} from "react";
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Button, Card} from "antd";
import "./index.less";

@inject("store")
@observer
export default class Home extends Component {
  handleButtonClicked = id => {
    this.props.store.GlobalStore.changeSelectedPageId(id.toString());
  };

  renderButton = item => {
    const {id, pageTitle, pageUrl, icon} = item;
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
      <Card title={this.props.store.GlobalStore.appTexts.pageTitles[0]} className="main card-wrap home-page-card">
        <div className="link-button-group">
          {this.props.store.GlobalStore.pagesMetaInfo.map(this.renderButton)}
        </div>
        {/*TODO: 配置后端选项, 一些文本框就行*/}
      </Card>
    );
  }
}
