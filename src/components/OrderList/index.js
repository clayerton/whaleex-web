import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import M from 'whaleex/components/FormattedMessage';

import './style.less';
const FlexItem = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  height: 22px;
  font-size: 12px;
  &:active {
    opacity: 0.5;
  }
  > div {
    z-index: 1;
    position: relative;
    overflow: hidden;
  }
`;
const FlexHeader = styled.div`
  display: flex;
  font-size: 10px;
  position: relative;
  color: #99acb6;
  padding: 6px 0;
  > div {
    z-index: 1;
    background-color: #fff;
    span {
      font-family: 'rLight';
    }
  }
`;
const BodyWrap = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
export default class OrderList extends React.Component {
  constructor(props) {
    super(props);
  }
  getAlignStyle = textAlign => {
    const textAlignStyle =
      (textAlign === 'center' && {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }) ||
      ((textAlign === 'right' && {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }) || {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      });
    return textAlignStyle;
  };
  render() {
    let {
      data,
      columns,
      header,
      filter,
      setFilter,
      style = {},
      id = '',
      display,
      className,
    } = this.props;
    if (display !== undefined && !display) {
      style = Object.assign({}, style, { display: 'none' });
    }
    const length = (data || []).length;

    return (
      <div style={style} id={id} className={className}>
        {header && (
          <FlexHeader>
            {columns.map(
              (
                {
                  title,
                  titleRender,
                  flex,
                  style = {},
                  styleFuc,
                  textAlign,
                  className,
                },
                idx
              ) => {
                const textAlignStyle = this.getAlignStyle(textAlign);
                return (
                  <div
                    key={idx}
                    className={className}
                    style={{
                      padding: '0 5px',
                      flex,
                      ...style,
                      ...((styleFuc && styleFuc()) || {}),
                      ...textAlignStyle,
                    }}
                  >
                    {title || (titleRender && titleRender(filter, setFilter))}
                  </div>
                );
              }
            )}
          </FlexHeader>
        )}
        <BodyWrap>
          {_.isEmpty(data) && data !== undefined && (
            <span>
              <M id="warning.noData" />
            </span>
          )}
          {!_.isEmpty(data) &&
            data.map((i, idx) => {
              const item = columns.map(
                (
                  {
                    key,
                    dataIndex,
                    flex,
                    render,
                    style = {},
                    styleFuc,
                    textAlign,
                    className,
                  },
                  idx2
                ) => {
                  const textAlignStyle = this.getAlignStyle(textAlign);
                  return (
                    <div
                      key={idx2}
                      className={className}
                      style={{
                        padding: '0 5px',
                        flex,
                        ...style,
                        ...((styleFuc && styleFuc(i[dataIndex])) || {}),
                        ...textAlignStyle,
                      }}
                    >
                      {render(i[dataIndex], i, idx2)}
                    </div>
                  );
                }
              );
              return (
                <FlexItem
                  key={idx}
                  className="orderbook-item"
                  data-price={i.price}
                  data-quantity={i.quantity}
                  data-askBId={(i.orderIdx > 0 && 'sell') || 'buy'}
                  data-depth={(i.orderIdx > 0 && `${idx + 1}`) || length - idx}
                >
                  {item}
                </FlexItem>
              );
            })}
        </BodyWrap>
      </div>
    );
  }
}

OrderList.PropTypes = {
  handler: PropTypes.function,
};
