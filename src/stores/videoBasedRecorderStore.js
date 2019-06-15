import {action, computed, configure, observable, runInAction} from "mobx";
import {notification} from 'antd';
import Axios from "../utils/axios"
import backendConfig from "../config/backendConfig";
import moment from "moment";

configure({enforceActions: "always"});

export default class VideoBasedRecorderStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable videoFilterDate = null;
  @observable videoDates = null;

  @observable videoList = null;
  @observable videoPropEditorModalVisible = false;
  @observable videoFilterModalVisible = false;

  @action updateVideoFilterDate = (date) => {
    this.videoFilterDate = date;
    this.videoProps = {
      id: null,
      file_name: null,
      path: null,
      begin_time: null,
      end_time: null,
      type: null,
      video_gps_time_diff: 0,
      status: -1,
      playbackTime: null,
      isFrozen: false,
    };
  };


  @observable videoProps = {
    id: null,
    file_name: null,
    path: null,
    begin_time: null,
    end_time: null,
    type: null,
    video_gps_time_diff: 0,
    status: -1,
    playbackTime: null,
    isFrozen: false,
  };

  @computed get videoStatusSteps() {
    return this.rootStore.GlobalStore.displayEnglish ? [
      {statusCode: 0, desc: 'Pending',},
      {statusCode: 1, desc: 'Entering Events'},
      {statusCode: 2, desc: 'Waiting for review'},
      {statusCode: 3, desc: 'Reviewing'},
      {statusCode: 4, desc: 'Review done'}
    ] : [
      {statusCode: 0, desc: '待处理',},
      {statusCode: 1, desc: '正在录入事件信息'},
      {statusCode: 2, desc: '录入完毕, 等待检查'},
      {statusCode: 3, desc: '正在检查事件信息'},
      {statusCode: 4, desc: '检查完毕'}
    ];
  }


  @action releaseVideo = () => {
    runInAction(() => {
      this.videoProps.isFrozen = false;
      this.videoProps.playbackTime = null;
      this.playerProps.url = null;
      // this.playerProps.playbackRate = 1.0;
      this.playerVerticalFlip = false;
      this.playerHorizontalFlip = false;
    });
  };

  @observable playerVerticalFlip = false;
  @observable playerHorizontalFlip = false;

  @action changePlayerFlip = (flipType, flipValue) => {
    if (!flipValue) flipValue = !this[flipType];
    this[flipType] = flipValue;
  };

  @computed get playerFlipStyle() {
    return {
      transform: `scale(${this.playerHorizontalFlip ? -1 : 1}, ${this.playerVerticalFlip ? -1 : 1})`,
      backgroundColor: "#000"
    }
  }

  @action updatePlaybackRate = value => {
    const playbackRate = parseFloat(value);
    if (isNaN(playbackRate) || playbackRate < 0.1 || playbackRate > 5.0) {
      notification.error({
        message: "Value Error",
        description: `Invalid playback rate : ${value}. It should be a number between 0.1 and 5.0.`
      });
      this.playerProps.playbackRate = 1.0;
    } else {
      this.playerProps.playbackRate = playbackRate;
    }
  };

  @action switchPlaying = value => {
    this.playerProps.playing = value === undefined ? !this.playerProps.playing : value;
  };

  @observable lastPlayingState = null;
  @action switchPlayingWithModalVisible = modalVisible => {
    if (modalVisible) {
      this.lastPlayingState = this.playerProps.playing;
      this.switchPlaying(false);
    } else {
      this.switchPlaying(this.lastPlayingState);
    }
  };

  @computed get realTime() {
    const {begin_time, playbackTime} = this.videoProps;
    return begin_time && playbackTime !== null ? begin_time.add(playbackTime, 'seconds') : null;
  }

  @action updateVideoProp = (key, value) => {
    if (key.toLowerCase() === 'id' && this.videoProps.id !== value) {
      const {ID, file_name, path, begin_time, end_time, video_gps_time_diff, type, status} = this.videoList.find(item => item.ID === value);
      this.videoProps = {
        id: ID,
        file_name,
        path,
        begin_time: moment(begin_time),
        end_time: moment(end_time),
        type,
        video_gps_time_diff,
        status
      };
    }
    this.videoProps[key] = value;
  };

  @observable
  playerProps = {
    url: null,
    playing: false,
    loop: false,
    controls: true,
    volume: 1.0,
    muted: false,
    playbackRate: 1,
    height: "40vh",
    style: {margin: "auto"},
    progressInterval: 1000,
    pip: false,
    onReady: () => {
    },
    onStart: () => {
    },
    onPlay: () => {
      this.switchPlaying(true);
    },
    onProgress: (e) => {
      this.updateVideoProp('playbackTime', e.playedSeconds);
    },
    onDuration: (duration) => {
      notification.open({
        message: `Video Loaded (Duration: ${duration.toFixed()}s)`,
        description: `Start playing video to record events.`
      })
    },
    onPause: (e) => {
      runInAction(() => {
        this.updateVideoProp('playbackTime', e.target.currentTime);
        this.switchPlaying(false);
      });
    },
    onEnded: () => {
    },
    onError: (err) => {
      console.error("Error: " + JSON.stringify(err))
    },
    onSeek: (playbackTime) => {
      this.updateVideoProp('playbackTime', playbackTime);
    }
  };

  @action loadVideo = () => {
    const {file_name, path} = this.videoProps;
    if (!file_name || !path) {
      notification.error({
        message: "ValueError",
        description: "Invalid video!"
      });
      return;
    }
    runInAction(() => {
      this.playerProps.url = `${backendConfig.backend}${backendConfig.dataStorageApi}${path}`;
      this.videoProps.isFrozen = true;
    });
  };

  @action fetchVideoList = () => {
    const params = this.videoFilterDate ? {
      from: this.videoFilterDate.format('YYYY-MM-DD'),
      to: this.videoFilterDate.clone().add(1, 'day').format('YYYY-MM-DD')
    } : undefined;
    Axios.ajax({
      url: backendConfig.videoListApi,
      method: "GET",
      params
    }).then((res) => {
      runInAction(() => {
        this.videoList = res.data || [];
      })
    })
  };

  @action fetchVideoDates = () => {
    Axios.ajax({
      url: backendConfig.videoDatesApi,
      method: "GET"
    }).then((res) => {
      runInAction(() => {
        this.videoDates = res.data || [];
      })
    })
  };

  @action switchVideoPropEditorModalVisible = () => {
    if (this.videoPropEditorModalVisible) {
      // reset video props
      const {video_gps_time_diff, type, status} = this.videoList.find(item => item.ID === this.videoProps.id);
      this.updateVideoProp('video_gps_time_diff', video_gps_time_diff);
      this.updateVideoProp('type', type);
      this.updateVideoProp('status', status);
    }
    this.videoPropEditorModalVisible = !this.videoPropEditorModalVisible;
  };

  @action switchVideoFilterModalVisible = () => {
    this.videoFilterModalVisible = !this.videoFilterModalVisible;
  };


  @action putVideoProp = () => {
    const {id, file_name, path, begin_time, end_time, type, video_gps_time_diff, status} = this.videoProps;
    const rawProp = this.videoList.find((value) => value.ID === id);
    if (type === rawProp.type && video_gps_time_diff === rawProp.video_gps_time_diff && status === rawProp.status) {
      notification.error({message: "No props has been updated."});
      return;
    }
    const videoPropSubmit = {
      ID: id,
      file_name,
      path,
      begin_time: begin_time.format('YYYY-MM-DDTHH:mm:ssZ'),
      end_time: end_time.format('YYYY-MM-DDTHH:mm:ssZ'),
      type,
      video_gps_time_diff,
      status
    };
    Axios.ajax({
      url: backendConfig.videoApi,
      method: "PUT",
      data: videoPropSubmit
    }).then(() => {
      runInAction(() => {
        this.fetchVideoList();
        this.videoPropEditorModalVisible = !this.videoPropEditorModalVisible;
      })
    });
  };
}
