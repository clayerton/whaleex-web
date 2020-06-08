import M from 'whaleex/components/FormattedMessage';
export const typeOptions = {
  WAL: [
    // {
    //   key: 'all',
    //   label: <M id="depoWithList.all" />,
    //   query: 'DEPOSIT,WITHDRAW,MINE,REBEAT,INVITE,REGISTER,GROUP,RECEIVE',
    // },
    // { key: 'mine', label: <M id="depoWithList.mine" />, query: 'MINE' },
    {
      key: 'all',
      label: <M id="depoWithList.all" />,
      query: 'DEPOSIT,WITHDRAW', //DEPOSIT 包含了AIRDROP和DEPOSIT
    },
    {
      key: 'deposit',
      label: <M id="depoWithList.deposit" />,
      query: 'DEPOSIT',
    },
    {
      key: 'withdraw',
      label: <M id="depoWithList.withdraw" />,
      query: 'WITHDRAW',
    },
  ],
  default: [
    {
      key: 'all',
      label: <M id="depoWithList.all" />,
      query: 'DEPOSIT,WITHDRAW',
    },
    {
      key: 'deposit',
      label: <M id="depoWithList.deposit" />,
      query: 'DEPOSIT',
    },
    {
      key: 'withdraw',
      label: <M id="depoWithList.withdraw" />,
      query: 'WITHDRAW',
    },
  ],
};
export function getTypeOptions(currency = 'WAL') {
  if (currency.toUpperCase() === 'WAL') {
    return typeOptions['WAL'];
  } else {
    return typeOptions['default'];
  }
}
export function getQuery(currencySelect, typeSelect) {
  let currency = currencySelect;
  if (currencySelect !== 'WAL') {
    currency = 'default';
  }
  const options = typeOptions[currency];
  return options.filter(({ key }) => {
    return key === typeSelect;
  })[0].query;
}
