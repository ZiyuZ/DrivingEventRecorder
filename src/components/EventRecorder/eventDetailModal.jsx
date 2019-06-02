import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Modal, Radio, Checkbox, Input, List} from "antd";
import "./index.less";
import {toJS} from "mobx";

@inject("store")
@observer
export default class EventDetailModal extends Component {
  thisStore = this.props.store.EventRecorder;

  renderRadioGroup = group => {
    const {group_id, group_type, options} = group;
    const descIndex = this.thisStore.rootStore.GlobalStore.displayEnglish ? 1 : 0;
    return (
      <Radio.Group
        name={`${group_id}`}
        key={group_id}
        className="option-group"
        onChange={e =>
          this.thisStore.handleCodeChange(group_type, group_id, e.target.value)
        }
      >
        {options.map(option => (
          <Radio value={option.option_id} key={option.option_id}>
            {option.desc[descIndex]}
          </Radio>
        ))}
      </Radio.Group>
    );
  };

  renderCheckBoxGroup = group => {
    const {group_id, group_type, options} = group;
    const descIndex = this.thisStore.rootStore.GlobalStore.displayEnglish ? 1 : 0;
    return (
      <Checkbox.Group
        key={group_id}
        className="option-group"
        onChange={checkedList =>
          this.thisStore.handleCodeChange(group_type, group_id, checkedList)
        }
      >
        {options.map(option => (
          <Checkbox value={option.option_id} key={option.option_id}>
            {option.desc[descIndex]}
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
    const {option_groups} = this.thisStore.thisEventDefinition;
    return (
      <List
        size="small"
        bordered
        dataSource={option_groups}
        renderItem={this.renderOptionListItem}
      />
    );
  };

  renderModal = () => {
    const {
      thisEventDefinition,
      modalVisible,
      setModalVisible,
      handleModalOk,
      rootStore
    } = this.thisStore;
    const descIndex = rootStore.GlobalStore.displayEnglish ? 1 : 0;
    const {event_id, desc} = thisEventDefinition;
    return (
      <Modal
        centered
        title={`${event_id}. ${desc[descIndex]}`}
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
