import React, {Component} from "react";
import {Button, Card, Col, Icon, Rate, Row, Statistic} from "antd";
import {inject, observer} from "mobx-react";
import "./index.less";
import dayjs from "dayjs";

@inject("store")
@observer
export default class RatingRecorder extends Component {

  thisStore = this.props.store.RatingRecorder;

  renderRater = (ratingTypeName) => {
    const {
      updateRatingLevel, ratingLevel, totalLevelsCount,
      getEmotionalIconByLevel
    } = this.thisStore;
    const {icon, color} = getEmotionalIconByLevel(ratingTypeName);
    return <Rate
      onChange={(value) => updateRatingLevel(ratingTypeName, value)}
      onHoverChange={(value) => updateRatingLevel(ratingTypeName, value)}
      count={totalLevelsCount}
      value={ratingLevel[ratingTypeName]}
      style={{color}}
      character={<Icon type={icon}/>}
      allowClear={false}
    />
  };

  renderRatingCard = (ratingType, ratingTypeName) => {
    const {
      ratingTypeDefinition,
      postRatingLevel,
      ratingLevel,
    } = this.thisStore;
    return (
      <Card
        title={ratingTypeDefinition[ratingType - 1]}
        type="inner"
        className="children-card rating-card"
      >
        <div className="rate-wrap">
          {this.renderRater(ratingTypeName)}
          {
            <span className="ant-rate-text">
            {`Current Level: ${ratingLevel[ratingTypeName]}`}
          </span>
          }
        </div>
        <div className="rating-submit-button-wrap">
          <Button
            type="primary"
            block
            onClick={() => postRatingLevel(ratingType, ratingTypeName, "")}
          >
            Submit
          </Button>
        </div>
      </Card>
    )
  };


  render() {
    const {
      lastRatingInfo,
      ratingTypeDefinition
    } = this.thisStore;
    const lastRatingString = lastRatingInfo.type ?
      `[${dayjs.unix(lastRatingInfo.timestamp)
        .format("HH:mm:ss")}] ${ratingTypeDefinition[
          lastRatingInfo.type - 1
        ]}: ${lastRatingInfo.rating_level}`
      : "No value";
    return (
      <Card title={this.props.store.GlobalStore.appTexts.pageTitles[3]} className="main card-wrap">
        <Row className="rating-recorder">
          <Col sm={24} md={12}>
            {this.renderRatingCard(1, "passengerComfortLevel")}
          </Col>
          <Col sm={24} md={12}>
            {this.renderRatingCard(2, "driverEvaluation")}
          </Col>
          <Col span={24}>
            {this.renderRatingCard(3, "driverEmotion")}
          </Col>
          <Col span={24}>
            <Card title="Statistics" type="inner" className="children-card">
              <Statistic title="Last Rating" value={lastRatingString}/>
            </Card>
          </Col>
        </Row>
      </Card>
    );
  }
}
