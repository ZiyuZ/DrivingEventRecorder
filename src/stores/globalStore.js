import { observable, action, configure } from "mobx";

configure({ enforceActions: "always" });

export default class GlobalStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable selectedPageId = ["0"];

  @action changeSelectedPageId = key => {
    this.selectedPageId = [key];
  };
}
