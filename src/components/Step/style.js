import { Alert, Timeline } from 'antd';
const TimeItem = Timeline.Item;
import styled from 'styled-components';
export const StyledTimeItem = styled(TimeItem)`
  .text {
    color: ${props => props.textColor};
  }
  .ant-timeline-item-tail {
    border-color: ${props => props.color};
  }
`;

export const StepsBar = styled.div`
  /* width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center; */
  .chainStep {
    .ant-steps-item-process,
    .ant-steps-item-finish {
      .ant-steps-item-description {
        color: #7d878e;
      }
      .ant-steps-item-title {
        color: #69afd4;
      }
      .ant-steps-item-icon {
        > .ant-steps-icon {
          .ant-steps-icon-dot {
            background: #699db9;
          }
        }
      }
    }

    .ant-steps-item-wait {
      .ant-steps-item-title {
        color: #92a9b5;
      }
      .ant-steps-item-icon {
        > .ant-steps-icon {
          .ant-steps-icon-dot {
            background: #eaeff2;
          }
        }
      }
    }

    &.ant-steps-vertical {
      .ant-steps-item-tail {
        margin: 0;
        left: -6px;
        top: 9px;
        padding: 8px 0 0px;
      }
      .ant-steps-item-tail:after {
        width: 3px;
      }
      .ant-steps-item-process {
        .ant-steps-icon-dot {
          left: 0;
        }
      }
    }

    &.ant-steps-horizontal {
      .ant-steps-item-content {
        margin-left: 48%;
      }
      .ant-steps-item-tail {
        width: 105%;
        left: -6px;
        top: 6px;
        margin: 0 0px 0 53%;
      }
      .ant-steps-item-tail:after {
        height: 3px;
      }
    }

    .ant-steps-item-icon,
    .ant-steps-dot .ant-steps-item-process .ant-steps-item-icon {
      width: 15px !important;
      height: 15px !important;
    }

    .ant-steps-item-wait .ant-steps-item-icon {
      background: #eaeff2;
    }
    .ant-steps-item-wait .ant-steps-item-tail:after,
    .ant-steps-item-process > .ant-steps-item-tail:after {
      background: #eaeff2;
    }
    .ant-steps-item-finish > .ant-steps-item-tail:after {
      background: #699db9 !important;
    }
    .ant-steps-item {
      height: 70px;
    }
    .ant-steps-item-title {
      width: 100%;
      font-size: 12px;
      text-align: left;
      font-weight: 400;
    }
    .ant-steps-item-description {
      font-size: 12px;
      margin-top: 2px;
    }

    .ant-steps-horizontal .ant-steps-item-title {
      width: 100%;
      text-align: center;
    }
    .ant-steps-item-title {
      white-space: nowrap;
    }

    /* .ant-steps-item-process > .ant-steps-item-content > .ant-steps-item-title,
    .ant-steps-item-finish > .ant-steps-item-content > .ant-steps-item-title,
    .ant-steps-item-finish
      > .ant-steps-item-content
      > .ant-steps-item-description,
    .ant-steps-item-process
      > .ant-steps-item-content
      > .ant-steps-item-description {
      color: #5d97b6;
      font-weight: 500;
    } */
  }
`;
