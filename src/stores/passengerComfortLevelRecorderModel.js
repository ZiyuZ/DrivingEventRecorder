import {observable, action, configure, runInAction, computed} from "mobx";
import Axios from "../utils/axios";
import backendConfig from "../config/backendConfig";
import dayjs from "dayjs";

configure({enforceActions: "always"});

export default class PassengerComfortLevelRecorderModel {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable passengerComfortLevel = 5;
  @observable lastPassengerComfortLevel = 5;

  @computed get passengerComfortType() {
    if (this.passengerComfortLevel < 4) {
      return {type: "frown", color: "#f5222d"}
    }
    if (this.passengerComfortLevel > 6) {
      return {type: "smile", color: "#52c41a"}
    }
    return {type: "meh", color: "#faad14"}
  }

  minLevel = 1;
  maxLevel = 9;

  @computed get totalLevelsCount() {
    return this.maxLevel - this.minLevel + 1;
  }

  @action updatePassengerComfortLevel = (newLevel) => {
    if (!newLevel) return;
    this.passengerComfortLevel = newLevel;
  };

  @action postPassengerComfortLevel = () => {
    const data = {
      timestamp: dayjs().unix(),
      comfort_level: this.passengerComfortLevel
    };
    Axios.ajax({
      url: backendConfig.passengerComfortLevelApi,
      method: "POST",
      data
    }).then(
      () => {
        this.lastPassengerComfortLevel = this.passengerComfortLevel;
      }
    ).catch(res => {
      console.error(res);
    })
  }
}