import React, {Component} from "react";
import "./style/App.less";
import {Button, Col, Layout, Row} from "antd";
import Header from "./components/Header";
import seuLogo from "./static/seu_logo.png";
import DevTools from "mobx-react-devtools";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
export default class App extends Component {

  componentDidMount() {
    if (navigator.language === "zh-CN") {
      this.props.store.GlobalStore.switchLang("init");
    }
  }

  render() {
    const {Content, Footer} = Layout;
    return (
      <div className="App">
        <Layout className="layout">
          <Header/>
          <Row className="content-row">
            <Col xs={{span: 24}} lg={{span: 20, offset: 2}} className="content-col">
              <Content className="content">{this.props.children}</Content>
            </Col>
          </Row>
          <Footer className="footer">
            Developed by&nbsp;
            <a href="mailto:zhangziyu@seu.edu.cn">
              zhzy
              <span role="img" aria-label="Fish">
                🐟
              </span>
            </a>
            &nbsp;@&nbsp;
            <a href="//www.seu.edu.cn" target="_blank">
              <img src={seuLogo} className="seu-logo" alt="seu-logo"/>
            </a>

            <div className="config-wrap" style={{marginLeft: "20px"}}>
              <Button title="Switch Language" size="small"
                      onClick={this.props.store.GlobalStore.switchLang}
              >
                {this.props.store.GlobalStore.displayEnglish ? "切换语言" : "Switch Language"}
              </Button>
            </div>
          </Footer>
        </Layout>
        {process.env.NODE_ENV === 'development' && <DevTools/>}
      </div>
    );
  }
}
