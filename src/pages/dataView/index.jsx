import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Alert, Button, Card, Spin, Table} from "antd";
import {CSVLink} from "react-csv";
import utils from "../../utils/utils"

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
          size="small"
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
    const filename = `Event_${utils.parseTime()}.csv`;
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
    const {renderTable} = this;
    return (
      <Card
        title={this.props.store.GlobalStore.appTexts.pageTitles[4]}
        className="main card-wrap"
        extra={this.renderDownloadCSVButton()}
      >
        {renderTable()}
      </Card>
    );
  }
}
