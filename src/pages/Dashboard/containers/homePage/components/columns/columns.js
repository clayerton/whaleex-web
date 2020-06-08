import { unitMap } from 'whaleex/utils/dollarMap.js';
import { Icon } from 'antd';
import { StyledTitle, Arrow } from '../style.js';
import Star from 'whaleex/components/Star';
import M from 'whaleex/components/FormattedMessage';
const columnsFunc = (
  isCpuPage,
  sorter,
  params = {},
  changeSorter,
  urlJump,
  toggleSubscription
) => {
  const {
    legalTender,
    convertMap_digital,
    convertMap,
    subscription = [],
  } = params;
  let columns = [
    {
      title: (
        <StyledTitle
          onClick={changeSorter('baseCurrency')}
          style={{ justifyContent: 'flex-start', paddingLeft: 10 }}
        >
          <M id="homePage.coin" />
          <Arrow sorter={sorter['baseCurrency']}>
            <Icon type="caret-up" />
            <Icon type="caret-down" />
          </Arrow>
        </StyledTitle>
      ),
      dataIndex: 'baseCurrency',
      width: 180,
      render: (v, i) => {
        const { baseCurrency, quoteCurrency, id } = i;
        let check = false,
          clickAction = () => {
            toggleSubscription(id, true);
          };
        if (subscription.includes(`${id}`)) {
          check = true;
          clickAction = () => {
            toggleSubscription(id, false);
          };
        }
        return (
          <div
            style={{
              paddingLeft: '9px',
            }}
          >
            <Star check={check} onClick={clickAction} />
            <a
              className="no-block"
              onClick={() => {
                urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
              }}
              style={{ paddingLeft: 10 }}
            >
              <span className="symbol-style" style={{ color: '#cbdfea' }}>
                {baseCurrency}/{quoteCurrency}
              </span>
            </a>
          </div>
        );
      },
    },
    {
      title: (
        <StyledTitle onClick={changeSorter('lastPrice')}>
          {(isCpuPage && <M id="trade.interest" />) || (
            <M id="homePage.price" />
          )}
          <Arrow sorter={sorter['lastPrice']}>
            <Icon type="caret-up" />
            <Icon type="caret-down" />
          </Arrow>
        </StyledTitle>
      ),
      dataIndex: 'lastPrice',
      className: 'column-right',
      width: 190,
      render: (v, i) => {
        const { duration, baseCurrency, quoteCurrency } = i;
        if (isCpuPage) {
          return (
            <a
              onClick={() => {
                urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
              }}
            >
              <p style={{ marginBottom: -5 }}>{U.getPercentFormat(v)}</p>
              <span style={{ fontSize: 14, color: '#658697' }}>
                <span>
                  ≈
                  {(v && (((365 * 24) / duration) * 100 * v).toFixed(2)) ||
                    '--'}
                  % (<M id="orderInput.yearPercent" />)
                </span>
              </span>
            </a>
          );
        }
        if (v === '--') {
          return (
            <a
              onClick={() => {
                urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
              }}
            >
              {v}
            </a>
          );
        }
        return (
          <a
            onClick={() => {
              urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
            }}
          >
            <p style={{ marginBottom: -5 }}>{v}</p>
            <span style={{ fontSize: 14, color: '#658697' }}>
              ≈
              {`${unitMap[legalTender]}${U.formatLegalTender(
                +U.calc(
                  `${v} * ${convertMap_digital[quoteCurrency]} * ${
                    convertMap['EOS']
                  }`
                )
              )}`}
            </span>
          </a>
        );
      },
    },
    {
      title: (
        <StyledTitle onClick={changeSorter('priceChangePercent')}>
          <M id="homePage.24float" values={{ data: 24 }} />
          <Arrow sorter={sorter['priceChangePercent']}>
            <Icon type="caret-up" />
            <Icon type="caret-down" />
          </Arrow>
        </StyledTitle>
      ),
      dataIndex: 'priceChangePercent',
      className: 'column-right',
      width: 190,
      render: (v, i) => {
        const { baseCurrency, quoteCurrency } = i;
        let status = '';
        if (v > 0) {
          status = 'green';
        } else if (v < 0) {
          status = 'red';
        } else {
          status = 'white';
        }
        const color = {
          green: '#44cb9c',
          red: '#f27762',
          white: 'rgba(255, 255, 255, 0.8)',
        };
        return (
          <a
            onClick={() => {
              urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
            }}
          >
            <span style={{ color: color[status] }}>
              {U.getPercentFormatWithPlus(`${v}`)}
            </span>
          </a>
        );
      },
    },
    {
      title: (
        <StyledTitle onClick={changeSorter('high')}>
          <M id="homePage.24max" values={{ data: 24 }} />
          <Arrow sorter={sorter['high']}>
            <Icon type="caret-up" />
            <Icon type="caret-down" />
          </Arrow>
        </StyledTitle>
      ),
      dataIndex: 'high',
      className: 'column-right',
      render: (v, i) => {
        const { baseCurrency, quoteCurrency } = i;
        return (
          <a
            onClick={() => {
              urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
            }}
          >
            {(isCpuPage && U.getPercentFormat(v)) || v}
          </a>
        );
      },
    },
    {
      title: (
        <StyledTitle onClick={changeSorter('low')}>
          <M id="homePage.24min" values={{ data: 24 }} />
          <Arrow sorter={sorter['low']}>
            <Icon type="caret-up" />
            <Icon type="caret-down" />
          </Arrow>
        </StyledTitle>
      ),
      dataIndex: 'low',
      className: 'column-right',
      render: (v, i) => {
        const { baseCurrency, quoteCurrency } = i;
        return (
          <a
            onClick={() => {
              urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
            }}
          >
            {(isCpuPage && U.getPercentFormat(v)) || v}
          </a>
        );
      },
    },
    {
      title: (
        <StyledTitle
          onClick={changeSorter('baseVolume')}
          style={{ paddingRight: 32 }}
        >
          <M id="homePage.24doneVolume" values={{ data: 24 }} />
          <Arrow sorter={sorter['baseVolume']}>
            <Icon type="caret-up" />
            <Icon type="caret-down" />
          </Arrow>
        </StyledTitle>
      ),
      dataIndex: 'baseVolume',
      className: 'column-right',
      render: (v, i) => {
        const { baseCurrency, quoteCurrency } = i;
        return (
          <a
            onClick={() => {
              urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
            }}
            style={{ paddingRight: 32 }}
          >
            {v}
          </a>
        );
      },
    },
    //24H成交额
    // {
    //   title: (
    //     <StyledTitle onClick={changeSorter('quoteVolume')}>
    //       <M id="homePage.24done" values={{ data: 24 }} />
    //       <Arrow sorter={sorter['quoteVolume']}>
    //         <Icon type="caret-up" />
    //         <Icon type="caret-down" />
    //       </Arrow>
    //     </StyledTitle>
    //   ),
    //   dataIndex: 'quoteVolume',
    //   render: (v, i) => {
    //     const { baseCurrency, quoteCurrency } = i;
    //     return (
    //       <span
    //         onClick={() => {
    //           urlJump(`/trade/${baseCurrency}_${quoteCurrency}`);
    //         }}
    //       >
    //         {v}
    //       </span>
    //     );
    //   },
    // },
  ];
  return columns;
};
export default columnsFunc;
