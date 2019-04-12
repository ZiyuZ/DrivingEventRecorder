import {action, configure, observable, runInAction} from "mobx";
import Axios from "../utils/axios";
import backendConfig from "../config/backendConfig";
import dayjs from "dayjs";

configure({enforceActions: "always"});

export default class RatingRecorderStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  ratingTypeDefinition = ["PassengerComfortLevel", "DriverEvaluation", "DriverEmotion"];
  totalLevelsCount = 9;

  @observable ratingLevel = {
    passengerComfortLevel: 5,
    driverEvaluation: 5,
    driverEmotion: 5
  };
  @observable lastRatingInfo = {
    type: null,
    timestamp: null,
    rating_level: null,
    description: null
  };

  getEmotionalIconByLevel = (ratingTypeName) => {
    const thisLevel =  this.ratingLevel[ratingTypeName];
    if (thisLevel < 4) {
      return {icon: "frown", color: "#f5222d"}
    }
    if (thisLevel > 6) {
      return {icon: "smile", color: "#52c41a"}
    }
    return {icon: "meh", color: "#faad14"}
  };

  @action updateRatingLevel = (ratingTypeName, newLevel) => {
    if (!newLevel || !ratingTypeName) return;
    this.ratingLevel[ratingTypeName] = newLevel;
  };

  @action postRatingLevel = (ratingType, ratingTypeName, description) => {
    if (!this.ratingLevel[ratingTypeName]) return;
    const data = {
      type: ratingType,
      timestamp: dayjs().unix(),
      rating_level: this.ratingLevel[ratingTypeName],
      description
    };
    console.log(data);
    Axios.ajax({
      url: backendConfig.ratingApi,
      method: "POST",
      data
    }).then(() => {
        runInAction(() => {
          this.lastRatingInfo = data;
        })
      }
    ).catch(res => {
      console.error(res);
    })
  }
}