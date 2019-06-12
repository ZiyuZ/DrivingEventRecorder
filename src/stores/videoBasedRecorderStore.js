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

  @observable videoList = null;

  @action fetchVideoList = () => {
    Axios.ajax({
      url: backendConfig.videoListApi,
      method: "GET"
    }).then((res) => {
      runInAction(() => {
        this.videoList = res.data || [];
      })
    })
  };

  @observable videoProps = {
    id: null,
    file_name: null,
    path: null,
    begin_time: null,
    end_time: null,
    type: null,
    video_gps_time_diff: 0,
    playbackTime: null,
    isFrozen: false,
  };
  @observable videoPropEditorDrawerVisible = false;
  @observable videoPropEditableFields = {
    type: null,
    video_gps_time_diff: null
  };

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
    return begin_time && playbackTime ? moment(begin_time).add(playbackTime, 's').toISOString() : null;
  }

  @action updateVideoProp = videoProp => {
    if (videoProp.key.toLowerCase() === 'id' && this.videoProps.id !== videoProp.value) {
      const {ID, file_name, path, begin_time, end_time, video_gps_time_diff, type} = this.videoList.find(value => value.ID === videoProp.value);
      this.videoProps = {
        id: ID,
        file_name,
        path,
        begin_time: moment(begin_time),
        end_time: moment(end_time),
        type,
        video_gps_time_diff
      }
    }
    this.videoProps[videoProp.key] = videoProp.value;
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
      this.updateVideoProp({
        key: 'playbackTime',
        value: e.playedSeconds
      });
    },
    onDuration: (duration) => {
      notification.open({
        message: `Video Loaded (Duration: ${duration.toFixed()}s)`,
        description: `Start playing video to record events.`
      })
    },
    onPause: (e) => {
      runInAction(() => {
        this.updateVideoProp({
          key: 'playbackTime',
          value: e.target.currentTime
        });
        this.switchPlaying(false);
      });
    },
    onEnded: () => {
    },
    onError: (err) => {
      console.error("Error: " + JSON.stringify(err))
    },
    onSeek: (playbackTime) => {
      this.updateVideoProp({
        key: 'playbackTime',
        value: playbackTime
      });
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

  @action updateVideoPropEditedFields = (key, value) => {
    this.videoPropEditableFields[key] = value;
  };

  @action switchVideoPropEditorDrawerVisible = () => {
    this.videoPropEditorDrawerVisible = !this.videoPropEditorDrawerVisible;
  };

  @action putVideoProp = () => {
    const {id, file_name, path, begin_time, end_time, type, video_gps_time_diff} = this.videoProps;
    const {type: newType, video_gps_time_diff: newDt} = this.videoPropEditableFields;
    if (newType === null && newDt === null || type === newType && video_gps_time_diff === newDt) {
      notification.error({message: "No props has been updated."});
      return;
    }
    const videoPropSubmit = {
      ID: id,
      file_name,
      path,
      begin_time: begin_time.format('YYYY-MM-DDTHH:mm:ssZ'),
      end_time: end_time.format('YYYY-MM-DDTHH:mm:ssZ'),
      type: newType === null ? type : newType,
      video_gps_time_diff: newDt === null ? video_gps_time_diff : newDt
    };
    Axios.ajax({
      url: backendConfig.videoApi,
      method: "PUT",
      data: videoPropSubmit
    }).then(() => {
      runInAction(() => {
        this.fetchVideoList();
        this.switchVideoPropEditorDrawerVisible();
      })
    });
  };
}
