import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

// import { cardMapping } from 'appLoadable';
import doImportDelegate from 'dyc/utils/imports';
import { getConfig } from 'dyc/utils/config';
import { CardWrapper } from './style';
import { enhance } from './enhance';

export class Card extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    const { uid = uuidv4() } = props;

    this.state = {
      isLoading: true, // 获取卡片代码块，可用于加载动画
      // isValid: !!cardMapping[type], // 判断卡片合法性，可用于非法卡片提示
      InnerComponent: null,
      uid,
    };
  }
  componentDidMount() {
    // 如果浏览器不支持IntersectionObserver，则直接加载卡片
    if (!window.IntersectionObserver || !this.props.lazyLoad) {
      this.importCard();
      return;
    }
    // 开启观察模式
    if (this.observer) {
      this.observer.observe(this.cardNode);
    }
    if (this.props.autoLoad > 0) {
      setTimeout(this.forceImport, this.props.autoLoad);
    }
  }
  observer = (() => {
    if (!window.IntersectionObserver) {
      return null;
    }
    return new IntersectionObserver(
      (entries) => {
        // 观察当前卡片区域是否在可视区域，选择是否加载卡片
        if (entries[0] && entries[0].intersectionRatio > 0) {
          // observe once
          this.forceImport();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0],
      }
    );
  })();
  forceImport = () => {
    if (this.importDone) return;
    if (this.observer) {
      this.observer.unobserve(this.cardNode);
    }
    this.importDone = true;
    this.importCard();
  };
  importCard = () => {
    const { type, version } = this.props;
    this.setState({ isLoading: true });
    const project = type.indexOf('/') > 0 ? type.split('/')[0] : getConfig('app_name');
    doImportDelegate(type, this.state.uid, this.context.store, version).then(
      ({ InnerComponent, configs }) => {
        this.setState({
          InnerComponent: enhance(InnerComponent),
          isLoading: false,
          hideHeader: !!configs.hideHeader,
          configs,
          project,
        });
      }
    );
  };
  render() {
    const { className: classNameFromProps } = this.props;
    const { InnerComponent, hideHeader, configs, project = '' } = this.state;
    const className = [project, classNameFromProps].join(' ');
    return (
      <CardWrapper
        id={this.state.uid}
        className={className}
        innerRef={(cardNode) => (this.cardNode = cardNode)}
      >
        {/* {isLoading && <div>Loading</div>} */}
        {InnerComponent ? (
          <InnerComponent
            uid={this.state.uid}
            {...configs}
            {...this.props}
            hideHeader={hideHeader}
          />
        ) : null}
      </CardWrapper>
    );
  }
}

Card.propTypes = {
  type: PropTypes.string,
  uid: PropTypes.string,
  lazyLoad: PropTypes.bool,
  autoLoad: PropTypes.number,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default Card;
