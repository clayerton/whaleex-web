import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';
// import get from 'lodash/get';
import reducerInjectrors from 'utils/reducerInjectors';
import sagaInjectors from 'utils/sagaInjectors';
import { ONCE_TILL_UNMOUNT } from 'utils/constants';
import { getRemoteCard } from 'utils/config';

// const defaultMapStateToProps = (state) => state;
const mapStateToProps = (state, { uid }) => {
  const {
    component: { mapStateToProps: mapStateToPropsForCard },
    reducerKey,
  } = uidMap[uid];
  const stateForCard = state.getIn(['cards', uid]);
  // if (!stateForCard) return {};
  if (!mapStateToPropsForCard) return stateForCard.get(reducerKey);
  return mapStateToPropsForCard(stateForCard);
};

const getDispatchToProps = (actions, uid) => (dispatch) => {
  // 定制dispatch, 注入uid
  const dis = (action) => {
    if (typeof action === 'object') dispatch({ ...action, uid });
    else action(dis);
  };
  const re = Object.keys(actions)
    .filter((name) => typeof actions[name] === 'function')
    .reduce((actionsBinded, name) => {
      const result = { ...actionsBinded };
      result[name] = bindActionCreators(actions[name], dis);
      return result;
    }, {});

  re.actions = { ...re };
  re.dispatch = dispatch;

  return re;
};

// 用我们的mapStateToProps, mapDispatchToProps来重新绑定组件类
const conn = (Comp, actions, id) =>
  connect(mapStateToProps, getDispatchToProps(actions, id))(Comp);

const cardReducer = (stateDefault = fromJS({}), action) => {
  let state = stateDefault; // To resolve eslint no-param-reassign
  const uid = action.uid;
  if (!uid) return state;
  const { reducer: reducerForCard, reducerKey } = uidMap[uid];
  const stateGlobleFake = state.get(uid);
  if (!stateGlobleFake) state = state.set(uid, fromJS({}));
  const stateForCard = state.getIn([uid, reducerKey]);
  state = state.setIn([uid, reducerKey], reducerForCard(stateForCard, action));
  return state;
};

// use doImport.bind(import('reducer'), import('actions'), import('componet'), className, type)
/**
 doImport(id, store).then(Comp => {...}.catch(console.error));
*/
if(!window.uidMap) window.uidMap = {}; //uid得在container和其他产品卡片加载上下文中共享

const combineComponent = (imports, componentName, type, uid, store) => {
  const { injectReducer } = reducerInjectrors(store);
  const { injectSaga } = sagaInjectors(store);
  const { reducer = (state) => state, actions = {}, component, saga } = imports;

  if (!store.injectedReducers.cards) {
    injectReducer('cards', cardReducer);
  }

  uidMap[uid] = {
    reducer: reducer.default || reducer,
    component,
    reducerKey: type,
  };
  store.dispatch({ type: '@@INIT', uid });

  if (saga) {
    injectSaga(componentName, {
      saga: saga.default || saga,
      mode: ONCE_TILL_UNMOUNT,
    });
  }

  return conn(component[componentName], actions.default || actions, uid);
};

const makeInnerComponent = (module, uid, store) => {
  const { importConfig, configs = {} } = module.default;
  const { imports, componentName, componentType } = importConfig;
  const InnerComponent = combineComponent(
    imports,
    componentName,
    componentType,
    uid,
    store
  );

  return {
    InnerComponent,
    configs,
  };
};

export default (type, uid, store, version) =>
  getRemoteCard(type, version).then((module) => makeInnerComponent(module, uid, store));
