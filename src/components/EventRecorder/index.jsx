import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Col, Row, Spin, Empty} from "antd";
import EventSelector from "./eventSelector";
import StagingArea from "./stagingArea";
import EventDetailModal from "./eventDetailModal";
import "./index.less";

@inject("store")
@observer
export default class EventRecorder extends Component {
  componentDidMount = () => {
    this.props.store.EventRecorder.fetchAllData();
  };

  render() {
    return this.props.store.EventDefinition.eventDefinition ? (
      <Row className="event-recorder">
        <Col xs={24} sm={12} className="event-recorder-col">
          <EventSelector/>
        </Col>
        <Col xs={24} sm={12} className="event-recorder-col">
          <StagingArea/>
        </Col>
        <EventDetailModal/>
      </Row>
    ) : (
      <Spin tip="Loading..." className="events-wrap">
        <Empty/>
      </Spin>
    );
  }
}
