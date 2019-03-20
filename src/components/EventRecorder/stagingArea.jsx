import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import dayjs from "dayjs";
import { List, Button, Popconfirm, Card, Empty, Icon, Tooltip } from "antd";

@inject("store")
@observer
export default class StagingArea extends Component {
  thisStore = this.props.store.EventRecorder;

  renderActions = (index, time) => {
    const { handleSubmit, deleteElementFromStaging } = this.thisStore;
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
        <Button type="danger" shape="circle" icon="delete" />
      </Popconfirm>
    ];
  };

  renderItemMeta = item => {
    const { findEventDefinitionByEventId } = this.thisStore;
    const itemDefinition = findEventDefinitionByEventId(item.event_id);
    const thisEventOptions = itemDefinition.event_option_groups
      .map(value => value.event_options)
      .flat();
    return (
      <List.Item.Meta
        title={`${itemDefinition.event_id}. ${itemDefinition.description}`}
        description={
          <ul className="event-code-description-list">
            {item.event_code.map((code, index) => (
              <li key={index}>
                {
                  thisEventOptions.find(value => value.option_id === code)
                    .description
                }
              </li>
            ))}
          </ul>
        }
      />
    );
  };

  renderEventItem = (item, index) => {
    return (
      <List.Item
        actions={this.renderActions(
          index,
          dayjs.unix(item.start_timestamp).format("HH:mm:ss")
        )}
      >
        {this.renderItemMeta(item)}
        {item.description ? (
          <Tooltip placement="top" title="description" className="description">
            <Icon
              type="profile"
              theme="twoTone"
              twoToneColor="#52c41a"
              className="description-icon"
            />
            {item.description}
          </Tooltip>
        ) : null}
      </List.Item>
    );
  };

  renderStaging = () => {
    const { staging } = this.thisStore;
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
        title="Staging Area"
        type="inner"
        bordered
        className="children-card"
      >
        {this.thisStore.staging.length === 0 ? <Empty /> : this.renderStaging()}
      </Card>
    );
  }
}
