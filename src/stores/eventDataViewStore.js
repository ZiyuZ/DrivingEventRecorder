import {action, computed, configure, observable, runInAction} from "mobx";
import backendConfig from "../config/backendConfig";
import Axios from "../utils/axios";
import dayjs from "dayjs";
import utils from "../utils/utils"

configure({enforceActions: "always"});

export default class EventDataViewStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key"
    },
    {
      title: "日期",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime"
    },
    {
      title: "结束时间",
      dataIndex: "stopTime",
      key: "stopTime"
    },
    {
      title: "事件类型",
      dataIndex: "eventType",
      key: "eventType"
    },
    {
      title: "事件描述",
      dataIndex: "eventCode",
      key: "eventCode"
    },
    {
      title: "备注",
      dataIndex: "description",
      key: "description"
    }
  ];

  @computed get eventDefinition() {
    return this.rootStore.EventDefinition.eventDefinition;
  }

  @observable eventData = null;

  findEventDefinitionByEventId = event_id =>
    this.eventDefinition.find(value => value.event_id === event_id);

  parseEvent = event => {
    const {
      id,
      event_id,
      event_code,
      start_timestamp,
      stop_timestamp,
      description
    } = event;
    //parse event code
    const thisEventDefinition = this.findEventDefinitionByEventId(event_id);
    const thisEventOptions = utils.flatten(thisEventDefinition.event_option_groups
      .map(value => value.event_options));
    const eventCodeList = event_code.split(",").map(code => {
      code = parseInt(code);
      return thisEventOptions.find(value => value.option_id === code)
        .description;
    });
    return {
      key: id,
      date: dayjs.unix(start_timestamp).format("YYYY-MM-DD"),
      startTime: dayjs.unix(start_timestamp).format("HH:mm:ss"),
      stopTime: dayjs.unix(stop_timestamp).format("HH:mm:ss"),
      eventType: thisEventDefinition.description,
      eventCode: eventCodeList.join(", "),
      description
    };
  };

  @action fetchEventData = () => {
    Axios.ajax({
      url: backendConfig.eventApi,
      method: "GET"
    }).then(res => {
      runInAction(() => {
        this.eventData = res.data.map(this.parseEvent);
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
        this.eventData = this.eventData.filter(event => event.key !== id);
      })
    });
  }
}
