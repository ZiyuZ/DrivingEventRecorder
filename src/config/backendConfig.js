export default {
  backendApi: `http://${process.env.NODE_ENV === 'development' ?
    window.location.hostname + ":5000" : window.location.host}/api`,
  eventApi: "/event",
  eventDefinitionApi: "/event_definition",
  ratingApi: "/rating",
  videoListApi: "/video_list",
  backendVideoURL: `http://${process.env.NODE_ENV === 'development' ?
    window.location.hostname + ":5000" : window.location.host}/video`,
};