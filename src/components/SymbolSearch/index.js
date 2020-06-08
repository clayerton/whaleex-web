import React from 'react';
import PropTypes from 'prop-types';
import { StyledStyled, Option } from './style.js';
import M from 'whaleex/components/FormattedMessage';
export default class SymbolSearch extends React.Component {
  constructor(props) {
    super(props);
    const { symbols, symbolId } = props;
    let defaultPartition = U.getSearch('partition') || 'EOS';
    let defaultSymbolId = symbolId || U.getSearch('symbolId');
    if (defaultSymbolId) {
      defaultPartition = (
        symbols.filter(({ id }) => id === defaultSymbolId)[0] || {}
      ).partition;
    }
    const isAll = defaultSymbolId === 'all';
    this.state = (isAll && {
      curPartition: 'all',
      curSymbolId: 'all',
    }) || {
      curPartition: defaultPartition,
      curSymbolId: defaultSymbolId,
    };
  }
  onPartitionChange = curPartition => {
    if (curPartition === 'all') {
      this.setState({ curPartition: 'all', curSymbolId: 'all' });
      this.props.onChangeSymbol('all');
      return;
    }
    const { symbolPartition, symbols } = this.props;
    const { id: symbolId } =
      symbols.filter(({ partition }) => partition === curPartition)[0] || {};
    this.setState({ curPartition, curSymbolId: symbolId });
    this.props.onChangeSymbol(symbolId);
  };

  onSymbolChange = symbolId => {
    this.setState({ curSymbolId: symbolId });
    this.props.onChangeSymbol(symbolId);
  };
  render() {
    const { symbolPartition, symbols, publicSymbolObj } = this.props;
    const { curSymbolId } = this.state;
    const { baseCurrency, quoteCurrency, partition } =
      publicSymbolObj[curSymbolId] || {};
    const { curPartition = partition } = this.state;
    // const quoteOptions = quotable.map(({ id, shortName }) => (
    //   <Option key={`${id}`}>{shortName}</Option>
    // ));
    // const baseOptions = symbolsObj[quoteId].map(({ baseCurrency, id }) => (
    //   <Option key={`${id}`}>{baseCurrency}</Option>
    // ));

    // baseOptions.unshift(
    //   <Option key={'all'}>
    //     <M id="components.all" />
    //   </Option>
    // );

    let optionList1 = symbolPartition.map((i, idx) => {
      const { id, name, partition } = i;
      if (!!_.find(symbols, ['partition', partition])) {
        return <Option key={`${partition}`}>{name}</Option>;
      }
      return null;
    });
    optionList1.unshift(
      <Option key={'all'}>
        <M id="components.all" />
      </Option>
    );
    const optionList2 = symbols
      .filter(({ partition }) => partition === curPartition)
      .map((i, idx) => {
        const { id, baseCurrency, quoteCurrency, partition } = i;
        return (
          <Option key={`${id}`}>
            {baseCurrency} / {quoteCurrency}
          </Option>
        );
      });
    return (
      <div>
        {(curPartition !== 'all' && (
          <StyledStyled
            size="small"
            style={{ width: 150 }}
            value={`${baseCurrency} / ${quoteCurrency}`}
            onChange={this.onSymbolChange}
          >
            {optionList2}
          </StyledStyled>
        )) ||
          null}{' '}
        <StyledStyled
          size="small"
          style={{ width: 110 }}
          value={`${curPartition}`}
          onChange={this.onPartitionChange}
        >
          {optionList1}
        </StyledStyled>
      </div>
    );
  }
}

SymbolSearch.PropTypes = {
  handler: PropTypes.function,
};
