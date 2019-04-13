import {action, computed, configure, observable, runInAction} from "mobx";
import Axios from "../utils/axios";
import backendConfig from "../config/backendConfig";
import dayjs from "dayjs";

configure({enforceActions: "always"});

export default class RatingRecorderStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable ratingLevel = [5, 5, 0, 0, 0, 0];

  @computed get raterDefinition() {
    const {displayEnglish} = this.rootStore.GlobalStore;
    return [
      {
        id: 0,
        raterName: displayEnglish ? "Passenger Comfort Level" : "乘客舒适度等级",
        type: "rate",
        levels: 9
      },
      {
        id: 1,
        raterName: displayEnglish ? "Passenger Evaluation of Drivers" : "乘客对驾驶员评价",
        type: "rate",
        levels: 9
      },
      {
        id: 2,
        raterName: displayEnglish ? "Driver Emotion-Anger to Pleasure" : "驾驶员情绪-愤怒到愉悦",
        type: "radio",
        levels: [-2, -1, 0, 1, 2]
      },
      {
        id: 3,
        raterName: displayEnglish ? "Driver Emotion-Drowsy to Awake" : "驾驶员情绪-困倦到清醒",
        type: "radio",
        levels: [-2, -1, 0, 1, 2]
      },
      {
        id: 4,
        raterName: displayEnglish ? "Driver Emotion-Anxiety to Ease" : "驾驶员情绪-焦躁到轻松",
        type: "radio",
        levels: [-2, -1, 0, 1, 2]
      },
      {
        id: 5,
        raterName: displayEnglish ? "Driver Emotion-Not smooth to smooth" : "驾驶员情绪-不顺利到顺利",
        type: "radio",
        levels: [-2, -1, 0, 1, 2]
      }
    ]
  };
  @observable lastRatingInfo = {
    type: null,
    timestamp: null,
    rating_level: null,
    description: null
  };

  getEmotionalIconByLevel = (raterID) => {
    if (this.raterDefinition[raterID].type !== "rate") {
      console.error("Not Rate Type");
      return
    }
    const thisLevel = this.ratingLevel[raterID];
    if (thisLevel < 4) {
      return {icon: "frown", color: "#f5222d"}
    }
    if (thisLevel > 6) {
      return {icon: "smile", color: "#52c41a"}
    }
    return {icon: "meh", color: "#faad14"}
  };

  @action updateRatingLevel = (raterID, newLevel) => {
    if (newLevel && raterID) this.ratingLevel[raterID] = newLevel;
  };

  @action postRatingLevel = (raterID, description) => {
    if (!this.ratingLevel[raterID]) return;
    const data = {
      type: raterID,
      timestamp: dayjs().unix(),
      rating_level: this.ratingLevel[raterID],
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
    )
  }
}