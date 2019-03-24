import {observable, action, configure} from "mobx";

configure({enforceActions: "always"});

export default class GlobalStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable selectedPageId = ["/"];

  @action changeSelectedPageId = key => {
    this.selectedPageId = [key];
  };

  @action initSelectedPageId = () => {
    this.changeSelectedPageId(document.location.pathname);
  }
}
