import React, {Component} from "react";
import {Button, Card, Col, DatePicker, Icon, Input, InputNumber, Modal, Radio, Row, Select, Steps, Tooltip} from "antd";
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
    const {videoList, videoStatusSteps} = this.thisStore;
    return videoList.map((videoProps) => (
      <Select.Option
        value={videoProps.ID}
        key={videoProps.ID}
      >
        {`${videoProps.ID}. ${videoProps.file_name} (${videoProps.type}, ${videoStatusSteps.find(item => item.statusCode === videoProps.status).desc})`}
      </Select.Option>
    ))
  };

  renderVideoList = () => {
    const {renderVideoListItem} = this;
    const {videoList, videoProps, rootStore, updateVideoProp} = this.thisStore;
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
          updateVideoProp("id", value)
        }}
        filterOption={
          (input, option) =>
            option.props.children
              .toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        className="video-list-select"
      >
        {renderVideoListItem()}
      </Select>
    }
  };

  renderOptions = () => {
    const {renderVideoList} = this;
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
        {renderVideoList()}
      </Col>
      <Col span={6}>
        <DatePicker
          showTime
          disabled={videoProps.isFrozen}
          placeholder={displayEnglish ? "Set video start time" : "设置视频起始时间"}
          onChange={(time) => updateVideoProp("begin_time", time)}
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

  renderVideoPropEditorModal = () => {
    const {videoProps, updateVideoProp, videoStatusSteps} = this.thisStore;
    if (!videoProps.isFrozen) {
      return "Invalid Video!"
    }
    const {id, status, video_gps_time_diff, type, begin_time, end_time, file_name, path} = videoProps;
    // 日期改成 DatePicker
    return <>
      <Row className="video-editor-item" type="flex" align="middle">
        <div className="video-editor-label">ID:</div>
        <Tooltip title="Edit not supported now">
          <Input className="video-editor-input" disabled={true} placeholder={id}/>
        </Tooltip>
      </Row>
      <Row className="video-editor-item" type="flex" align="middle">
        <div className="video-editor-label">File Name:</div>
        <Tooltip title="Edit not supported now">
          <Input className="video-editor-input" disabled={true} placeholder={file_name}/>
        </Tooltip>
      </Row>
      <Row className="video-editor-item" type="flex" align="middle">
        <div className="video-editor-label">Path:</div>
        <Tooltip title="Edit not supported now">
          <Input className="video-editor-input" disabled={true} placeholder={path}/>
        </Tooltip>
      </Row>
      <Row className="video-editor-item" type="flex" align="middle">
        <div className="video-editor-label">Begin Time:</div>
        <Tooltip title="Edit not supported now">
          <Input className="video-editor-input" disabled={true}
                 placeholder={begin_time.format('YYYY-MM-DD HH:mm:ss Z')}/>
        </Tooltip>
      </Row>
      <Row className="video-editor-item" type="flex" align="middle">
        <div className="video-editor-label">End Time:</div>
        <Tooltip title="Edit not supported now">
          <Input className="video-editor-input" disabled={true} placeholder={end_time.format('YYYY-MM-DD HH:mm:ss Z')}/>
        </Tooltip>
      </Row>
      <Row className="video-editor-item" type="flex" align="middle">
        <div className="video-editor-label">Type:</div>
        <Radio.Group
          className="video-editor-input video-editor-radio"
          onChange={(e) => updateVideoProp('type', e.target.value)}
          value={type}
        >
          <Radio value={"A"}>A: outside (front)</Radio>
          <Radio value={"B"}>B: inside</Radio>
          <Radio value={"U"}>U: Unknown</Radio>
        </Radio.Group>
      </Row>
      <Row className="video-editor-item" type="flex" align="middle">
        <div className="video-editor-label">Video-GPS Diff:</div>
        <InputNumber
          className="video-editor-input"
          defaultValue={video_gps_time_diff}
          min={0}
          max={3600}
          formatter={value => `${value} s`}
          parser={value => value.replace(' s', '')}
          onChange={(value) => updateVideoProp('video_gps_time_diff', value)}
        />
      </Row>
      <Row className="video-editor-item" type="flex" align="middle">
        <div className="video-editor-label">Status:</div>
        <Card size="small" className="video-editor-status">
          <Steps
            current={status}
            direction="vertical"
            size="small"
            className="video-editor-status"
            onChange={(current) => {
              updateVideoProp('status', current)
            }}
            status={status === 4 ? "finish" : "process"}
          >
            {videoStatusSteps.map((item, index) => (
              <Steps.Step key={item.statusCode} title={item.desc} className={index === 4 ? "last-step" : "step"}/>
            ))}
          </Steps>
        </Card>
      </Row>
    </>
  };

  render() {
    const {renderOptions, renderVideoPropEditorModal} = this;
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
        {renderOptions()}
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
          okText="Update"
          okButtonProps={{type: "danger"}}
          cancelText="Cancel"
        >
          {renderVideoPropEditorModal()}
        </Modal>
      </Card>
    );
  }
}
