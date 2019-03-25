import React, {Component} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import App from "./App";
import Home from "./pages/home";
import VideoBasedRecorder from "./pages/videoBasedRecorder";
import RealTimeRecorder from "./pages/realTimeRecorder";
import DataView from "./pages/dataView";
import RatingRecorder from "./pages/ratingRecorder";

import {Provider} from "mobx-react";
import store from "./stores";

export default class router extends Component {
  renderRoutes = () => (
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/recorder/video_based" component={VideoBasedRecorder}/>
      <Route path="/recorder/real_time" component={RealTimeRecorder}/>
      <Route path="/recorder/rating" component={RatingRecorder}/>
      <Route path="/recorder/data_view" component={DataView}/>
    </Switch>
  );

  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <App>
            <Route path="/" render={this.renderRoutes}/>
          </App>
        </Provider>
      </BrowserRouter>
    );
  }
}
