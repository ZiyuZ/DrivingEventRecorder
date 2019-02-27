import React, { Component } from "react";
import { Card, Spin, Alert, Table } from "antd";
import backendConfig from "../../config/backendConfig";
import Axios from "../../utils/utils";

export default class Events extends Component {
  state = {
    loaded: false,
    events: [],
    eventsDefinition: []
  };

  componentDidMount = () => {
    Axios.ajax({
      url: backendConfig.eventsDefinitionApi,
      method: "GET"
    })
      .then(res => {
        this.setState({
          eventsDefinition: res.data,
          loaded: true
        });
      })
      .then(() => {
        Axios.ajax({
          url: backendConfig.eventApi,
          method: "GET"
        }).then(res => {
          const { events } = res.data;
          this.setState({
            events: events.map((value, key) => {
              const [date, time] = value[0].split("T");
              const [eventTypeCode, eventCode] = value[1].split("-");
              const eventTypeObj = this.state.eventsDefinition.find(
                obj => obj.id === eventTypeCode
              );
              const eventType = eventTypeObj.description;
              console.log(eventCode, eventTypeObj.option[0]);
              const eventCodeList = [];
              eventCode.split("").map(code => {
                eventTypeObj.option.some(optionGroup => {
                  const content = optionGroup.content.find(
                    option => option.code === code
                  );
                  if (content !== undefined) {
                    eventCodeList.push(content.description);
                    return true
                  }
                  return false
                });
                return false
              });
              return {
                key,
                date,
                time,
                eventType,
                eventCode: eventCodeList.join(", ")
              };
            }),
            columns: [
              { title: "日期", dataIndex: "date", key: "date" },
              { title: "时间", dataIndex: "time", key: "time" },
              { title: "事件类型", dataIndex: "eventType", key: "eventType" },
              { title: "事件编码", dataIndex: "eventCode", key: "eventCode" }
            ],
            loaded: true
          });
        });
      });
  };

  renderTable = () => {
    if (this.state.loaded) {
      return (
        <Table dataSource={this.state.events} columns={this.state.columns} />
      );
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
      <Card title="首页" className="main card-wrap">
        {this.renderTable()}
      </Card>
    );
  }
}
