import { M } from 'whaleex/components';
import React from 'react';
import PropTypes from 'prop-types';

export default class AddressBinding extends React.Component {
  render() {
    return (
      <div>
        <div>
          <div>
            <M id="pkAddress.binding" />
          </div>
          <div>
            <M id="pkAddress.yz" values={{ data: '0-X' }} />
          </div>
        </div>
        <div>
          <div>0-0-0</div>
        </div>
      </div>
    );
  }
}

AddressBinding.PropTypes = {
  handler: PropTypes.function,
};
