import {observable, action, configure, runInAction, computed} from "mobx";
import Axios from "../utils/axios";
import backendConfig from "../config/backendConfig";
import dayjs from "dayjs";

configure({enforceActions: "always"});

export default class RatingRecorderModel {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable ratingLevel = 5;
  @observable lastRatingLevel = 5;

  @computed get ratingType() {
    if (this.ratingLevel < 4) {
      return {type: "frown", color: "#f5222d"}
    }
    if (this.ratingLevel > 6) {
      return {type: "smile", color: "#52c41a"}
    }
    return {type: "meh", color: "#faad14"}
  }

  minLevel = 1;
  maxLevel = 9;

  @computed get totalLevelsCount() {
    return this.maxLevel - this.minLevel + 1;
  }

  @action updateRatingLevel = (newLevel) => {
    if (!newLevel) return;
    this.ratingLevel = newLevel;
  };

  @action postRatingLevel = () => {
    const data = {
      timestamp: dayjs().unix(),
      comfort_level: this.ratingLevel
    };
    Axios.ajax({
      url: backendConfig.ratingLevelApi,
      method: "POST",
      data
    }).then(() => {
        runInAction(() => {
          this.lastRatingLevel = this.ratingLevel;
        })
      }
    ).catch(res => {
      console.error(res);
    })
  }
}