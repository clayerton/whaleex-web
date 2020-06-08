import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Popover, Icon, Input, message } from 'antd';
import EmptyState from './EmptyState';

import {
  Card,
  Head,
  HeadTitle,
  HeadOperations,
  Body,
  StyledInput,
  IconWrapperLink,
} from './style';

export const enhance = (WrappedComponent) =>
  class extends React.Component {
    constructor(props) {
      super(props);
      // TODO MUTUAL-10004502为什么会出现没有data
      const { params, name, canConfig, canDelete, data = {} } = this.props;
      this.state = {
        params,
        name: data.name || name,
        canConfig,
        canDelete,
        runtime: {
          isAlertVisible: false,
          isPromptVisible: false,
          searchQuery: '',
          showSearchInput: false,
          showTitleInput: false,
          isEmptyContent: null,
        },
        data,
      };
      this.defaultCardActions = [
        {
          name: '编辑卡片',
          exec: this.onToggleAlert,
          isVisible: (settings) => settings.canConfig,
        },
        {
          name: '删除卡片',
          exec: this.onDeleteCard,
          isVisible: (settings) => settings.canDelete,
        },
      ];
    }
    static propTypes = {
      uid: PropTypes.string,
      common: PropTypes.object,
      onSearch: PropTypes.func,
      onToggleFilter: PropTypes.func,
      name: PropTypes.string,
      canConfig: PropTypes.bool,
      canDelete: PropTypes.bool,
      canMax: PropTypes.bool,
      canRename: PropTypes.bool,
      hideHeader: PropTypes.bool,
      customization: PropTypes.shape({
        actions: PropTypes.array,
        renderTitle: PropTypes.func,
        renderHeader: PropTypes.func,
        renderSearch: PropTypes.func,
        toParams: PropTypes.func,
        fromParams: PropTypes.func,
      }),
      onDeleteCard: PropTypes.func,
      params: PropTypes.object,
      onUpdateCardConfig: PropTypes.func,
      hideSearch: PropTypes.bool,
      hideActions: PropTypes.bool,
      data: PropTypes.object,
      runtime: PropTypes.object,
    };
    // needImplement = () => console.log('not implemented');
    onSearchEnter = (e) => {
      this.setState({
        runtime: {
          searchQuery: e.target.value,
          showSearchInput: false,
        },
      });
      // this.searchInput.input.value = '';
    };
    onDeleteCard = () => {
      if (this.props.onDeleteCard) {
        this.props.onDeleteCard(this.props.uid);
      }
    };
    onToggleAlert = () => {
      this.setState((prevState) => ({
        runtime: {
          ...prevState.runtime,
          isAlertVisible: !prevState.runtime.isAlertVisible,
        },
      }));
    };
    onToggleState = (type, value) => () => {
      // 传入 （key, value） 或 (objs:{a:b,c:d})
      // TODO 这里可以增加，对小操作进行保存的功能
      if (typeof type === 'object') {
        this.setState((prevState) => ({
          runtime: {
            ...prevState.runtime,
            ...type,
          },
        }));
        return;
      }
      let status = this.state.runtime[type];
      this.setState((prevState) => ({
        runtime: {
          ...prevState.runtime,
          [type]: value !== undefined ? value : !status,
        },
      }));
    };
    onTogglePrompt = () => {
      this.setState((prevState) => ({
        runtime: {
          ...prevState.runtime,
          isPromptVisible: !prevState.runtime.isPromptVisible,
        },
      }));
    };
    updateSettings = (settings) => {
      this.setState((prevState) => {
        let { params, name, runtime } = settings;
        const { } = settings;
        const { customization: { toParams } = {} } = this.props;
        if (toParams) params = toParams(settings);

        if (this.props.onUpdateCardConfig) {
          this.props.onUpdateCardConfig({
            cardId: this.props.uid,
            cardConfig: { name, params },
          });
        }
        const clone = _.merge({}, prevState);
        const nextState = _.mergeWith(
          clone,
          { name, params, runtime },
          // eslint-disable-next-line consistent-return
          (obj, src) => {
            if (_.isArray(obj)) {
              return src;
            }
          }
        );
        return nextState;
      });
    };
    componentWillReceiveProps() {
      const { clientHeight, clientWidth } = this.bodyNode;
      this.setState({
        ch: clientHeight,
        cw: clientWidth,
      });
    }
    componentDidMount() {
      const { clientHeight, clientWidth } = this.bodyNode;

      // 一般不推荐在componentDidMount里使用setState
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        ch: clientHeight,
        cw: clientWidth,
      });
    }
    shouldComponentUpdate(nextProps, nextStates) {
      const {
        name: thisName,
        ch: thisCh,
        cw: thisCw,
        params: thisParams,
        runtime: thisRuntime,
      } = this.state;
      const {
        name: nextName,
        ch: nextCh,
        cw: nextCw,
        params: nextParams,
        runtime: nextRuntime,
      } = nextStates;
      const { runtime: propsRuntime } = this.props;
      const { runtime: nextPropsRuntime } = nextProps;
      return (
        thisName !== nextName ||
        !_.isEqual(thisParams, nextParams) ||
        thisCh !== nextCh ||
        thisCw !== nextCw ||
        !_.isEqual(thisRuntime, nextRuntime) ||
        propsRuntime !== nextPropsRuntime
      );
    }
    onToggleSearchInput = () => {
      this.setState((prevState) => ({
        runtime: {
          ...prevState.runtime,
          showSearchInput: true,
        },
      }));
      this.searchInput.focus();
      const input = this.searchInput.input;
      input.setSelectionRange(0, input.value.length);
    };
    onBlur = () => {
      this.setState((prevState) => ({
        runtime: {
          ...prevState.runtime,
          showSearchInput: false,
        },
      }));
    };
    activateTitleChange = () => {
      this.setState((prevState) => ({
        runtime: {
          ...prevState.runtime,
          showTitleInput: true,
        },
      }));
      setTimeout(() => {
        this.titleInput.input.select();
      });
    };
    changeTitle = (e) => {
      const value = e.target.value;
      if (!value) {
        return;
      }
      this.setState((prevState) => ({
        runtime: {
          ...prevState.runtime,
          showTitleInput: false,
        },
        name: value,
      }));
      this.props.onUpdateCardConfig({
        cardId: this.props.uid,
        cardConfig: {
          data: {
            ...this.state.data,
            name: value,
          },
        },
      });
    };
    blurChangeTitle = (e) => {
      const value = e.target.value;
      this.setState((prevState) => ({
        runtime: {
          ...prevState.runtime,
          showTitleInput: false,
        },
      }));
      if (!value) {
        return;
      }
      this.setState({ name: value });
      this.props.onUpdateCardConfig({
        cardId: this.props.uid,
        cardConfig: {
          data: {
            ...this.state.data,
            name: value,
          },
        },
      });
    };
    getActionsToRender({ customizedActions, settings, options }) {
      if (!this.actionsToRender) {
        this.actionsToRender = [
          ...this.defaultCardActions,
          ...customizedActions,
        ]
          .sort(
            ({ weight: weight1 = 100 }, { weight: weight2 = 100 }) =>
              weight1 - weight2
          )
          .filter(({ isVisible }) => !isVisible || isVisible(settings))
          .map(({ exec, ...rest }) => ({
            ...rest,
            exec: exec && (() => exec(settings, options)),
          }));
      }
      // eslint-disable-next-line no-param-reassign
      options.actionsToRender = this.actionsToRender;
      return this.actionsToRender;
    }
    configMessage = (config = {}) => {
      const {
        top = 36,
        duration = 2,
        getContainer = () => this.bodyNode,
      } = config;
      message.config({
        top,
        duration,
        getContainer,
      });
    };
    render() {
      const {
        params = {},
        name,
        canConfig,
        canDelete,
        runtime: {
          isAlertVisible,
          isPromptVisible,
          searchQuery,
          showSearchInput,
          showTitleInput,
          isEmptyContent,
          modal,
        },
        ch,
        cw,
      } = this.state;
      const {
        uid,
        name: nameFromProps,
        hideHeader,
        hideSearch,
        canMax = true,
        canRename,
        hideActions,
        params: paramsFromProps,
        customization: {
          renderTitle,
          actions: customizedActions = [],
          renderHeader,
          renderSearch,
          detailLink,
          detailLinkTarget,
          fromParams,
          noData,
          isNoData,
        } = {},
        ...connected
      } = this.props;

      const settings = {
        uid,
        params,
        name,
        canConfig,
        canDelete,
        runtime: {
          isAlertVisible,
          isPromptVisible,
          searchQuery,
          isEmptyContent,
          ...this.state.runtime,
        },
      };

      const {
        onSearchEnter,
        updateSettings = this.updateSettings,
        alert = this.onToggleAlert,
        prompt = this.onTogglePrompt,
        onToggleState,
      } = this;
      const options = {
        updateSettings,
        onSearchEnter,
        onToggleState,
        alert,
        prompt,
      };
      const actionsToRender = this.getActionsToRender({
        customizedActions,
        settings,
        options,
      });
      const paramsTransformed = fromParams ? fromParams(settings, options) : {};
      let header;
      const noDataComp =
        ((isNoData && isNoData(settings, options)) || isEmptyContent) &&
        ((noData && noData(settings, options)) || <EmptyState />);
      if (hideHeader) {
        header = null;
      } else if (renderHeader) {
        header = renderHeader(settings, options);
      } else {
        /* eslint-disable */
        header = (
          <Head className="dy-card-head">
            <HeadOperations>
              {renderSearch
                ? renderSearch(settings, options)
                : !hideSearch && (
                    <span style={{ position: 'relative' }}>
                      <StyledInput
                        type="text"
                        placeholder="搜一搜"
                        onPressEnter={onSearchEnter}
                        className={showSearchInput ? 'active' : ''}
                        onBlur={this.onBlur}
                        size="small"
                        innerRef={(searchInput) =>
                          (this.searchInput = searchInput)
                        }
                      />
                      <Icon type="search" onClick={this.onToggleSearchInput} />
                    </span>
                  )}
              {!hideActions &&
                actionsToRender.length > 0 && (
                  <Popover
                    placement="bottom"
                    overlayClassName="dy-card-tool-popover"
                    content={
                      <ul>
                        {actionsToRender.map(
                          ({ name: actionName, exec }, index) => (
                            <li key={String(index)}>
                              <a role="button" onClick={exec}>
                                {actionName}
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    }
                  >
                    <Icon type="setting" />
                  </Popover>
                )}
              {canMax &&
                detailLink && (
                  <IconWrapperLink
                    to={detailLink(settings, options)}
                    target={detailLinkTarget}
                  >
                    <i className="roborfont icon-new-open" title="查看详情" />
                  </IconWrapperLink>
                )}
            </HeadOperations>
            <HeadTitle>
              {renderTitle ? (
                renderTitle(settings, options)
              ) : canRename ? (
                <span onDoubleClick={this.activateTitleChange}>
                  {canRename && showTitleInput ? (
                    <Input
                      defaultValue={name}
                      onPressEnter={this.changeTitle}
                      style={{ width: '200px' }}
                      placeholder="请输入卡片名称，回车确认"
                      ref={(titleInput) => (this.titleInput = titleInput)}
                      onBlur={this.blurChangeTitle}
                      size="small"
                    />
                  ) : (
                    <span>{name}</span>
                  )}
                </span>
              ) : (
                <span>{name}</span>
              )}
            </HeadTitle>
          </Head>
        );
        /* eslint-enable */
      }

      return (
        <Card>
          {header}
          {modal}
          <Body
            innerRef={(bodyNode) => (this.bodyNode = bodyNode)}
            hideHeader={hideHeader}
            className="dy-card-body"
          >
            {ch && cw ? (
              <div
                className={isEmptyContent === true ? 'hidden' : ''}
                style={{ height: '100%' }}
              >
                <WrappedComponent
                  {...settings}
                  {...options}
                  {...connected}
                  {...paramsTransformed}
                  ch={ch}
                  cw={cw}
                  width={cw}
                  height={ch}
                  canMax={canMax}
                  configMessage={this.configMessage}
                />
              </div>
            ) : null}
            {noDataComp}
          </Body>
        </Card>
      );
    }
  };
