import { Steps, Popover } from 'antd';
import PropTypes from 'prop-types';
const StepItem = Steps.Step;
import { Timeline } from 'antd';
const TimeItem = Timeline.Item;
import { StyledTimeItem, StepsBar } from './style.js';

class Step extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    const { steps, currentStep, direction } = this.props;
    return (
      <StepsBar>
        <Steps
          current={currentStep}
          direction={direction}
          progressDot
          className="chainStep"
        >
          {steps.map((i, idx) => {
            const { label, key, time } = i; //string react node(<span>{string}</span>)
            const getTime =
              U.getTime(time) === '--'
                ? ''
                : moment(time).format('YYYY/MM/DD HH:mm:ss');
            return <StepItem key={idx} title={key} description={getTime} />;
          })}
        </Steps>

        {/*<Timeline>
          steps.map((i, idx) => {
            const { key, time, reason } = i;
            const activeStatus = idx <= currentStep;
            let color = (activeStatus && '#5d97b6') || '#eaeff2';
            let textColor = (activeStatus && '#69afd4') || '#92a9b5';
            return (
              <StyledTimeItem
                key={idx}
                color={color}
                textColor={textColor}
                className={(activeStatus && 'active') || 'not-active'}
              >
                <span className="text">{key}</span>
                <div />
                <span>{U.getTime(time) === '--' ? '' : U.getTime(time)}</span>
              </StyledTimeItem>
            );
          })}
        </Timeline>*/}
      </StepsBar>
    );
  }
}

export default Step;
