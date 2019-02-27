import React, { Component } from 'react';
import { Card } from 'antd';

export default class Home extends Component {
  render() {
    return (
      <Card title="首页" className="main card-wrap">
        Hello, here is home.
      </Card>
    )
  }
}
