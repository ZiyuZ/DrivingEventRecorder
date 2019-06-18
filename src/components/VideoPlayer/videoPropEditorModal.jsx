import React, {Component} from 'react';
import "./index.less";
import {inject, observer} from "mobx-react";
import {Descriptions, Input, InputNumber, Modal, Radio, Steps, Tooltip} from "antd";

@inject("store")
@observer
class VideoPropEditorModal extends Component {
  thisStore = this.props.store.VideoBasedRecorder;

  renderVideoPropEditorModal = () => {
    const {videoProps, updateVideoProp, videoStatusSteps, rootStore} = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    if (!videoProps.isFrozen) {
      return "Invalid Video!"
    }
    const {id, status, video_gps_time_diff, type, begin_time, end_time, file_name, path, recorder, reviewer} = videoProps;
    const tip = displayEnglish ? "The item is not able to edit currently" : "暂不支持编辑此项";
    return <Descriptions bordered border column={{md: 1, lg: 3}} size="small">
      <Descriptions.Item label={displayEnglish ? "File Name" : "文件名"} span={2}>{file_name}</Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "ID" : "编号"} span={1}>{id}</Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "Path" : "路径"} span={3}>{path}</Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "Begin Time" : "开始时间"} span={2}>
        <Tooltip title={tip}>
          <Input className="video-editor-input" disabled={true}
                 placeholder={begin_time.format('YYYY-MM-DD HH:mm:ss Z')}/>
        </Tooltip>
      </Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "Recorder" : "采集人"} span={1}>
        <Input className="video-editor-input" placeholder={recorder}
               onChange={(e) => updateVideoProp('recorder', e.target.value)}/>
      </Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "End Time" : "结束时间"} span={2}>
        <Tooltip title={tip}>
          <Input className="video-editor-input" disabled={true} placeholder={end_time.format('YYYY-MM-DD HH:mm:ss Z')}/>
        </Tooltip>
      </Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "Reviewer" : "审核人"} span={1}>
        <Input className="video-editor-input" placeholder={reviewer}
               onChange={(e) => updateVideoProp('reviewer', e.target.value)}/>
      </Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "Video Type" : "视频类型"} span={2}>
        <Radio.Group
          className="video-editor-input video-editor-radio"
          onChange={(e) => updateVideoProp('type', e.target.value)}
          value={type}
        >
          <Radio value={"A"}>{displayEnglish ? "outside (front)" : "外部摄像头 (前方)"}</Radio>
          <Radio value={"B"}>{displayEnglish ? "inside" : "内部摄像头"}</Radio>
          <Radio value={"U"}>{displayEnglish ? "Unknown" : "未知"}</Radio>
        </Radio.Group>
      </Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "Video-GPS Diff" : "视频-轨迹时间差"} span={1}>
        <InputNumber
          className="video-editor-input"
          defaultValue={video_gps_time_diff}
          min={0}
          max={3600}
          formatter={value => `${value} s`}
          parser={value => value.replace(' s', '')}
          onChange={(value) => updateVideoProp('video_gps_time_diff', value)}
        />
      </Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "Status" : "状态"} span={3}>
        <Steps
          current={status}
          size="small"
          className="video-editor-status"
          onChange={(current) => {
            updateVideoProp('status', current)
          }}
          status={status === 4 ? "finish" : "process"}
        >
          {videoStatusSteps.map(item => (
            <Steps.Step key={item.statusCode} title={item.desc}/>
          ))}
        </Steps>
      </Descriptions.Item>
    </Descriptions>
  };


  render() {
    const {renderVideoPropEditorModal} = this;
    const {
      videoPropEditorModalVisible,
      switchVideoPropEditorModalVisible,
      putVideoProp,
      rootStore
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    return (
      <Modal
        title={displayEnglish ? "Video Properties Editor" : "视频属性编辑"}
        centered
        closable
        onOk={putVideoProp}
        onCancel={switchVideoPropEditorModalVisible}
        visible={videoPropEditorModalVisible}
        okText="Update"
        okButtonProps={{type: "danger"}}
        cancelText="Cancel"
        className="video-editor-modal"
      >
        {renderVideoPropEditorModal()}
      </Modal>
    );
  }
}

export default VideoPropEditorModal;