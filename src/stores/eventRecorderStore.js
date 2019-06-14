import {action, computed, configure, observable, runInAction, toJS} from "mobx";
import {notification} from "antd";
import Axios from "../utils/axios";
import backendConfig from "../config/backendConfig";
import utils from "../utils/utils"

configure({enforceActions: "always"});

export default class EventRecorderStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action fetchAllData = () => {
    if (!this.eventDefinition) {
      this.rootStore.EventDefinition.fecthEventDefinition();
    }
  };

  @computed get eventDefinition() {
    return this.rootStore.EventDefinition.eventDefinition;
  }

  @computed get thisEventDefinition() {
    return Object.keys(this.thisEvent).length !== 0
      ? this.findEventDefinitionByEventId(this.thisEvent.event_id)
      : null;
  }

  findEventDefinitionByEventId = event_id =>
    this.eventDefinition.find(value => value.event_id === event_id);

  // event selector
  @observable thisEvent = {
    event_id: null,
    option_code: null,
    start_time: null,
    stop_time: null,
    desc: null
  };

  @action updateThisEvent = eventProps => {
    const keys = Object.keys(eventProps);
    if (keys.length === 0) return;
    runInAction(() => {
      keys.map(key => {
        this.thisEvent[key] = eventProps[key];
        if (key === "event_id" && eventProps[key] != null) {
          this.thisEvent.option_code = Array.from({
            length: this.eventDefinition.find(
              value => value.event_id === eventProps[key]
            ).option_groups.length
          });
        }
      });
    });
  };

  @action resetThisEvent = () => {
    this.thisEvent = {
      event_id: null,
      option_code: null,
      start_time: null,
      stop_time: null,
      desc: null
    };
  };

  @action
  handleEventAddButtonClicked = event_id => {
    const {realTime} = this.rootStore.VideoBasedRecorder;
    this.updateThisEvent({
      event_id,
      start_time: realTime.format("YYYY-MM-DDTHH:mm:ssZ")
    });
    this.setModalVisible(true);
  };

  // event detail modal
  @observable modalVisible = false;

  @action setModalVisible = modalVisible => {
    if (this.rootStore.VideoBasedRecorder.playerProps.url)
      this.rootStore.VideoBasedRecorder.switchPlayingWithModalVisible(modalVisible);
    if (!modalVisible) this.resetThisEvent();
    this.modalVisible = modalVisible;
  };

  @action handleModalOk = () => {
    const {
      thisEvent,
      thisEventDefinition,
      setModalVisible,
      addThisEventIntoStaging
    } = this;
    if (
      thisEvent.option_code.some(
        (value, index) =>
          value === undefined &&
          thisEventDefinition.option_groups[index].group_type !== "c"
      )
    ) {
      notification.error({
        message: "Value Error",
        description:
          "Please ensure all radio buttons and text field are filled in."
      });
      return;
    }
    runInAction(() => {
      thisEvent.option_code = utils.flatten(thisEvent.option_code).filter(value => value);
      addThisEventIntoStaging(thisEvent);
      setModalVisible(false);
    });
  };

  @action handleCodeChange = (group_type, group_id, value) => {
    const {thisEvent} = this;
    switch (group_type) {
      case "r":
        thisEvent.option_code[group_id - 1] = value;
        break;
      case "c":
        thisEvent.option_code[group_id - 1] = value.sort();
        break;
      default:
        console.warn(`Unknown group type: ${group_type}`);
    }
  };

  @action handleDescriptionChange = value => {
    this.thisEvent.desc = value;
  };

  // staging area
  @observable staging = [];

  @action addThisEventIntoStaging = () => {
    this.staging.unshift(this.thisEvent);
    this.resetThisEvent();
  };

  @action deleteElementFromStaging = index => {
    this.staging.splice(index, 1);
  };

  @action handleSubmit = index => {
    const targetElement = toJS(this.staging[index]);
    const {realTime, videoProps} = this.rootStore.VideoBasedRecorder;
    // processing element
    targetElement.stop_time = realTime.format("YYYY-MM-DDTHH:mm:ssZ");
    targetElement.option_code = targetElement.option_code.join(",");
    targetElement.desc = targetElement.desc || "";
    targetElement.video_id = videoProps.isFrozen ? videoProps.id : -1;
    //submit event
    this.postEvent(targetElement).then(() => {
      this.deleteElementFromStaging(index);
    });
  };

  @action postEvent = event => {
    return new Promise((resolve, reject) => {
      Axios.ajax({
        url: backendConfig.eventApi,
        method: "POST",
        data: event
      }).then(res => {
        if (res.code !== 0) {
          console.error("POST EVENT FAILED!");
          reject();
        } else {
          resolve(res);
        }
      });
    });
  };
}
