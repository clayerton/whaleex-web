
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { Spin } from 'antd';
import { withRouter, Route } from 'react-router-dom';
import Kline from './components/kline';
import { getKlineData } from './actions';
const StyledDiv = styled.div`
  height: 100%;
  width: 100%;
`;
export class KlineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getKlineData();
  }
  componentWillReceiveProps(nextProps) {}

  render() {
    const { match: { params: { id: dashboardId }, path }, store } = this.props;
    const { loadingItems, data } = store;
    return (
      <StyledDiv>
        {!_.isEmpty(data) && <Kline data={data} loading={!!loadingItems} />}
        <Spin size="large" spinning={!!loadingItems} />
      </StyledDiv>
    );
  }
}

KlineChart.propTypes = {};

// 通常直接用reducer里面的selector即可，但是这里需要添加和管理某个dashboard下的卡片，所以需要接触边上的store
export function mapStateToProps(state) {
  return state.get('pages').klineChart.toJS();
}

export const mapDispatchToProps = {
  getKlineData,
};

export const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRouter, withConnect)(KlineChart);
