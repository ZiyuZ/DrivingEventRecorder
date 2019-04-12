import {action, configure, observable, runInAction} from "mobx";
import Axios from "../utils/axios";
import backendConfig from "../config/backendConfig";

configure({ enforceActions: "always" });

export default class EventDefinitionStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable eventDefinition = null;

  @action fecthEventDefinition = () => {
    return new Promise((resolve, reject) => {
      Axios.ajax({
        url: backendConfig.eventDefinitionApi,
        method: "GET"
      }).then(
        res => {
          runInAction(() => {
            this.eventDefinition = res.data;
          });
          resolve(res);
        },
        error => {
          console.error(error);
          reject();
        }
      );
    });
  };
}
