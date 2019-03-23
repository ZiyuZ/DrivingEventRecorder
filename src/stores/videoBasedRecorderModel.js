import {observable, action, computed, configure, toJS, runInAction} from "mobx";
import {notification} from 'antd';
import Axios from "../utils/axios"
import backendConfig from "../config/backendConfig";
import dayjs from "dayjs";

configure({enforceActions: "always"});

export default class VideoBasedRecorderModel {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable videoList = null;

  @action fetchVideoList = () => {
    Axios.ajax({
      url: backendConfig.videoListApi,
      method: "GET"
    }).then((res) => {
      runInAction(() => {
        this.videoList = res.data;
      })
    })
  };

  @observable videoProps = {
    name: null,
    baseTime: null,
    playbackTime: null,
    isFrozen: false,
  };

  @action updateVideoProp = (videoProp) => {
    this.videoProps[videoProp.key] = videoProp.value;
  };

  @action loadVideo = () => {
    console.log(this.videoProps);
    const {name, baseTime} = this.videoProps;
    if (!name || !baseTime) {
      notification.error({
        message: "ValueError",
        description: "Invalid video name or time!"
      });
      return;
    }
    runInAction(() => {
      this.playerProps.url = `${backendConfig.backendVideoURL}/${this.videoProps.name}`;
      this.videoProps.isFrozen = true;
    });
  };

  @action releaseVideo = () => {
    runInAction(() => {
      this.videoProps.isFrozen = false;
      this.videoProps.playbackTime = null;
      this.playerProps.url = null;
    });
  };

  @computed get realTime() {
    const {baseTime, playbackTime} = this.videoProps;
    return baseTime && playbackTime ? dayjs(baseTime).add(playbackTime, 's') : null;
  }

  @computed get realTimeString() {
    return this.realTime ? this.realTime.format("YY-MM-DD HH:mm:ss") : "No value";
  }

  @observable
  playerProps = {
    url: null,
    playing: false,
    loop: false,
    controls: true,
    volume: 0.5,
    muted: false,
    playbackRate: 1,
    // width: "100%",
    height: "40vh",
    style: {margin: "auto"},
    progressInterval: 1000,
    pip: false,
    onReady: () => {
    },
    onStart: () => {
    },
    onPlay: () => {
    },
    onProgress: (e) => {
      this.updateVideoProp({
        key: 'playbackTime',
        value: e.playedSeconds
      });
      // console.log(e)
    },
    onDuration: (duration) => {
      notification.open({
        message: `Video Loaded (Duration: ${duration.toFixed()}s)`,
        description: `Start playing video to record events.`
      })
    },
    onPause: () => {
    },
    onEnded: () => {
    },
    onError: (err) => {
      console.log(err)
    }
  }

}
