import React, { Component } from "react";
import { Card, Button } from "antd";
import pagesMetaInfo from "../../config/pagesMetaInfo";
import "./index.less";
export default class Home extends Component {
  render() {
    return (
      <Card title="首页" className="main card-wrap">
        {pagesMetaInfo.map(item => {
          const { pageTitle, pageUrl, icon } = item;
          return (
            <Button
              type="primary"
              size="large"
              title={pageTitle}
              href={pageUrl}
              icon={icon}
              className="router-button"
            >
              {pageTitle}
            </Button>
          );
        })}
      </Card>
    );
  }
}
