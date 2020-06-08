const getSellRentStep = (item, formatMessage) => {
  let currentStep = 0;
  let steps = [
    {
      key: formatMessage({ id: 'cpuRent.waiting' }),
      time: null,
    },
    {
      key: formatMessage({ id: 'cpuRent.pending' }),
      time: null,
    },
    {
      key: formatMessage({
        id: 'cpuRent.balance_pending_waiting',
      }),
      time: null,
      reason: null,
    },
    {
      key: formatMessage({
        id: 'cpuRent.balance_step_1',
      }),
      time: null,
    },
    {
      key: formatMessage({
        id: 'cpuRent.balance_step_2',
      }),
      time: null,
    },
    {
      key: formatMessage({
        id: 'cpuRent.balance_step_3',
      }),
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
    case 'PENDING_CONFIRM_DELEGATE':
      currentStep = 2;
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      steps[2].time = item.balancePendingConfirmTime;
      break;
    case 'CONFIRMED_DELEGATE':
    case 'PENDING_CONFIRM_UNDELEGATE':
      currentStep = 3;
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      steps[2].time = item.balancePendingConfirmTime;
      steps[3].time = item.delegateTime;
      break;
    case 'CONFIRMED_UNDELEGATE':
    case 'PENDING_CONFIRM_REFUND':
      currentStep = 4;
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      steps[2].time = item.balancePendingConfirmTime;
      steps[3].time = item.delegateTime;
      steps[4].time = item.undelegateTime;
      break;
    case 'CONFIRMED_REFUND':
      currentStep = 5;
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      steps[2].time = item.balancePendingConfirmTime;
      steps[3].time = item.delegateTime;
      steps[4].time = item.undelegateTime;
      steps[5].time = item.refundTime;
      break;
    case 'FAILURE':
      steps[0].time = item.waitingTime;
      steps[1].time = item.pendingConfirmTime;
      steps[2].reason = item.reason;
      currentStep = 2;
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
  steps: getSellRentStep,
};
