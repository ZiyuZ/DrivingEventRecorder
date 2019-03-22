import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Card, Spin, Alert, Table, Button} from "antd";
import {CSVLink} from "react-csv";
import dayjs from "dayjs";

@inject("store")
@observer
export default class DataView extends Component {
  thisStore = this.props.store.EventDataView;

  //TODO: csv 下载

  componentDidMount = () => {
    this.thisStore.fetchAllData();
  };

  renderTable = () => {
    if (this.thisStore.eventData) {
      const {eventData, columns} = this.thisStore;
      return <Table dataSource={eventData} columns={columns}/>;
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

  renderDownloadCSVButton = () => {
    const {eventData} = this.thisStore;
    const filename = `Event_${dayjs().format('YYYY-MM-DDTHH:mm:ss')}.csv`;
    return <Button>
      {eventData ?
        <CSVLink
          data={eventData}
          filename={filename}
        >
          Download CSV
        </CSVLink>
        : "Loading..."}
    </Button>
  };

  render() {
    return (
      <Card
        title="数据视图"
        className="main card-wrap"
        extra={this.renderDownloadCSVButton()}
      >
        {this.renderTable()}
      </Card>
    );
  }
}
