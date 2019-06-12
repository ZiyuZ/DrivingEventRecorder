import React, {Component} from "react";
import {Button, Card, Col, DatePicker, Icon, Input, InputNumber, Modal, Radio, Row, Select, Tooltip} from "antd";
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
    return this.thisStore.videoList.map((videoProps) => (
      <Select.Option value={videoProps.ID}
                     key={videoProps.ID}>{`${videoProps.ID}. ${videoProps.file_name} (${videoProps.type})`}</Select.Option>
    ))
  };

  renderVideoList = () => {
    const {videoList, videoProps, rootStore} = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
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
        placeholder={videoList.length === 0 ?
          (displayEnglish ? "No videos" : "没有视频") :
          (displayEnglish ? "Select a video" : "选择一个视频")}
        optionFilterProp="children"
        onChange={(value) => {
          this.thisStore.updateVideoProp({key: "ID", value})
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

  renderOptions = () => {
    const {
      videoProps,
      playerProps,
      updateVideoProp,
      loadVideo,
      releaseVideo,
      updatePlaybackRate,
      changePlayerFlip,
      playerVerticalFlip,
      playerHorizontalFlip,
      switchVideoPropEditorDrawerVisible,
      rootStore
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    // 添加日期选择过滤器
    return <Row gutter={16} className="options-wrap">
      <Col span={6}>
        {this.renderVideoList()}
      </Col>
      <Col span={6}>
        <DatePicker
          showTime
          disabled={videoProps.isFrozen}
          placeholder={displayEnglish ? "Set video start time" : "设置视频起始时间"}
          onChange={(time) => updateVideoProp({key: "begin_time", value: time})}
          value={videoProps.begin_time}
          className="date-pick"
        />
      </Col>
      <Col span={4}>
        {videoProps.isFrozen ?
          <Button type="danger" onClick={releaseVideo}>Stop Recording</Button> :
          <Button type="primary" onClick={loadVideo}>Load Video</Button>}
      </Col>
      <Col span={4}>
        <Tooltip title={displayEnglish ? "Playback Rate" : "播放速率"}>
          <Icon type="clock-circle" theme="twoTone" className="playback-rate-icon"/>
          <InputNumber
            addonBefore="Rate"
            min={0.1} max={5.0} step={0.1}
            value={playerProps.playbackRate}
            className="playback-rate-input"
            onChange={value => updatePlaybackRate(value)}
            disabled={!videoProps.isFrozen}
          />
        </Tooltip>
      </Col>
      <Col span={3}>
        <Button.Group>
          <Tooltip title={displayEnglish ? "Player Flips Horizontal" : "视频水平翻转"}>
            <Button
              icon="border-horizontal"
              type={playerHorizontalFlip ? "primary" : "default"}
              onClick={() => changePlayerFlip("playerHorizontalFlip")}
              disabled={!videoProps.isFrozen}
            />
          </Tooltip>
          <Tooltip title={displayEnglish ? "Player Flips Vertically" : "视频垂直翻转"}>
            <Button
              icon="border-verticle"
              type={playerVerticalFlip ? "primary" : "default"}
              onClick={() => changePlayerFlip("playerVerticalFlip")}
              disabled={!videoProps.isFrozen}
            />
          </Tooltip>
        </Button.Group>
      </Col>
      <Col span={1}>
        <Tooltip title={displayEnglish ? "Manage video information" : "管理视频信息"}>
          <Button
            icon="setting"
            type="danger"
            onClick={switchVideoPropEditorDrawerVisible}
            disabled={!videoProps.isFrozen}
          />
        </Tooltip>
      </Col>
    </Row>
  };

  renderVideoPropEditorDrawer = () => {
    const {videoProps, videoList, updateVideoPropEditedFields, videoPropEditableFields} = this.thisStore;
    if (!videoProps.isFrozen) {
      return "Invalid Video!"
    }
    const {id} = videoProps;
    const rawProp = videoList.find(value => value.ID === id);
    // 日期改成 DatePicker
    return <>
      <div className="drawer-item">
        <div className="drawer-label">ID:</div>
        <Tooltip title="Edit not supported now">
          <Input className="drawer-input" disabled={true} placeholder={rawProp.ID}/>
        </Tooltip>
      </div>
      <div className="drawer-item">
        <div className="drawer-label">File Name:</div>
        <Tooltip title="Edit not supported now">
          <Input className="drawer-input" disabled={true} placeholder={rawProp.file_name}/>
        </Tooltip>
      </div>
      <div className="drawer-item">
        <div className="drawer-label">Path:</div>
        <Tooltip title="Edit not supported now">
          <Input className="drawer-input" disabled={true} placeholder={rawProp.path}/>
        </Tooltip>
      </div>
      <div className="drawer-item">
        <div className="drawer-label">Begin Time:</div>
        <Tooltip title="Edit not supported now">
          <Input className="drawer-input" disabled={true} placeholder={rawProp.begin_time}/>
        </Tooltip>
      </div>
      <div className="drawer-item">
        <div className="drawer-label">End Time:</div>
        <Tooltip title="Edit not supported now">
          <Input className="drawer-input" disabled={true} placeholder={rawProp.end_time}/>
        </Tooltip>
      </div>
      <div className="drawer-item">
        <div className="drawer-label">Type:</div>
        <Radio.Group
          className="drawer-input drawer-radio"
          onChange={(e) => updateVideoPropEditedFields('type', e.target.value)}
          value={videoPropEditableFields.type || rawProp.type}
        >
          <Radio value={"A"}>A: outside (front)</Radio>
          <Radio value={"B"}>B: inside</Radio>
          <Radio value={"U"}>U: Unknown</Radio>
        </Radio.Group>
      </div>
      <div className="drawer-item">
        <div className="drawer-label">Video-GPS Diff:</div>
        <InputNumber
          className="drawer-input"
          defaultValue={rawProp.video_gps_time_diff}
          min={0}
          max={3600}
          formatter={value => `${value} s`}
          parser={value => value.replace(' s', '')}
          onChange={(value) => updateVideoPropEditedFields('video_gps_time_diff', value)}
        />
      </div>
    </>
  };

  render() {
    const {
      playerProps,
      playerFlipStyle,
      videoPropEditorDrawerVisible,
      switchVideoPropEditorDrawerVisible,
      putVideoProp,
      rootStore
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    return (
      <Card title={this.props.store.GlobalStore.appTexts.pageTitles[1]} className="main card-wrap">
        {this.renderOptions()}
        <ReactPlayer {...playerProps} style={playerFlipStyle} className="player"/>
        <div className="video-event-recorder-wrap">
          {playerProps.url ? <EventRecorder/> : null}
        </div>
        <Modal
          title={displayEnglish ? "Video Information Editor" : "视频信息编辑"}
          centered
          closable
          onOk={putVideoProp}
          onCancel={switchVideoPropEditorDrawerVisible}
          visible={videoPropEditorDrawerVisible}
          okText="Submit"
          cancelText="Cancel"
        >
          {this.renderVideoPropEditorDrawer()}
        </Modal>
      </Card>
    );
  }
}
