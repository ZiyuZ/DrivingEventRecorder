import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Button, Card, Empty, Icon, List, Popconfirm, Tooltip} from "antd";
import utils from "../../utils/utils"

@inject("store")
@observer
export default class StagingArea extends Component {
  thisStore = this.props.store.EventRecorder;

  renderActions = (index, time) => {
    const {handleSubmit, deleteElementFromStaging} = this.thisStore;
    return [
      time,
      <Button
        type="primary"
        shape="circle"
        icon="save"
        onClick={() => handleSubmit(index)}
      />,
      <Popconfirm
        placement="top"
        title="Discard recorded event?"
        onConfirm={() => deleteElementFromStaging(index)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="danger" shape="circle" icon="delete"/>
      </Popconfirm>
    ];
  };

  renderItemMeta = item => {
    const {findEventDefinitionByEventId} = this.thisStore;
    const itemDefinition = findEventDefinitionByEventId(item.event_id);
    const thisEventOptions = utils.flatten(itemDefinition.option_groups.map(value => value.options));
    const descIndex = this.thisStore.rootStore.GlobalStore.displayEnglish ? 1 : 0;
    return (
      <List.Item.Meta
        title={`${itemDefinition.event_id}. ${itemDefinition.desc[descIndex]}`}
        description={
          <ul className="event-code-description-list">
            {item.option_code.map((code, index) => (
              <li key={index}>
                {thisEventOptions.find(value => value.option_id === code).desc[descIndex]}
              </li>
            ))}
          </ul>
        }
      />
    );
  };

  renderEventItem = (item, index) => {
    const descIndex = this.thisStore.rootStore.GlobalStore.displayEnglish ? 1 : 0;
    return (
      <List.Item
        actions={this.renderActions(index, utils.parseTime(item.start_time))}
      >
        {this.renderItemMeta(item)}
        {item.desc ? (
          <Tooltip placement="top" title="description" className="description">
            <Icon
              type="profile"
              theme="twoTone"
              twoToneColor="#52c41a"
              className="description-icon"
            />
            {item.desc[descIndex]}
          </Tooltip>
        ) : null}
      </List.Item>
    );
  };

  renderStaging = () => {
    const {staging} = this.thisStore;
    return (
      <List
        size="small"
        bordered
        itemLayout="vertical"
        dataSource={staging}
        renderItem={(item, index) => this.renderEventItem(item, index)}
        className="staging-list"
      />
    );
  };

  render() {
    return (
      <Card
        title={this.thisStore.rootStore.GlobalStore.displayEnglish ? "Staging Area" : "暂存区"}
        type="inner"
        bordered
        className="children-card"
      >
        {this.thisStore.staging.length === 0 ? <Empty/> : this.renderStaging()}
      </Card>
    );
  }
}
