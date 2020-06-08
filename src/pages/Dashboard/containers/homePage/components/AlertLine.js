import React from 'react';
import _ from 'lodash';
import M from 'whaleex/components/FormattedMessage';
import { AlertMsg } from './style.js';
let timer = undefined;
export default class AlertLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curNoticeIndex: 0,
    };
  }
  componentDidMount() {
    this.loopNotice();
  }
  componentWillUnmount() {
    clearTimeout(timer);
  }
  loopNotice = () => {
    clearTimeout(timer);
    const { noticeList = [] } = this.props;
    const { curNoticeIndex } = this.state;
    this.setState({
      curNoticeIndex:
        (curNoticeIndex + 1) % Math.ceil(noticeList.length / 3) || 0,
    });
    timer = setTimeout(() => {
      !_config.stop_request_roll && this.loopNotice();
    }, 5000);
  };
  render() {
    const { curNoticeIndex } = this.state;
    const { noticeList = [], activityList = [] } = this.props;
    const list = noticeList.concat(activityList);
    const arr = _.fill(Array(3), 2);
    const listFilter = list.slice(curNoticeIndex * 3, curNoticeIndex * 3 + 3);

    if (list.length > 0) {
      return (
        <AlertMsg>
          {arr.map((i, idx) => {
            const item = listFilter[idx];
            if (
              !item ||
              !item.title ||
              !(item.title || '').replace(/\s/g, '')
            ) {
              return <span className="alert-msg" key={idx} />;
            }
            const { url, title, type } = item; //ANNOUNCEMENT ACTIVITY
            return (
              <a href={url} rel="nofollow" target="_blank" key={idx} className="alert-msg">
                【<M id={'homePage.' + type.toLowerCase()} />】{title}
              </a>
            );
          })}
        </AlertMsg>
      );
    }
    return (
      <AlertMsg>
        <span className="alert-msg" />
      </AlertMsg>
    );
  }
}
