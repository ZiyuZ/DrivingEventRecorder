import React, {Component} from "react";
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Button, Card} from "antd";
import "./index.less";

@inject("store")
@observer
export default class Home extends Component {
  componentDidMount() {
    this.props.store.GlobalStore.fetchIP();
  }

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
    const {pagesMetaInfo, cnip, lnip, appTexts} = this.props.store.GlobalStore;
    return (
      <Card title={appTexts.pageTitles[0]} className="main card-wrap home-page-card">
        <div className="link-button-group">
          {pagesMetaInfo.map(this.renderButton)}
        </div>
        <br/>
        <div>
          Access via Campus Network IP: {cnip ? <a href={cnip}>{cnip}</a> : "Unknown"}
          <br/>
          Access via LAN IP: {lnip.map((value, index) => {
          const target = `http://${value}:${window.location.port}`;
          return <a href={target} key={index}>{value + '; '}</a>
        })}
        </div>
      </Card>
    );
  }
}
