import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";
import Home from "./pages/home";
import VideoBasedRecorder from "./pages/videoBasedRecorder";
import RealTimeRecorder from "./pages/realTimeRecorder";
import Events from './pages/events';

export default class router extends Component {
  render() {
    return (
      <BrowserRouter>
        <App>
          <Route
            path="/"
            render={() => {
              return (
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route
                    path="/recorder/video_based"
                    component={VideoBasedRecorder}
                  />
                  <Route
                    path="/recorder/real_time"
                    component={RealTimeRecorder}
                  />
                  <Route
                    path="/recorder/events"
                    component={Events}
                  />
                </Switch>
              );
            }}
          />
        </App>
      </BrowserRouter>
    );
  }
}
