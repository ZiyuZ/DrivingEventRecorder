import {action, computed, configure, observable} from "mobx";
import {message} from "antd";

configure({enforceActions: "always"});

export default class GlobalStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable selectedPageId = ["/"];

  @action changeSelectedPageId = key => {
    this.selectedPageId = [key];
  };

  @observable displayEnglish = true;

  @computed get appTexts() {
    return this.displayEnglish ? {
      AppName: "Event Recorder",
      pageTitles: ["Home", "Video Event", "Real-Time Event", "Real-Time Scoring", "Data View"]
    } : {
      AppName: "驾驶事件记录器",
      pageTitles: ["首页", "视频事件", "实时事件", "评分", "数据视图"]
    };
  }

  @computed get pagesMetaInfo() {
    const {pageTitles} = this.appTexts;
    return [
      {
        id: 0,
        pageTitle: pageTitles[0],
        pageUrl: "/",
        icon: "home"
      },
      {
        id: 1,
        pageTitle: pageTitles[1],
        pageUrl: "/recorder/video_based",
        icon: "video-camera"
      },
      {
        id: 2,
        pageTitle: pageTitles[2],
        pageUrl: "/recorder/real_time",
        icon: "dashboard"
      },
      {
        id: 3,
        pageTitle: pageTitles[3],
        pageUrl: "/recorder/rating",
        icon: "team"
      },
      {
        id: 4,
        pageTitle: pageTitles[4],
        pageUrl: "/recorder/data_view",
        icon: "area-chart"
      },
    ];
  }

  @action initSelectedPageId = () => {
    this.changeSelectedPageId(document.location.pathname);
  };

  @action switchLang = (mode) => {
    this.displayEnglish = !this.displayEnglish;
    mode === "init" || message.success(this.displayEnglish ? "Language switch successfully" : "语言切换成功");
  };
}
