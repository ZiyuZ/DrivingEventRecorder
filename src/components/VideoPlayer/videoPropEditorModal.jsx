import React, {Component} from 'react';
import "./index.less";
import {inject, observer} from "mobx-react";
import {Descriptions, Icon, Input, InputNumber, Modal, notification, Radio, Steps, Tooltip} from "antd";

@inject("store")
@observer
class VideoPropEditorModal extends Component {
  thisStore = this.props.store.VideoBasedRecorder;

  handleStepChange = (current) => {
    const {videoProps, updateVideoProp, rootStore, switchVideoPropVerificationModalVisible, switchVideoPropEditorModalVisible, OYX, permissionVerificationInformation} = this.thisStore;
    const {ID: reviewerName} = permissionVerificationInformation;
    const {displayEnglish} = rootStore.GlobalStore;
    const {status} = videoProps;
    if (current < status && (status === 2 || status === 4)) {
      notification.error({
        message: displayEnglish ? "Changing the status backward is not allowed." : "不允许后退视频状态",
        description: displayEnglish ? "Please wait for the review. If you really need to go back, please contact administrator." : "请等待检查. 如确实需要后退请与管理员联系."
      });
      return
    }
    if (current - status > 1) {
      notification.error({
        message: displayEnglish ? "Skipping status is not allowed." : "不允许跳过状态"
      });
      return
    }
    if (current === 2 && !videoProps.recorder) {
      notification.error({
        message: displayEnglish ? "Please enter valid recorder person information" : "请输入有效的采集人信息"
      });
      return
    }
    if (current === 3) {
      updateVideoProp('reviewer', reviewerName);
    }
    if (current === 4 && !videoProps.reviewer) {
      notification.error({
        message: displayEnglish ? "Please enter valid reviewer person information" : "请输入有效的审核人信息"
      });
      return
    }
    if (current >= 3 || status >= 3) {
      if (!OYX) {
        switchVideoPropEditorModalVisible();
        switchVideoPropVerificationModalVisible();
        return; // 接下来由 verificationModal 管理是否需要更新状态
      }
    }
    updateVideoProp('status', current)
  };

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
        {status > 1 ?
          <Tooltip
            title={displayEnglish ? "Not allowed to modify the recorder after the entry is completed" : "录入完成后不允许修改采集人"}>
            <Input className="video-editor-input" placeholder={recorder} disabled={true}/>
          </Tooltip>
          :
          <Input className="video-editor-input" placeholder={recorder}
                 onChange={(e) => updateVideoProp('recorder', e.target.value)}/>
        }
      </Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "End Time" : "结束时间"} span={2}>
        <Tooltip title={tip}>
          <Input className="video-editor-input" disabled={true} placeholder={end_time.format('YYYY-MM-DD HH:mm:ss Z')}/>
        </Tooltip>
      </Descriptions.Item>
      <Descriptions.Item label={displayEnglish ? "Reviewer" : "审核人"} span={1}>
        {reviewer || <Tooltip
          title={displayEnglish ? "This item can only be modified during reviewing" : "仅检查阶段允许修改此项"}>-</Tooltip>}
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
          onChange={status === 4 ? null : this.handleStepChange}
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
      videoPropVerificationModalVisible,
      switchVideoPropVerificationModalVisible,
      putVideoProp,
      permissionVerificationInformation,
      setPropUpdateVerifyField,
      OYX,
      updateVideoProp,
      rootStore
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    return (<>
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

        <Modal
          title={displayEnglish ? "Permissions validation" : "权限验证"}
          okText="Verify"
          centered
          visible={videoPropVerificationModalVisible}
          onOk={() => {
            if (OYX) {
              updateVideoProp('status', 3);
              updateVideoProp('reviewer', permissionVerificationInformation.ID);
              notification.success({message: displayEnglish ? "Verify successfully" : "验证成功"});
            } else {
              notification.error({message: displayEnglish ? "ID or token invalid!" : "ID 或令牌无效!"});
              return
            }
            switchVideoPropVerificationModalVisible();
            switchVideoPropEditorModalVisible();
          }}
          onCancel={() => {
            switchVideoPropVerificationModalVisible();
            switchVideoPropEditorModalVisible();
          }}
          width={260}
        >
          <Input
            prefix={<Tooltip title="ID"><Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/></Tooltip>}
            placeholder="ID"
            onChange={(e) => setPropUpdateVerifyField('ID', e.target.value)}
            style={{marginBottom: "12px"}}
          />
          <Input
            prefix={<Tooltip title="Token"><Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/></Tooltip>}
            placeholder="Token"
            onChange={(e) => setPropUpdateVerifyField('token', e.target.value)}
          />
        </Modal>
      </>
    );
  }
}

export default VideoPropEditorModal;