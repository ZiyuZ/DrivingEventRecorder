import {action, computed, configure, observable, runInAction} from "mobx";
import backendConfig from "../config/backendConfig";
import Axios from "../utils/axios";
import utils from "../utils/utils"

configure({enforceActions: "always"});

export default class EventDataViewStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed get eventDefinition() {
    return this.rootStore.EventDefinition.eventDefinition;
  }

  @computed get eventData() {
    return this.eventQueryResult && this.eventQueryResult.map(this.parseEvent);
  }

  @observable eventQueryResult = null;

  findEventDefinitionByEventId = event_id =>
    this.eventDefinition.find(value => value.event_id === event_id);

  parseEvent = event => {
    const {
      ID,
      event_id,
      option_code,
      start_time,
      stop_time,
      desc,
      video_id
    } = event;
    const descIndex = this.rootStore.GlobalStore.displayEnglish ? 1 : 0;
    //parse event code
    const thisEventDefinition = this.findEventDefinitionByEventId(event_id);
    const thisEventOptions = utils.flatten(thisEventDefinition.option_groups
      .map(value => value.options));
    const eventCodeList = option_code.split(",").map(code => {
      code = parseInt(code);
      return thisEventOptions.find(value => value.option_id === code)
        .desc[descIndex];
    });
    return {
      key: ID,
      videoID: video_id === -1 ? "-" : video_id,
      date: utils.parseTime(start_time, true, false),
      startTime: utils.parseTime(start_time, false, true),
      stopTime: utils.parseTime(stop_time, false, true),
      eventName: thisEventDefinition.desc[descIndex],
      optionCode: eventCodeList.join(", "),
      desc: desc
    };
  };

  @action fetchEventData = () => {
    const {videoProps} = this.rootStore.VideoBasedRecorder;
    const params = videoProps.isFrozen ? {
      video_id: videoProps.id
    } : undefined;

    Axios.ajax({
      url: backendConfig.eventApi,
      method: "GET",
      params
    }).then(res => {
      runInAction(() => {
        this.eventQueryResult = res.data;
      });
    });
  };

  @action fetchAllData = () => {
    if (!this.eventDefinition) {
      this.rootStore.EventDefinition.fecthEventDefinition().then(() => {
        this.fetchEventData();
      });
    } else {
      this.fetchEventData();
    }
  };

  @action deleteEventById = (id) => {
    Axios.ajax({
      url: backendConfig.eventApi,
      method: "DELETE",
      params: {id}
    }).then(() => {
      runInAction(() => {
        this.eventQueryResult = this.eventQueryResult.filter(event => event.ID !== id);
      })
    });
  };
}
