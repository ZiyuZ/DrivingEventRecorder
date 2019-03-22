import React, {Component} from "react";
import "./style/App.less";
import {Col, Layout, Row} from "antd";
import Header from "./components/Header";
import DevTools from "mobx-react-devtools";

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
            Created by{" "}
            <a href="mailto:zhangziyu@seu.edu.cn">
              zhzy
              <span role="img" aria-label="Fish">
                🐟
              </span>
            </a>{" "}
            @ SEU
          </Footer>
        </Layout>
        <DevTools />
      </div>
    );
  }
}

export default App;
