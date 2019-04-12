import React, {Component} from "react";
import {Card} from "antd";
import EventRecorder from "../../components/EventRecorder";
import "./index.less";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
export default class RealTimeRecorder extends Component {
  render() {
    return (
      <Card title={this.props.store.GlobalStore.appTexts.pageTitles[2]} className="main card-wrap">
        <div className="real-time-event-recorder-wrap">
          <EventRecorder/>
        </div>
      </Card>
    );
  }
}
