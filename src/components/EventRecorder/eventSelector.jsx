import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Button, Card} from "antd";

@inject("store")
@observer
export default class EventSelector extends Component {
  thisStore = this.props.store.EventRecorder;

  renderEventButton = e => (
    <Button
      type="primary"
      block
      key={e.event_id}
      onClick={() => this.thisStore.handleEventAddButtonClicked(e.event_id)}
      className="event-button"
    >
      {`${e.event_id}. ${e.desc[this.thisStore.rootStore.GlobalStore.displayEnglish ? 1 : 0]}`}
    </Button>
  );

  renderEventButtons = () =>
    this.thisStore.eventDefinition.map(this.renderEventButton);

  render() {
    return this.thisStore.eventDefinition ? (
      <Card title={this.thisStore.rootStore.GlobalStore.displayEnglish ? "Events" : "事件"} type="inner" bordered
            className="children-card">
        {this.renderEventButtons()}
      </Card>
    ) : null;
  }
}
