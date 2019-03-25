import GlobalStore from "./globalStore";
import EventDefinition from "./eventDefinitionModel";
import EventRecorder from "./eventRecorderModel";
import EventDataView from "./eventDataViewModel";
import RatingRecorder from "./ratingRecorderModel";
import VideoBasedRecorder from "./videoBasedRecorderModel"

class RootStore {
  constructor () {
    this.GlobalStore = new GlobalStore(this);
    this.EventDefinition = new EventDefinition(this);
    this.VideoBasedRecorder = new VideoBasedRecorder(this);
    this.EventRecorder = new EventRecorder(this);
    this.RatingRecorder = new RatingRecorder(this);
    this.EventDataView = new EventDataView(this);
  }
}

export default new RootStore();