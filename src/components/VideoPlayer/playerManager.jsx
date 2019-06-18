import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Button, Col, Icon, InputNumber, Tooltip} from "antd";

@inject("store")
@observer
class PlayerManager extends Component {
  thisStore = this.props.store.VideoBasedRecorder;

  renderPlaybackRateButtons = () => {
    const {
      videoProps,
      playerProps,
      updatePlaybackRate,
      rootStore
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    return <Tooltip title={displayEnglish ? "Playback Rate" : "播放速率"}>
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
  };

  renderPlayerFlipButtons = () => {
    const {
      videoProps,
      changePlayerFlip,
      playerVerticalFlip,
      playerHorizontalFlip,
      rootStore
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    return <Button.Group>
      <Tooltip title={displayEnglish ? "Player Flips Vertically" : "视频垂直翻转"}>
        <Button
          icon="border-horizontal"
          type={playerHorizontalFlip ? "primary" : "default"}
          onClick={() => changePlayerFlip("playerHorizontalFlip")}
          disabled={!videoProps.isFrozen}
        />
      </Tooltip>
      <Tooltip title={displayEnglish ? "Player Flips Horizontal" : "视频水平翻转"}>
        <Button
          icon="border-verticle"
          type={playerVerticalFlip ? "primary" : "default"}
          onClick={() => changePlayerFlip("playerVerticalFlip")}
          disabled={!videoProps.isFrozen}
        />
      </Tooltip>
    </Button.Group>
  };

  render() {
    const {renderPlaybackRateButtons, renderPlayerFlipButtons} = this;
    return (<>
        <Col span={13}>
          {renderPlaybackRateButtons()}
        </Col>
        <Col span={11}>
          {renderPlayerFlipButtons()}
        </Col>
      </>
    );
  };
}

export default PlayerManager;