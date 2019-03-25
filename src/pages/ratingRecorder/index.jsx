import React, {Component} from "react";
import {Card, Col, Icon, Row, Slider, Button, Rate, Statistic} from "antd";
import {inject, observer} from "mobx-react";
import "./index.less";

@inject("store")
@observer
export default class RatingRecorder extends Component {

  thisStore = this.props.store.RatingRecorder;

  renderIcon = () => {
    const {type, color} = this.thisStore.ratingType;
    return <Icon
      type={type}
      theme="twoTone"
      twoToneColor={color}
    />
  };

  renderRate = () => {
    const {
      ratingType,
      updateRatingLevel,
      totalLevelsCount,
      ratingLevel
    } = this.thisStore;
    const {type, color} = ratingType;
    return (
      <span className="rate-wrap">
        <Rate
          onChange={updateRatingLevel}
          onHoverChange={updateRatingLevel}
          // defaultValue={5}
          count={totalLevelsCount}
          value={ratingLevel}
          style={{color}}
          character={<Icon type={type}/>}
          allowClear={false}
        />
        {
          <span className="ant-rate-text">{`Current PCL: ${ratingLevel}`}</span>
        }
      </span>
    );
  };

  render() {
    const {
      maxLevel,
      minLevel,
      ratingLevel,
      updateRatingLevel,
      postRatingLevel,
      lastRatingLevel
    } = this.thisStore;

    return (
      <Card title="乘客舒适度等级记录" className="main card-wrap">
        <Card title="Comfort Level" type="inner" className="children-card">
          {/*<Row className="comfort-level-wrap" type="flex" justify="space-around" align="middle">*/}
            {/*<Col span={16} offset={1}>*/}
              {/*<Slider*/}
                {/*max={maxLevel}*/}
                {/*min={minLevel}*/}
                {/*onChange={updateRatingLevel}*/}
                {/*defaultValue={5}*/}
                {/*value={ratingLevel}*/}
              {/*/>*/}
            {/*</Col>*/}
            {/*<Col span={4} offset={1} className="comfort-level-icon-wrap">*/}
              {/*{this.renderIcon()}*/}
            {/*</Col>*/}
          {/*</Row>*/}
          <div className="comfort-level-submit-button-wrap">
            <Button
              type="primary"
              block
              onClick={postRatingLevel}
            >
              Submit
            </Button>
          </div>
        </Card>
        <Card title="Comfort Level 2" type="inner" className="children-card rate-card">
          {this.renderRate()}
          <div className="comfort-level-submit-button-wrap">
            <Button
              type="primary"
              block
              onClick={postRatingLevel}
            >
              Submit
            </Button>
          </div>
        </Card>
        <Card title="Statistics" type="inner" className="children-card">
          <Statistic
            title="Last PCL"
            value={lastRatingLevel}
            prefix="Level: "
            // valueStyle={{marginLeft: 30}}
          />
        </Card>
      </Card>
    );
  }
}
