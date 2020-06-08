import React from 'react';
const DefaultIcon = _config.cdn_url + '/web-static/imgs/logo/default-coin.png';
export default class Coin extends React.Component {
  render() {
    const { icon } = this.props;
    return (
      <img
        src={icon || DefaultIcon}
        onError={function(e) {
          e.target.src = DefaultIcon;
        }}
        width="20"
        height="20"
      />
    );
  }
}
