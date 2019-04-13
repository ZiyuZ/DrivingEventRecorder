export default {
  backendApi: process.env.NODE_ENV === 'development' ?
    `http://${window.location.hostname}:5000/api` : `http://${window.location.host}/api`,
  eventApi: "/event",
  eventDefinitionApi: "/event_definition",
  ratingApi: "/rating",
  videoListApi: "/video_list",
  backendVideoURL: process.env.NODE_ENV === 'development' ?
    `http://${window.location.hostname}:5000/video` : `http://${window.location.host}/api`,
};