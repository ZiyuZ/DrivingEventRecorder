import React, {Component} from 'react';
import "./index.less";
import {inject, observer} from "mobx-react";
import VideoPropEditorModal from "./videoPropEditorModal";
import VideoSelector from "./videoSelector";
import ReactPlayer from "react-player";
import PlayerManager from "./playerManager";
import {Button, Col, Row, Tooltip} from "antd";

@inject("store")
@observer
class VideoPlayer extends Component {
  thisStore = this.props.store.VideoBasedRecorder;

  render() {
    const {
      videoProps,
      switchVideoPropEditorModalVisible,
      playerProps,
      playerFlipStyle,
      rootStore
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    return (
      <div className="video-player-wrap">
        <Row gutter={16} className="options-wrap">
          <Col span={16}>
            <VideoSelector/>
          </Col>
          <Col span={6}>
            <PlayerManager/>
          </Col>
          <Col span={2}>
            <Tooltip title={displayEnglish ? "Manage video information" : "管理视频信息"}>
              <Button
                icon="setting"
                type="primary"
                onClick={switchVideoPropEditorModalVisible}
                disabled={!videoProps.isFrozen}
              />
            </Tooltip>
          </Col>
        </Row>
        <VideoPropEditorModal/>
        <ReactPlayer {...playerProps} style={playerFlipStyle} className="player"/>
      </div>
    );
  }
}

export default VideoPlayer;