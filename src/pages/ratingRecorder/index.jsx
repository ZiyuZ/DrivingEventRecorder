import React, {Component} from "react";
import {Button, Card, Col, Icon, Radio, Rate, Row, Statistic} from "antd";
import {inject, observer} from "mobx-react";
import "./index.less";
import dayjs from "dayjs";

@inject("store")
@observer
export default class RatingRecorder extends Component {

  thisStore = this.props.store.RatingRecorder;

  renderRater = (rater) => {
    const {
      updateRatingLevel, ratingLevel, getEmotionalIconByLevel
    } = this.thisStore;
    if (rater.type === "rate") {
      const {icon, color} = getEmotionalIconByLevel(rater.id);
      return <Rate
        onChange={(value) => updateRatingLevel(rater.id, value)}
        onHoverChange={(value) => updateRatingLevel(rater.id, value)}
        count={rater.levels}
        value={ratingLevel[rater.id]}
        style={{color}}
        character={<Icon type={icon}/>}
        allowClear={false}
      />
    } else {
      return (
        <Radio.Group
          value={ratingLevel[rater.id]}
          onChange={(e) => updateRatingLevel(rater.id, e.target.value)}
        >
          {rater.levels.map(
            (level, index) => <Radio value={level} key={index}>{level}</Radio>)
          }
        </Radio.Group>
      );
    }
  };

  renderRaterCard = (rater) => {
    const {
      raterDefinition,
      postRatingLevel,
      ratingLevel,
    } = this.thisStore;
    const {displayEnglish} = this.thisStore.rootStore.GlobalStore;
    return (
      <Col sm={24} md={12} key={rater.id}>
        <Card
          title={raterDefinition[rater.id].raterName}
          type="inner"
          className="children-card rating-card"
        >
          <div className="rate-wrap">
            {this.renderRater(rater)}
            {
              <span className="ant-rate-text">
                {`${displayEnglish ? "Current Level" : "当前等级"}: ${ratingLevel[rater.id]}`}
              </span>
            }
          </div>
          <div className="rating-submit-button-wrap">
            <Button
              type="primary"
              block
              onClick={() => postRatingLevel(rater.id, "")}
            >
              {displayEnglish ? "Submit" : "提交"}
            </Button>
          </div>
        </Card>
      </Col>
    )
  };

  renderRaters = () => {
    const {raterDefinition} = this.thisStore;
    return raterDefinition.map(this.renderRaterCard);
  };


  render() {
    const {lastRatingInfo, raterDefinition} = this.thisStore;
    const {displayEnglish} = this.thisStore.rootStore.GlobalStore;
    const lastRatingString = lastRatingInfo.type ?
      `[${
        dayjs.unix(lastRatingInfo.timestamp).format("HH:mm:ss")
        }] ${
        raterDefinition[lastRatingInfo.type]
        }: ${
        lastRatingInfo.rating_level
        }`
      : "No value";
    return (
      <Card title={this.props.store.GlobalStore.appTexts.pageTitles[3]} className="main card-wrap">
        <Row className="rating-recorder">
          {this.renderRaters()}
          <Col span={24}>
            <Card title={displayEnglish ? "Statistics" : "统计信息"} type="inner" className="children-card">
              <Statistic title={displayEnglish ? "Last Rating" : "上次评价"} value={lastRatingString}/>
            </Card>
          </Col>
        </Row>
      </Card>
    );
  }
}
