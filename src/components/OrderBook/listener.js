export const ListenOrderBookPosition = () => {
  const orderFlow = document.getElementById('order-flow');
  orderFlow.addEventListener('scroll', winScroll, false);
  function winScroll() {
    try {
      const orderFlow = document.getElementById('order-flow');
      const orderItemStatic = document.getElementById('order-item');
      const orderItem = document.getElementById('order-item-affix');
      const limit = document.getElementById('sell-order').offsetHeight;
      const limit2 =
        limit + orderItemStatic.offsetHeight - orderFlow.offsetHeight;
      const tag = orderFlow.scrollTop;
      if (!orderItem) {
        return;
      }
      //TODO 1. 为什么scrollTop 不能阻止继续上滑
      //TODO 2. 为什么选择只显示买单或卖单时 监听事件不生效
      if (tag >= limit) {
        // setTimeout(() => {
        orderItem.style.display = 'block';
        orderItem.style.position = 'absolute';
        orderItem.style.top = '75px';
        orderItem.style.bottom = 'auto';
        orderItem.style.boxShadow = '0px 2px 3px 0px rgba(124, 166, 188, 0.1)';
        // }, 0);
        // orderFlow.scrollTop = limit;
      } else if (tag <= limit2) {
        // setTimeout(() => {
        orderItem.style.display = 'block';
        orderItem.style.position = 'absolute';
        orderItem.style.top = 'auto';
        orderItem.style.bottom = '10px';
        orderItem.style.boxShadow = '0px -2px 3px 0px rgba(124, 166, 188, 0.1)';

        // }, 0);
        // orderFlow.scrollTop = limit2;
      } else {
        orderItem.style.display = 'none';
        orderItem.style.zIndex = '4';
        orderItem.style.width = '100%';
        orderItem.style.boxShadow = 'none';
        orderItem.style.left = '0';
      }
    } catch (e) {
      console.log(e);
    }
  }
};
const findParent = (target, maxLevel, attr) => {
  let parent = target;
  if (parent.getAttribute(attr)) {
    return parent;
  }
  for (var i = 0; i < maxLevel; i++) {
    parent = parent.parentNode;
    if (parent.getAttribute(attr)) {
      return parent;
    }
  }
  return parent;
};
var last;
const debounceSetOption = (idle = 200, action) => {
  return function() {
    var ctx = this,
      args = arguments;
    clearTimeout(last);
    last = setTimeout(function() {
      action.apply(ctx, args);
    }, idle);
  };
};
export const fontJumpAnimate = elePath => {
  debounceSetOption(200, () => {
    const ele = document.querySelectorAll(elePath);
    ele.forEach(i => {
      i.style.fontSize = '16px';
    });
    setTimeout(() => {
      ele.forEach(i => {
        i.style.fontSize = '14px';
      });
    }, 400);
  })();
};
export const ListenOrderBookClick = callBack => {
  const orderFlow = document.getElementById('order-flow');
  // const orderFlow = document.getElementsByClassName('orderbook-item');
  function getData(e) {
    let parnent = findParent(e.target, 4, 'data-price');
    const price = parnent.getAttribute('data-price');
    const quantity = parnent.getAttribute('data-quantity');
    const askBId = parnent.getAttribute('data-askBId');
    const depth = parnent.getAttribute('data-depth');
    return { price, quantity, askBId, depth };
  }
  orderFlow.addEventListener(
    'click',
    e => {
      const data = getData(e);
      callBack('click', data);
      // fontJumpAnimate(`.order-item-${data.askBId} .input-price input`);
    },
    false
  );
  orderFlow.addEventListener(
    'dblclick',
    e => {
      const data = getData(e);
      callBack('dblclick', data);
      // fontJumpAnimate(`.order-item-${data.askBId} input`);
    },
    false
  );
};
