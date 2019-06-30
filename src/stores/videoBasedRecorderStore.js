import {action, computed, configure, observable, runInAction} from "mobx";
import {notification} from 'antd';
import Axios from "../utils/axios"
import backendConfig from "../config/backendConfig";
import moment from "moment";
import {Base64} from 'js-base64';

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
  @observable videoPropVerificationModalVisible = false;

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
    recorder: '',
    reviewer: ''
  };

  @computed get videoStatusSteps() {
    return this.rootStore.GlobalStore.displayEnglish ? [
      {statusCode: 0, desc: 'Unprocessed',},
      {statusCode: 1, desc: 'Collecting events'},
      {statusCode: 2, desc: 'Finish Collecting'},
      {statusCode: 3, desc: 'Reviewing'},
      {statusCode: 4, desc: 'Finish Reviewing'}
    ] : [
      {statusCode: 0, desc: '待处理',},
      {statusCode: 1, desc: '正在录入'},
      {statusCode: 2, desc: '录入完毕'},
      {statusCode: 3, desc: '正在检查'},
      {statusCode: 4, desc: '检查完毕'}
    ];
  }

  @computed get realTime() {
    const {begin_time, playbackTime} = this.videoProps;
    // 在进行 moment().add() 时需要 clone(), 否则会修改原值
    return begin_time && playbackTime !== null ? begin_time.clone().add(playbackTime, 'seconds') : null;
  }

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

  @observable permissionVerificationInformation = {ID: '', token: ''};

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

  @action releaseVideo = () => {
    runInAction(() => {
      this.videoProps.isFrozen = false;
      this.videoProps.playbackTime = null;
      this.playerProps.url = null;
      // this.playerProps.playbackRate = 1.0;
      this.playerVerticalFlip = false;
      this.playerHorizontalFlip = false;
      this.fetchVideoList();
    });
  };

  @action updateVideoProp = (key, value) => {
    if (key.toLowerCase() === 'id' && this.videoProps.id !== value) {
      const {ID, file_name, path, begin_time, end_time, video_gps_time_diff, type, status, recorder, reviewer} = this.videoList.find(item => item.ID === value);
      this.videoProps = {
        id: ID,
        file_name,
        path,
        begin_time: moment(begin_time),
        end_time: moment(end_time),
        type,
        video_gps_time_diff,
        status,
        recorder,
        reviewer
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
    const {file_name, path, begin_time, end_time} = this.videoProps;
    if (!file_name || !path) {
      notification.error({
        message: "Invalid video",
        description: "A valid file name or path is missing. Please check if you have selected a video."
      });
      return;
    }
    if (!moment.isMoment(begin_time) || !moment.isMoment(end_time)) {
      notification.error({
        message: "Invalid datetime",
        description: "A valid datetime is missing. Please check if you have selected datetime."
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

  @computed get OYX() {
    const {ID, token} = this.permissionVerificationInformation;
    return ID && Base64.encode(ID) === token;
  }

  @action updatePlaybackRate = value => {
    const playbackRate = parseFloat(value);
    if (isNaN(playbackRate) || playbackRate < 0.5 || playbackRate > 2.5) {
      notification.error({
        message: "Value Error",
        description: `Invalid playback rate : ${value}. It should be a number between 0.5 and 2.5.`
      });
      this.playerProps.playbackRate = 1.0;
    } else {
      this.playerProps.playbackRate = playbackRate;
    }
  };

  @action switchVideoPropVerificationModalVisible = () => {
    this.videoPropVerificationModalVisible = !this.videoPropVerificationModalVisible;
  };

  @action setPropUpdateVerifyField = (k, v) => {
    this.permissionVerificationInformation[k] = v;
  };

  @action putVideoProp = () => {
    const {id, file_name, path, begin_time, end_time, type, video_gps_time_diff, status, recorder, reviewer} = this.videoProps;
    const rawProp = this.videoList.find((value) => value.ID === id);
    if (
      type === rawProp.type &&
      video_gps_time_diff === rawProp.video_gps_time_diff &&
      status === rawProp.status &&
      recorder === rawProp.recorder &&
      reviewer === rawProp.reviewer
    ) {
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
      status,
      recorder,
      reviewer
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
