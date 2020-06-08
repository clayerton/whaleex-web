import React from 'react';
import styled from 'styled-components';
import { Progress } from 'antd';
import { injectIntl } from 'react-intl';
import U from 'whaleex/utils/extends';
import M from 'whaleex/components/FormattedMessage';
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
const Line = styled.div`
  display: flex;
  justify-content: space-between;
  color: #7ea3b7;
  font-size: 12px;
`;
const StyledProgressWrap = styled.div`
  .ant-progress-inner {
    background: linear-gradient(#071822, #071a25);
  }
  .ant-progress-bg {
    height: 4px !important;
    background: linear-gradient(
      to bottom,
      #59c6ff,
      #abe1fc 9%,
      #91e1ff 26%,
      #5cc6ff 58%,
      #25698e
    );
  }
`;
class ProgressComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let {
      intl: { formatNumber },
    } = this.props;
    const { already = 0, total = Infinity, startup } = this.props.data;
    return (
      <Wrap>
        <Line>
          <M
            id="homePage.webAlreadyMine"
            values={{
              num: (startup && formatNumber(already)) || '--',
              curreny: 'WAL',
            }}
          />
          <M
            id="homePage.webTotalMine"
            values={{
              num:
                (startup &&
                  ((U.getUserLan() === 'zh' && total) || total / 10)) ||
                '--',
              curreny: 'WAL',
            }}
          />
        </Line>
        <StyledProgressWrap>
          <Progress
            percent={(already / total / Math.pow(10, 8)) * 100}
            showInfo={false}
            strokeWidth={20}
          />
        </StyledProgressWrap>
      </Wrap>
    );
  }
}
export default injectIntl(ProgressComp);
