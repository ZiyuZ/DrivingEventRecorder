import React, { Component } from "react";
import Axios from "../../utils/axios";
import backendConfig from "../../config/backendConfig";
import dayjs from "dayjs";
import "./index.less";
import {
  Col,
  Row,
  Card,
  Spin,
  Modal,
  Empty,
  List,
  Button,
  Radio,
  Checkbox,
  Input,
  notification,
  Popconfirm
} from "antd";

//TODO: 拆分这个文件

export default class EventRecorder extends Component {
  state = {
    modalVisible: false,
    thisEventDefinition: null,
    staging: []
  };

  componentDidMount = () => {
    Axios.ajax({
      url: backendConfig.eventDefinitionApi,
      method: "GET"
    }).then(res => {
      this.setState({
        eventDefinition: res.data
      });
    });
  };

  handleEventButtonClicked = event_id => {
    const event = {
      event_type: event_id,
      event_code: null,
      start_timestamp: dayjs().unix(),
      stop_timestamp: 0,
      description: ""
    };
    const thisEventDefinition = this.state.eventDefinition.find(
      value => value.event_id === event_id
    );
    event.event_code = Array.from({
      length: thisEventDefinition.event_option_groups.length
    });
    this.setState({
      thisEventDefinition,
      thisEventInfo: event
    });
    this.setModalVisible(true);
  };

  handleModalOk = () => {
    const { staging, thisEventInfo, thisEventDefinition } = this.state;
    if (
      thisEventInfo.event_code.some(
        (value, index) =>
          value === undefined &&
          thisEventDefinition.event_option_groups[index].group_type !== "c"
      )
    ) {
      notification.error({
        message: "Value Error",
        description:
          "Please ensure all radio buttons and text field are filled in."
      });
      return;
    }
    thisEventInfo.event_code = thisEventInfo.event_code
      .flat()
      .filter(value => value);
    staging.unshift(thisEventInfo);
    this.setState({ staging });
    this.setModalVisible(false);
  };

  setModalVisible = modalVisible => {
    if (modalVisible) {
      this.setState({ modalVisible });
    } else {
      this.setState({
        modalVisible,
        thisEventInfo: null,
        thisEventDefinition: null
      });
    }
  };

  renderModal = () => {
    const {
      event_id,
      description,
      event_option_groups
    } = this.state.thisEventDefinition;
    return (
      <Modal
        centered
        title={event_id + ". " + description}
        visible={this.state.modalVisible}
        onOk={() => this.handleModalOk()}
        onCancel={() => this.setModalVisible(false)}
      >
        <List
          size="small"
          bordered
          dataSource={event_option_groups}
          renderItem={item => (
            <List.Item>{this.renderOptionGroup(item)}</List.Item>
          )}
        />
      </Modal>
    );
  };

  handleCodeChange = (group_type, group_id, value) => {
    const { thisEventInfo } = this.state;

    switch (group_type) {
      case "r":
        thisEventInfo.event_code[group_id - 1] = value;
        break;
      case "c":
        thisEventInfo.event_code[group_id - 1] = value.sort();
        break;
      case "t":
        thisEventInfo.description = value;
        break;
      default:
        console.warn("Unknown group type: " + group_type);
    }
    this.setState({ thisEventInfo });
  };

  renderOptionGroup = group => {
    const { group_id, group_type, event_options } = group;
    switch (group_type) {
      case "r":
        return (
          <Radio.Group
            name={`${group_id}`}
            key={group_id}
            className="option-group"
            onChange={e =>
              this.handleCodeChange(group_type, group_id, e.target.value)
            }
          >
            {event_options.map(option => (
              <Radio value={option.option_id} key={option.option_id}>
                {option.description}
              </Radio>
            ))}
          </Radio.Group>
        );
      case "c":
        return (
          <Checkbox.Group
            key={group_id}
            className="option-group"
            onChange={checkedList =>
              this.handleCodeChange(group_type, group_id, checkedList)
            }
          >
            {event_options.map(option => (
              <Checkbox value={option.option_id} key={option.option_id}>
                {option.description}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "t":
        return (
          <Input size="small" placeholder={event_options[0].description} />
        );
      default:
        console.warn("Unknown group type: " + group_type);
    }
  };

  deleteElementOfStaging = (index) => {
    const { staging } = this.state;
    staging.splice(index, 1);
    this.setState({ staging })
  }

  handleSubmit = (index) => {
    //TODO: submit event
    this.deleteElementOfStaging(index)
  }

  renderEventSubmitButton = (item, index) => {
    return (
      <List.Item
        actions={[
          <Button
            type="primary"
            shape="circle"
            icon="save"
            onClick={() => this.handleSubmit(index)}
          />,
          <Popconfirm
            placement="top"
            title="Delete event?"
            onConfirm={() => this.deleteElementOfStaging(index)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" shape="circle" icon="delete" />
          </Popconfirm>
        ]}
      >
        <List.Item.Meta
          title={item.event_type}
          description={JSON.stringify(item.event_code)}
        />
      </List.Item>
    );
  };

  renderStaging = () => {
    const { staging } = this.state;
    return (
      <List
        size="small"
        bordered
        itemLayout="horizontal"
        dataSource={staging}
        renderItem={(item, value) => this.renderEventSubmitButton(item, value)}
      />
    );
  };

  render() {
    if (this.state.eventDefinition) {
      return (
        <Row className="event-recorder">
          <Col span={12}>
            <Card
              title="Events"
              type="inner"
              bordered
              className="children-card"
            >
              {this.state.eventDefinition.map(event => {
                const { event_id, description } = event;
                return (
                  <Button
                    type="primary"
                    block
                    key={event_id}
                    onClick={() => this.handleEventButtonClicked(event_id)}
                    className="event-button"
                  >
                    {event_id + ". " + description}
                  </Button>
                );
              })}
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Staging Area"
              type="inner"
              bordered
              className="children-card"
            >
              {this.state.staging.length === 0 ? (
                <Empty />
              ) : (
                this.renderStaging()
              )}
            </Card>
          </Col>
          {this.state.thisEventDefinition ? this.renderModal() : null}
        </Row>
      );
    } else {
      return (
        <Spin tip="Loading..." className="events-wrap">
          <Empty />
        </Spin>
      );
    }
  }
}
