
export const formatTime = (timestamp, type) => {
  if (type === '0-0-0 0:0:0') {
    return moment(+timestamp).format('YY-MM-DD HH:mm:ss');
  } else if (type === '0/0/0 0:0:0') {
    return moment(+timestamp).format('YY/MM/DD HH:mm:ss');
  }
};
