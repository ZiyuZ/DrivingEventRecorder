export default {
  backend: `http://${process.env.NODE_ENV === 'development' ?
    window.location.hostname + ":10500" : window.location.host}`,
  dataStorageApi: "/data",
  cnipApi: "/api/cnip",
  lnipApi: "/api/lnip",
  eventDefinitionApi: "/api/storage/definition",
  dataFileTreeApi: "/api/storage/file_tree",
  eventApi: "/api/event",
  ratingApi: "/api/rating",
  videoListApi: "/api/videos",
  videoDatesApi: "/api/video_dates",
  videoApi: "/api/video",
  trajectoryListApi: "/api/trajectories",
  trajectoryApi: "/api/trajectory"
};