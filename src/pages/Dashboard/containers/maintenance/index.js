import React from 'react';
import { FormattedMessage } from 'react-intl';
import { M } from 'whaleex/components';
import '../notFound/style.less';
const img = _config.cdn_url+'/web-static/imgs/web/system/maintenance.png';
export class Maintenance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="notfoud-fault">
        <div>
          <div className="bigImg">
            <img src={img} />
          </div>
          <div className="fault-tips">
            <span className="bigText">
              <M id="extend.maintenance" />:)
            </span>
            <span>
              <M id="extend.maintenanceTips" />～
            </span>
          </div>
        </div>
      </div>
    );
  }
}
export default Maintenance;
