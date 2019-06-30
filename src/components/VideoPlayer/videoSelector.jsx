import React, {Component} from 'react';
import "./index.less";
import {inject, observer} from "mobx-react";
import {Button, Col, DatePicker, Modal, Select, Tooltip} from "antd";
import moment from "moment";

@inject("store")
@observer
class VideoSelector extends Component {
  thisStore = this.props.store.VideoBasedRecorder;

  componentDidMount() {
    this.thisStore.fetchVideoDates();
  }

  renderVideoListItem = () => {
    const {videoList, videoStatusSteps} = this.thisStore;
    return videoList.map((videoProps) => (
      <Select.Option
        value={videoProps.ID}
        key={videoProps.ID}
      >
        {`${videoProps.ID}. ${videoProps.file_name} (${videoStatusSteps.find(item => item.statusCode === videoProps.status).desc})`}
      </Select.Option>
    ))
  };

  renderVideoList = () => {
    const {renderVideoListItem} = this;
    const {videoList, videoProps, rootStore, updateVideoProp} = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    if (!videoList) {
      return <Select
        placeholder={displayEnglish ? "Waiting for selection date" : "等待选取日期"}
        disabled
        className="video-list-select"
        dropdownMatchSelectWidth={false}
      />
    } else {
      return <Select
        showSearch
        disabled={videoProps.isFrozen}
        // placeholder={}
        optionFilterProp="children"
        onChange={(value) => updateVideoProp("id", value)}
        filterOption={
          (input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        value={videoList.length !== 0 ?
          (videoProps.file_name ? videoProps.file_name : (displayEnglish ? "Select a video" : "选择一个视频"))
          :
          (displayEnglish ? "No videos" : "没有视频")}
        className="video-list-select"
      >
        {renderVideoListItem()}
      </Select>
    }
  };

  renderSelector = () => {
    const {renderVideoList} = this;
    const {
      videoProps,
      updateVideoProp,
      loadVideo,
      releaseVideo,
      switchVideoFilterModalVisible,
      rootStore,
      videoList
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    return <>
      <Col span={2}>
        <Tooltip title={displayEnglish ? "Filter videos by time" : "根据时间过滤视频"}>
          <Button
            icon="calendar"
            type={videoList ? "" : "primary"}
            onClick={switchVideoFilterModalVisible}
            disabled={videoProps.isFrozen}
          />
        </Tooltip>
      </Col>
      <Col span={8}>
        {renderVideoList()}
      </Col>
      <Col span={8}>
        <DatePicker
          showTime
          allowClear={false}
          disabled={videoProps.isFrozen || !videoList}
          placeholder={displayEnglish ? "Set video start time" : "设置视频起始时间"}
          onChange={(time) => updateVideoProp("begin_time", time)}
          value={videoProps.begin_time}
          className="date-pick"
        />
      </Col>
      <Col span={6}>
        {videoList ? videoProps.isFrozen ?
          <Button type="danger" onClick={releaseVideo}>Stop Recording</Button> :
          <Button type="primary" onClick={loadVideo}>Load Video</Button>
          :
          <Button disabled>Waiting</Button>
        }
      </Col>
    </>
  };

  renderDatePicker = () => {
    const {updateVideoFilterDate, videoDates} = this.thisStore;
    return (
      <DatePicker
        format="YYYY-MM-DD"
        showToday={false}
        defaultPickerValue={moment('2018-12-12', 'YYYY-MM-DD')}
        onChange={updateVideoFilterDate}
        style={{width: "100%", marginTop: "10px"}}
        dateRender={current => {
          const style = {};
          if (videoDates.indexOf(current.format("YYYY-MM-DD")) !== -1) {
            style.border = '1px solid #1890ff';
            style.borderRadius = '50%';
          }
          return (
            <div className="ant-calendar-date" style={style}>
              {current.date()}
            </div>
          );
        }}
      />
    )
  };

  renderVideoFilterModal = () => {
    const {renderDatePicker} = this;
    const {
      videoFilterModalVisible,
      switchVideoFilterModalVisible,
      fetchVideoList,
      rootStore
    } = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    return <Modal
      title={displayEnglish ? "Filter videos by time" : "根据时间过滤视频"}
      centered
      closable
      onOk={() => {
        fetchVideoList();
        switchVideoFilterModalVisible();
      }}
      onCancel={switchVideoFilterModalVisible}
      visible={videoFilterModalVisible}
      okText={displayEnglish ? "Fetch Videos" : "加载视频列表"}
      cancelText={displayEnglish ? "Cancel" : "取消"}
      width={330}
    >
      {displayEnglish ? 'The date with videos has been circled. Leave blank will obtain all videos.' : '被圈起的是有视频的日期, 留空将获取全部视频.'}
      {renderDatePicker()}
    </Modal>
  };

  render() {
    const {renderSelector, renderVideoFilterModal} = this;
    return (
      <>
        {renderSelector()}
        {renderVideoFilterModal()}
      </>
    );
  }
}

export default VideoSelector;