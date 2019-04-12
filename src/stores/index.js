import GlobalStore from "./globalStore";
import EventDefinition from "./eventDefinitionStore";
import EventRecorder from "./eventRecorderStore";
import EventDataView from "./eventDataViewStore";
import RatingRecorder from "./ratingRecorderStore";
import VideoBasedRecorder from "./videoBasedRecorderStore"

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