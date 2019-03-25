import React, {Component} from "react";
import {
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Select, InputNumber
} from "antd";
import ReactPlayer from "react-player";
import {inject, observer} from "mobx-react";
import "./index.less";
import EventRecorder from "../../components/EventRecorder";

@inject("store")
@observer
export default class VideoBasedRecorder extends Component {

  thisStore = this.props.store.VideoBasedRecorder;

  componentDidMount() {
    this.thisStore.fetchVideoList();
  }

  renderVideoListItem = () => {
    return this.thisStore.videoList.map((videoName) => (
      <Select.Option value={videoName} key={videoName}>{videoName}</Select.Option>
    ))
  };

  renderVideoList = () => {
    const {videoList, videoProps} = this.thisStore;
    if (!videoList) {
      return <Select
        placeholder="Loading"
        disabled
        className="video-list-select"
      />
    } else {
      return <Select
        showSearch
        disabled={videoProps.isFrozen}
        placeholder={videoList.length === 0 ? "No videos" : "Select a video" }
        optionFilterProp="children"
        onChange={(value) => {
          this.thisStore.updateVideoProp({key: "name", value})
        }}
        filterOption={
          (input, option) =>
            option.props.children
              .toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        className="video-list-select"
      >
        {this.renderVideoListItem()}
      </Select>
    }
  };

  render() {
    const {
      videoProps,
      playerProps,
      updateVideoProp,
      loadVideo,
      releaseVideo,
      updatePlaybackRate
    } = this.thisStore;
    return (
      <Card title="视频事件记录" className="main card-wrap">
        <Row gutter={16} className="options-wrap">
          <Col span={6}>
            {this.renderVideoList()}
          </Col>
          <Col span={8}>
            <DatePicker
              showTime
              disabled={videoProps.isFrozen}
              placeholder="Set video start time"
              onChange={(time) => updateVideoProp({
                key: "baseTime",
                value: time
              })}
              value={videoProps.baseTime}
              className="date-pick"
            />
          </Col>
          <Col span={4}>
            {videoProps.isFrozen ?
              <Button type="danger" onClick={releaseVideo}>
                Stop Recording
              </Button> :
              <Button type="primary" onClick={loadVideo}>
                Load Video
              </Button>}
          </Col>
          <Col span={5}>
            <span>Playback Rate:&nbsp;&nbsp;</span>
            <InputNumber
              addonBefore="Rate"
              min={0.1} max={5.0} step={0.1}
              value={playerProps.playbackRate}
              className="playback-rate-input"
              onChange={value => updatePlaybackRate(value)}
            />
          </Col>
        </Row>
        <ReactPlayer {...playerProps}/>
        <div className="event-recorder-wrap">
          {playerProps.url ? <EventRecorder/> : null}
        </div>
      </Card>
    );
  }
}
