import GlobalStore from "./globalStore";
import EventDefinition from "./eventDefinitionModel";
import EventRecorder from "./eventRecorderModel";
import EventDataView from "./eventDataViewModel";
import PassengerComfortLevelRecorder from "./passengerComfortLevelRecorderModel";
import VideoBasedRecorder from "./videoBasedRecorderModel"

class RootStore {
  constructor () {
    this.GlobalStore = new GlobalStore(this);
    this.EventDefinition = new EventDefinition(this);
    this.EventRecorder = new EventRecorder(this);
    this.EventDataView = new EventDataView(this);
    this.PassengerComfortLevel = new PassengerComfortLevelRecorder(this);
    this.VideoBasedRecorder = new VideoBasedRecorder(this);
  }
}

export default new RootStore();