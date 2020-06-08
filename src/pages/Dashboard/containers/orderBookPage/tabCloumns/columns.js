import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Table } from 'antd';

math.config({ number: 'BigNumber' });
import U from 'whaleex/utils/extends';
import { M } from 'whaleex/components';
import { injectIntl } from 'react-intl';
import { getColumns, columnsHeader } from './columns.js';
import './style.less';
const StyledOrder = styled.div`
  ${'' /* padding-left: 30px; */} width: 50%;
  min-height: 700px;
  color: #4e6a79;
  background-color: #fff;
  ${'' /* padding: 0 0 10px 20; */} box-shadow: 0 5px 6px 0 rgba(124, 166, 188, 0.17),
    2px 5px 4px 0 rgba(47, 88, 109, 0.06),
    0 13px 20px 0 rgba(108, 162, 191, 0.15);
  .asks,
  .bids {
    line-height: 44px;
    padding-left: 18px;
    border-bottom: 1px solid #eaeff2;
  }
  .asks {
    color: #44cb9c;
  }
  .bids {
    color: #f27762;
  }
`;
const StyledFlow = styled.div`
  overflow: auto;
  height: calc(100% - 73px);
  .ant-table-tbody > tr > td:first-child {
    color: #44cb9c;
  }
  .ant-table-middle
    > .ant-table-content
    > .ant-table-body
    > table
    > .ant-table-tbody
    > tr
    > td,
  .ant-table-middle
    > .ant-table-content
    > .ant-table-body
    > table
    > .ant-table-thead
    > tr
    > th {
    padding-left: 18px;
  }
`;
const Styled = styled.div`
  overflow: auto;
  height: calc(100% - 73px);
  .ant-table-tbody > tr > td:first-child {
    color: #f27762;
  }
`;
export class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { _name, list = [], colorT, type, match, partition } = this.props;
    const [baseCurrency, quoteCurrency] = (match.params.symbolStr || '').split(
      '_'
    );
    let options = [];

    const isCPU = partition === 'CPU';
    const columns = [
      {
        title: <M id="orderBookPage.pankou" />,
        dataIndex: 'pankou',
      },
      {
        title: isCPU ? (
          <M id="orderInput.rate" values={{ data: quoteCurrency }} />
        ) : (
          <M id="orderBookPage.usdt" values={{ data: quoteCurrency }} />
        ),
        dataIndex: 'Mprice',
        render: (v, i, idx) => {
          return isCPU ? U.getPercentFormat(v) : v;
        },
      },
      {
        title: isCPU ? (
          <M id="orderBookPage.eos" values={{ data: 'EOS' }} />
        ) : (
          <M id="orderBookPage.eos" values={{ data: baseCurrency }} />
        ),
        dataIndex: 'Maccount',
      },
      {
        title: <M id="orderBookPage.alleos" values={{ data: quoteCurrency }} />,
        dataIndex: 'all',
      },
    ];

    const columnsSell = [
      {
        title: <M id="orderBookPage.pankou" />,
        dataIndex: 'pankou',
      },
      {
        title: isCPU ? (
          <M id="orderInput.rate" values={{ data: quoteCurrency }} />
        ) : (
          <M id="orderBookPage.usdtSell" values={{ data: quoteCurrency }} />
        ),
        dataIndex: 'Mprice',
        render: (v, i, idx) => {
          return isCPU ? U.getPercentFormat(v) : v;
        },
      },
      {
        title: isCPU ? (
          <M id="orderBookPage.eosSell" values={{ data: 'EOS' }} />
        ) : (
          <M id="orderBookPage.eosSell" values={{ data: baseCurrency }} />
        ),
        dataIndex: 'Maccount',
      },
      {
        title: <M id="orderBookPage.alleos" values={{ data: quoteCurrency }} />,
        dataIndex: 'all',
      },
    ];

    list.map((option, key) => {
      let base = option.price;
      const precision = base.length - base.lastIndexOf('.') - 1;
      let line = {
        key: key,
        pankou: type + (key + 1),
        Mprice: option.price,
        Maccount: option.quantity,
        all: (+(
          math.eval(`${option.quantity} * ${option.price}`) + ''
        )).toFixed(precision),
      };
      options.push(line);
    });

    return (
      <StyledOrder>
        <div className={colorT}>{_name}</div>
        <StyledFlow>
          {colorT === 'asks' ? (
            <Table
              columns={columns}
              dataSource={options}
              size="middle"
              pagination={{ pageSize: 100, hideOnSinglePage: true }}
            />
          ) : (
            <Styled>
              <Table
                columns={columnsSell}
                dataSource={options}
                size="middle"
                pagination={{ pageSize: 100, hideOnSinglePage: true }}
              />
            </Styled>
          )}
        </StyledFlow>
      </StyledOrder>
    );
  }
}

List.PropTypes = {
  handler: PropTypes.function,
};
