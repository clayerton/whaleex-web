import M from 'whaleex/components/FormattedMessage';

export const getColumns = that => {
  return [
    {
      title: <M id="invite.yhm" />,
      dataIndex: 'phone',
      width: 150,
      render: (v, i) => {
        return (
          <span className="flex">
            <label>
              {i.level === 1 ? (
                <i
                  className="iconfont icon-invite_icon_yijiyaoq"
                  style={{ color: '#6597b8', fontSize: '12px' }}
                />
              ) : (
                ''
              )}
            </label>
            {v}
          </span>
        );
      },
    },
    {
      key: 'createdTime',
      dataIndex: 'createdTime',
      width: 130,
      align: 'center',
      title: <M id="invite.zcsj" />,
      render: (v, i) => {
        return <span className="font1">{moment(+v).format('YYYY/MM/DD')}</span>;
      },
    },
    {
      key: 'eosBind',
      dataIndex: 'eosBind',
      width: 120,
      align: 'center',
      title: <M id="pkAddress.goBindAccount" />,
      render: (v, i) => {
        return (
          <span>
            {v ? (
              <i
                className="iconfont icon-kyc_icon_success"
                style={{ color: '#5acb99', fontSize: '14px' }}
              />
            ) : (
              ''
            )}
          </span>
        );
      },
    },
    {
      key: 'kyc',
      dataIndex: 'kyc',
      width: 90,
      align: 'center',
      title: <M id="user.userAuth" />,
      render: (v, i) => {
        return (
          <span>
            {v ? (
              <i
                className="iconfont icon-kyc_icon_success"
                style={{ color: '#5acb99', fontSize: '14px' }}
              />
            ) : (
              ''
            )}
          </span>
        );
      },
    },
    {
      key: 'inviteReward',
      dataIndex: 'inviteReward',
      width: 130,
      align: 'right',
      title: <M id="invite.jlfs" values={{ data: 'WAL' }} />,
      render: (v, i) => {
        // const map = {
        //   INVITE: <M id="position.INVITE" />,
        //   REBATE: <M id="position.REBATE" />,
        //   REGISTER: <M id="position.REGISTER" />,
        //   MINE: <M id="position.TRADE" />,
        //   RECEIVE: <M id="position.RECEIVE" />,
        //   GROUP: <M id="position.GROUP" />,
        // };
        return <span className="font2">{v}</span>;
      },
    },
    {
      dataIndex: 'rebateReward',
      title: <M id="invite.alljl" values={{ data: 'WAL' }} />,
    },
  ];
};
