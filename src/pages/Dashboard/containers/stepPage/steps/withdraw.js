const getWithdrawStep = (item, formatMessage) => {
  let currentStep = 0;
  const steps = [
    {
      key: formatMessage({ id: 'depoWithDetail.fqtb' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'depoWithDetail.tjqq' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'depoWithDetail.eoszl' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'depoWithDetail.dataAsync' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'depoWithDetail.tbdz' }),
      time: null,
    },
  ];
  switch (item.status) {
    case 'INITIAL':
      steps[0].time = item.createTime;
      currentStep = 0;
      break;
    case 'WAITING':
    case 'PENDING_CONFIRM':
    case 'CONFIRMED':
      steps[0].time = item.createTime;
      steps[1].time = item.confirmTime || item.pendingTime || item.waitingTime;
      currentStep = 1;
      break;
    case 'BALANCE_WAITING':
    case 'BALANCE_PENDING_CONFIRM':
      steps[0].time = item.createTime;
      steps[1].time = item.confirmTime;
      steps[2].time = item.balanceTime || item.confirmTime;
      currentStep = 2;
      break;
    case 'SUCCESS':
    case 'SYNC_START':
      steps[0].time = item.createTime;
      steps[1].time = item.confirmTime;
      steps[2].time = item.balanceTime;
      steps[3].time = item.syncRequestTime || item.balanceTime;
      currentStep = 3;
      break;
    case 'SYNC_SUCCESS':
      steps[0].time = item.createTime;
      steps[1].time = item.confirmTime;
      steps[2].time = item.balanceTime;
      steps[3].time = item.syncRequestTime;
      steps[4].time = item.syncSuccessTime;
      currentStep = 4;
      break;
    case 'FAILURE':
      steps[0].time = item.createTime;
      // steps[1].reason = item.reason;
      currentStep = 1;
      break;
    default:
      break;
  }
  return {
    steps,
    currentStep,
  };
};
export default {
  steps: getWithdrawStep,
};
