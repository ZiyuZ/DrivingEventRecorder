import React, {Component} from "react";
import {Card} from "antd";
import {inject, observer} from "mobx-react";
import "./index.less";
import EventRecorder from "../../components/EventRecorder";
import VideoPlayer from "../../components/VideoPlayer";

@inject("store")
@observer
export default class VideoBasedRecorder extends Component {
  thisStore = this.props.store.VideoBasedRecorder;

  render() {
    const {
      playerProps,
    } = this.thisStore;
    return (
      <Card title={this.props.store.GlobalStore.appTexts.pageTitles[1]} className="main card-wrap">
        <VideoPlayer/>
        <div className="video-event-recorder-wrap">
          {playerProps.url ? <EventRecorder/> : null}
        </div>
      </Card>
    );
  }
}
