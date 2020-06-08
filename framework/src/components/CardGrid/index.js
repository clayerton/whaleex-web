import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Responsive, WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Card from 'components/Card';

const findOrGenerateResponsiveLayout =
  Responsive.utils.findOrGenerateResponsiveLayout;
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const GridItem = styled.div`
  background: rgba(255, 255, 255, 0.4);
`;

export class ResponsiveCardGrid extends React.PureComponent {
  constructor(props) {
    super(props);

    const { breakpoints = { lg: 1200 }, layouts } = props;
    const currentLayout = findOrGenerateResponsiveLayout(layouts, breakpoints);

    this.state = {
      currentLayout,
      layouts,
      breakpoints,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { layouts, breakpoints } = nextProps;

    if (
      !_.isEqual(layouts, this.props.layouts) ||
      !_.isEqual(breakpoints, this.props.breakpoints)
    ) {
      const currentLayout = findOrGenerateResponsiveLayout(
        layouts,
        breakpoints
      );
      this.setState({
        currentLayout,
        layouts,
        breakpoints,
      });
    }
  }
  onLayoutChange = (currentLayout, allLayouts) => {
    if (typeof this.props.onLayoutChange === 'function') {
      this.props.onLayoutChange(currentLayout, allLayouts);
    }
    this.setState({ currentLayout });
  };
  ajustCardLayout = ({ uid, height }) => {
    const { rowHeight, margin } = this.props;
    const marginTopBottom = margin.length === 2 ? margin[1] : 0;
    let { layouts } = this.state;

    layouts = _.cloneDeep(layouts);
    _.each(layouts, (layout) => {
      const cardLayout = _.find(layout, { i: uid });

      if (height) {
        cardLayout.h =
          Math.ceil((height - rowHeight) / (rowHeight + marginTopBottom)) + 1;
      }
    });

    this.setState({ layouts });
  };
  render() {
    const {
      cards,
      lazyLoad,
      autoLoad,
      propsFromPage = {},
      draggableHandle,
      draggableCancel,
      ...rest
    } = this.props;
    const { layouts, breakpoints, currentLayout } = this.state;

    // layouts必须要有lg的配置
    if (!layouts.lg) {
      return null;
    }

    return (
      <ResponsiveReactGridLayout
        {...rest}
        layouts={layouts}
        breakpoints={breakpoints}
        onLayoutChange={this.onLayoutChange}
        draggableHandle={draggableHandle || '.dy-card-head'}
        draggableCancel={draggableCancel || '.ant-input'}
        useCSSTransforms={false}
      >
        {currentLayout.map(({ i }) => {
          const card = cards[i];

          if (card) {
            const { uid = i, className = '' } = card;

            // lazyLoad取值顺序，优先级按自上而下
            // 1. 面板设置
            // 2. 卡片设置
            // 3. 默认为true
            let cardLazyload = !!lazyLoad;
            if (lazyLoad === undefined) {
              cardLazyload = card.lazyLoad === undefined || !!card.lazyLoad;
            }

            return (
              <GridItem key={uid} className={className}>
                <Card
                  {...card}
                  uid={uid}
                  lazyLoad={cardLazyload}
                  autoLoad={(lazyLoad && autoLoad) || 0}
                  currentLayout={_.find(currentLayout, (l) => l.i === card.uid)}
                  onDeleteCard={this.props.onDeleteCard}
                  onUpdateCardConfig={this.props.onUpdateCardConfig}
                  ajustCardLayout={this.ajustCardLayout}
                  {...propsFromPage}
                />
              </GridItem>
            );
          }
          return <GridItem key={i} />;
        })}
      </ResponsiveReactGridLayout>
    );
  }
}

ResponsiveCardGrid.propTypes = {
  cards: PropTypes.object,
  layouts: PropTypes.object,
  onLayoutChange: PropTypes.func,
  breakpoints: PropTypes.object,
  onDeleteCard: PropTypes.func,
  onUpdateCardConfig: PropTypes.func,
  lazyLoad: PropTypes.bool,
  autoLoad: PropTypes.number,
  className: PropTypes.string,
  propsFromPage: PropTypes.object,
  rowHeight: PropTypes.number,
  draggableHandle: PropTypes.string,
  draggableCancel: PropTypes.string,
  margin: PropTypes.array,
};

export default ResponsiveCardGrid;
