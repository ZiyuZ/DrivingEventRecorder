import React, { Component } from "react";
import "./style/App.less";
import { Layout } from "antd";
import Header from "./components/Header";
import DevTools from "mobx-react-devtools";

class App extends Component {
  render() {
    const { Content, Footer } = Layout;
    return (
      <div className="App">
        <Layout className="layout">
          <Header />
          {/*TODO: 实现响应式调整content宽度, 手机上宽度=屏幕宽度(获取屏幕像素, 调整state)*/}
          <Content className="content">{this.props.children}</Content>
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
