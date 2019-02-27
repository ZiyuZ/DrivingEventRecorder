import React, { Component } from "react";
import { Card } from "antd";
import EventRecorder from "../../components/EventRecorder";

export default class RealTimeRecorder extends Component {
  render() {
    return (
      <Card title="实时事件记录" className="main card-wrap">
        <EventRecorder />
      </Card>
    );
  }
}
