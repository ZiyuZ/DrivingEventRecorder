import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Alert, Button, Card, Spin, Table} from "antd";
import {CSVLink} from "react-csv";
import dayjs from "dayjs";

@inject("store")
@observer
export default class DataView extends Component {
  thisStore = this.props.store.EventDataView;

  componentDidMount = () => {
    this.thisStore.fetchAllData();
  };

  renderColumns = () => {
    const {columns, deleteEventById} = this.thisStore;
    const action = {
      title: "Action",
      key: "action",
      render: (text, record) => {
        return <Button
          type="danger"
          onClick={() => deleteEventById(record.key)}
        >
          Delete
        </Button>
      }
    };
    return columns.concat([action]);
  };

  renderTable = () => {
    if (this.thisStore.eventData) {
      const {eventData} = this.thisStore;
      return <Table dataSource={eventData} columns={this.renderColumns()}/>;
    } else {
      return (
        <Spin tip="Loading...">
          <Alert
            message="Loading..."
            description="Loading event list..."
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
        eventData.length !== 0 ?
          <CSVLink data={eventData} filename={filename}>
            Download CSV
          </CSVLink> : "No data"
        : "Loading..."}
    </Button>
  };

  render() {
    return (
      <Card
        title={this.props.store.GlobalStore.appTexts.pageTitles[4]}
        className="main card-wrap"
        extra={this.renderDownloadCSVButton()}
      >
        {this.renderTable()}
      </Card>
    );
  }
}
