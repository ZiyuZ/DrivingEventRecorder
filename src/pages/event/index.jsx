import React, { Component } from "react";
import { Card, Spin, Alert, Table } from "antd";
import backendConfig from "../../config/backendConfig";
import Axios from "../../utils/axios";
import dayjs from "dayjs";

export default class Event extends Component {
  state = {
    loaded: false,
    events: [],
    eventDefinition: []
  };

  componentDidMount = () => {
    Axios.ajax({
      url: backendConfig.eventDefinitionApi,
      method: "GET"
    })
      .then(res => {
        this.setState({
          eventDefinitions: res.data,
          loaded: true
        });
      })
      .then(() => {
        Axios.ajax({
          url: backendConfig.eventApi,
          method: "GET"
        }).then(res => {
          const { data } = res;
          this.setState({
            events: data.map(value => {
              const {
                id,
                event_type,
                event_code,
                start_timestamp,
                stop_timestamp,
                description
              } = value;
              // parse event type
              const thisEventDefinition = this.state.eventDefinitions.find(
                obj => obj.event_id === event_type
              );
              //parse event code
              const thisEventOptions = thisEventDefinition.event_option_groups
                .map(value => value.event_options)
                .flat();
              const eventCodeList = event_code.split(",").map(code => {
                code = parseInt(code);
                return thisEventOptions.find(value => value.option_id === code)
                  .description;
              });
              return {
                key: id,
                date: dayjs.unix(start_timestamp).format("YYYY-MM-DD"),
                startTime: dayjs.unix(start_timestamp).format("HH:mm:ss"),
                stopTime: dayjs.unix(stop_timestamp).format("HH:mm:ss"),
                eventType: thisEventDefinition.description,
                eventCode: eventCodeList.join(", "),
                description
              };
            }),
            columns: [
              { title: "ID", dataIndex: "key", key: "key" },
              { title: "日期", dataIndex: "date", key: "date" },
              {
                title: "开始时间",
                dataIndex: "startTime",
                key: "startTime"
              },
              {
                title: "结束时间",
                dataIndex: "stopTime",
                key: "stopTime"
              },
              {
                title: "事件类型",
                dataIndex: "eventType",
                key: "eventType"
              },
              {
                title: "事件描述",
                dataIndex: "eventCode",
                key: "eventCode"
              },
              {
                title: "备注",
                dataIndex: "description",
                key: "description"
              }
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
