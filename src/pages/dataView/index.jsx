import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Card, Spin, Alert, Table } from "antd";

@inject("store")
@observer
export default class DataView extends Component {
  thisStore = this.props.store.EventDataView;

  componentDidMount = () => {
    this.thisStore.fetchAllData();
  };

  renderTable = () => {
    if (this.thisStore.eventData) {
      const { eventData, columns } = this.thisStore;
      return <Table dataSource={eventData} columns={columns} />;
    } else {
      return (
        <Spin tip="Loading...">
          <Alert
            message="正在加载"
            description="正在加载事件列表, 请稍候..."
            type="info"
          />
        </Spin>
      );
    }
  };

  render() {
    return (
      <Card title="数据视图" className="main card-wrap">
        {this.renderTable()}
      </Card>
    );
  }
}
