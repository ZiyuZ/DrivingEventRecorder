import GlobalStore from "./globalStore";
import EventDefinition from "./eventDefinitionModel";
import EventRecorder from "./eventRecorderModel";
import EventDataViewModel from "./eventDataViewModel";
import PassengerComfortLevelRecorderModel from "./passengerComfortLevelRecorderModel";

class RootStore {
  constructor () {
    this.GlobalStore = new GlobalStore(this);
    this.EventDefinition = new EventDefinition(this);
    this.EventRecorder = new EventRecorder(this);
    this.EventDataView = new EventDataViewModel(this);
    this.PassengerComfortLevel = new PassengerComfortLevelRecorderModel(this);
  }
}

export default new RootStore();