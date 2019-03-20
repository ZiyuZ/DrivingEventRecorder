import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Modal, Radio, Checkbox, Input, List } from "antd";
import "./index.less";

@inject("store")
@observer
export default class EventDetailModal extends Component {
  thisStore = this.props.store.EventRecorder;

  renderRadioGroup = group => {
    const { group_id, group_type, event_options } = group;
    return (
      <Radio.Group
        name={`${group_id}`}
        key={group_id}
        className="option-group"
        onChange={e =>
          this.thisStore.handleCodeChange(group_type, group_id, e.target.value)
        }
      >
        {event_options.map(option => (
          <Radio value={option.option_id} key={option.option_id}>
            {option.description}
          </Radio>
        ))}
      </Radio.Group>
    );
  };

  renderCheckBoxGroup = group => {
    const { group_id, group_type, event_options } = group;
    return (
      <Checkbox.Group
        key={group_id}
        className="option-group"
        onChange={checkedList =>
          this.thisStore.handleCodeChange(group_type, group_id, checkedList)
        }
      >
        {event_options.map(option => (
          <Checkbox value={option.option_id} key={option.option_id}>
            {option.description}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  };

  renderDescription = () => {
    return (
      <Input
        className="description-input"
        // size="small"
        placeholder="Description"
        onChange={e => this.thisStore.handleDescriptionChange(e.target.value)}
      />
    );
  };

  renderOptionGroup = group => {
    switch (group.group_type) {
      case "r":
        return this.renderRadioGroup(group);
      case "c":
        return this.renderCheckBoxGroup(group);
      default:
        console.warn("Unknown group type: " + group_type);
    }
  };

  renderOptionListItem = item => {
    return <List.Item>{this.renderOptionGroup(item)}</List.Item>;
  };

  renderOptionList = () => {
    const { event_option_groups } = this.thisStore.thisEventDefinition;
    return (
      <List
        size="small"
        bordered
        dataSource={event_option_groups}
        renderItem={this.renderOptionListItem}
      />
    );
  };

  renderModal = () => {
    const {
      thisEventDefinition,
      modalVisible,
      setModalVisible,
      handleModalOk
    } = this.thisStore;
    const { event_id, description } = thisEventDefinition;
    return (
      <Modal
        centered
        title={`${event_id}. ${description}`}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        {this.renderOptionList()}
        {this.renderDescription()}
      </Modal>
    );
  };

  render() {
    return (
      <div>
        {this.thisStore.thisEventDefinition ? this.renderModal() : null}
      </div>
    );
  }
}
