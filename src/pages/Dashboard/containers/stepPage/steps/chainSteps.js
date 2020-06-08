const getChainStep = (item, formatMessage) => {
  let currentStep = 0;
  let steps = [
    {
      key: formatMessage({ id: 'chainStatus.waitChain' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'chainStatus.chaining' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'chainStatus.waiting' }),
      time: null,
      reason: null,
    },
    {
      key: formatMessage({ id: 'chainStatus.waitSuccess' }),
      time: null,
    },
  ];

  switch (item.status) {
    case 'INITIAL':
    case 'WAITING':
      currentStep = 0;
      steps[0].time = item.waitingTime;
      break;
    case 'PENDING_CONFIRM':
      currentStep = 1;
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      break;
    case 'CONFIRMED':
    case 'BALANCE_WAITING':
    case 'BALANCE_PENDING_CONFIRM':
      currentStep = 2;
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      steps[2].time = item.balancePendingConfirmTime;
      break;
    case 'SUCCESS':
      currentStep = 3;
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      steps[2].time = item.balancePendingConfirmTime;
      steps[3].time = item.successTime;
      break;
    case 'FAILURE':
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      steps[2].reason = item.reason;
      currentStep = 2;
      break;
  }
  return {
    steps,
    currentStep,
  };
};
export default {
  steps: getChainStep,
};
