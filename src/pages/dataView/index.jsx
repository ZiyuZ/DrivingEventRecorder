import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Button, Card, Icon, Input, Popconfirm, Table, Tooltip} from "antd";
import {CSVLink} from "react-csv";
import Highlighter from 'react-highlight-words';
import moment from "moment";
import utils from "../../utils/utils";
import "./index.less";

@inject("store")
@observer
export default class DataView extends Component {
  thisStore = this.props.store.EventDataView;
  state = {
    searchText: '',
  };

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({searchText: selectedKeys[0]});
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({searchText: ''});
  };


  getColumnSearchProps = dataIndex => {
    return {
      filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{padding: 8}}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{width: 188, marginBottom: 8, display: 'block'}}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{width: 90, marginRight: 8}}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
            Reset
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="filter" theme={filtered ? 'twoTone' : undefined} style={{color: filtered ? '#1890ff' : undefined}}/>
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
      render: text => (
        <Highlighter
          highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text === undefined ? "" : text.toString()}
        />
      ),
    }
  };

  componentDidMount = () => {
    this.thisStore.fetchAllData();
  };

  renderColumns = () => {
    const {deleteEventById, rootStore} = this.thisStore;
    const {displayEnglish} = rootStore.GlobalStore;
    const columns = [
      {
        title: "ID",
        dataIndex: "key",
        key: "key"
      },
      {
        title: displayEnglish ? "Video ID" : "视频编号",
        dataIndex: "videoID",
        key: "videoID",
        ...this.getColumnSearchProps('videoID'),
        // sorter: (a, b) => a.videoID - b.videoID
      },
      {
        title: displayEnglish ? "Date" : "日期",
        dataIndex: "date",
        key: "date",
        ...this.getColumnSearchProps('date')
      },
      {
        title: displayEnglish ? "Event Start Time" : "开始时间",
        dataIndex: "startTime",
        key: "startTime",
        ...this.getColumnSearchProps('startTime'),
        sorter: (a, b) => moment(a.startTime, "HH:mm:ss").diff(moment(b.startTime, "HH:mm:ss"))
      },
      {
        title: displayEnglish ? "Event Stop Time" : "结束时间",
        dataIndex: "stopTime",
        key: "stopTime",
        ...this.getColumnSearchProps('stopTime'),
        sorter: (a, b) => moment(a.stopTime, "HH:mm:ss").diff(moment(b.stopTime, "HH:mm:ss"))
      },
      {
        title: displayEnglish ? "Event Name" : "事件名称",
        dataIndex: "eventName",
        key: "eventName",
        ...this.getColumnSearchProps('eventName'),
      },
      {
        title: displayEnglish ? "Event Details" : "事件细节",
        dataIndex: "optionCode",
        key: "optionCode",
        ...this.getColumnSearchProps('optionCode'),
      },
      {
        title: displayEnglish ? "Note" : "备注",
        dataIndex: "desc",
        key: "desc",
      }
    ];
    const action = {
      title: rootStore.GlobalStore.displayEnglish ? "Operation" : "操作",
      key: "operation",
      render: (text, record) => {
        return <div className="table-item-operations">
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this event?"
              onConfirm={() => deleteEventById(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                className="operation-button"
                type="danger"
                icon="delete"
                size="small"
                shape="circle"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      }
    };
    return columns.concat([action]);
  };

  renderTable = () => {
    const {eventData} = this.thisStore;
    return <Table
      dataSource={eventData}
      columns={this.renderColumns()}
      loading={this.thisStore.eventQueryResult === null}
    />;
  };

  renderDownloadCSVButton = () => {
    const {eventData} = this.thisStore;
    const filename = `Event_${utils.parseTime()}.csv`;
    return <Button>
      {eventData ?
        eventData.length !== 0 ?
          <CSVLink data={eventData} filename={filename}>
            Download CSV
          </CSVLink> : "No data"
        : "Loading..."}
    </Button>
  };

  render() {
    const {renderTable} = this;
    return (
      <Card
        title={this.props.store.GlobalStore.appTexts.pageTitles[4]}
        className="main card-wrap"
        extra={this.renderDownloadCSVButton()}
      >
        {renderTable()}
      </Card>
    );
  }
}
