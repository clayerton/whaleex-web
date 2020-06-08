import React from 'react';
import PropTypes from 'prop-types';
import { DeepBreadcrumb } from 'whaleex/components';
import { Step, Item, CopySuccess } from './style.js';
import { getColumns, scrollX, scrollY } from './columns.js';
import { M, LayoutLR, Switch, Table } from 'whaleex/components';
export default class AddressBindHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getBindHistory();
  }
  render() {
    const { nextData, goStep, bindHistory } = this.props;
    // const { pageFrom } = nextData;
    let arr = [<M id="pkAddress.user" />, <M id="pkAddress.zchistory" />];
    let actions = [this.props.urlJump.bind(null, '/user/setting')];
    // if (pageFrom === 'list') {
    //   arr = [<M id="pkAddress.bind" />, <M id="pkAddress.zchistory" />];
    //   actions = [goStep.bind(null, {}, 1)];
    // }
    return (
      <div>
        <DeepBreadcrumb arr={arr} actions={actions} />
        <Step className="AddressBindHistory">
          <Table
            columns={getColumns()}
            dataSource={bindHistory}
            pagination={false}
          />
        </Step>
      </div>
    );
  }
}

AddressBindHistory.PropTypes = {
  handler: PropTypes.function,
};
