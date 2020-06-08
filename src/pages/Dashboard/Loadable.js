//TODO lz delete?
import Loadable from 'react-loadable';

import Loader from 'dyc/components/Loader';

export default Loadable({
  loader: () => import('./index'),
  loading: Loader,
});
