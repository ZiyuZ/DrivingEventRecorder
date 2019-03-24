import React, {Component} from "react";
import "./style/App.less";
import {Col, Layout, Row} from "antd";
import Header from "./components/Header";
import seuLogo from "./static/seu_logo.png";

class App extends Component {
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
          </Footer>
        </Layout>
        {process.env.NODE_ENV === 'development' ? require("mobx-react-devtools").default : null}
      </div>
    );
  }
}

export default App;
