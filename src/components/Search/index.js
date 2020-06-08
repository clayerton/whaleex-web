import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
const Search = Input.Search;
import './style.less';

export default class SearchCustom extends React.Component {
  render() {
    const { placeholder, width = 200, onSearch } = this.props;
    return (
      <Search
        placeholder={placeholder}
        onSearch={value => {
          onSearch(value);
        }}
        onChange={e => {
          onSearch(e.target.value);
        }}
        style={{ width }}
      />
    );
  }
}

SearchCustom.PropTypes = {
  handler: PropTypes.function,
};
