import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('whaleex/common'),
  loading: () => null,
});

export {};
