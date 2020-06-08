const getDepositStep = (item, formatMessage) => {
  let currentStep = 0;
  const steps = [
    {
      key: formatMessage({ id: 'depoWithDetail.deposiAwaitSure' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'depoWithDetail.deposiASureSuccess' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'depoWithDetail.dataAsync' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'depoWithDetail.depositSuccess' }),
      time: null,
    },
  ];
  switch (item.status) {
    case 'PENDING_CONFIRM':
      steps[0].time = item.createTime;
      currentStep = 0;
      break;
    case 'SUCCESS':
    case 'FAILURE':
      steps[0].time = item.createTime;
      steps[1].time = item.pendingTime;
      currentStep = 1;
      break;
    case 'SYNC_START':
      steps[0].time = item.createTime;
      steps[1].time = item.pendingTime;
      steps[2].time = item.syncRequestTime;
      currentStep = 2;
      break;
    case 'SYNC_SUCCESS':
      steps[0].time = item.createTime;
      steps[1].time = item.pendingTime;
      steps[2].time = item.syncRequestTime;
      steps[3].time = item.syncSuccessTime;
      currentStep = 3;
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
  steps: getDepositStep,
};
