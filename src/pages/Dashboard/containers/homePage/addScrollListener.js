function _scroll() {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const target = document.querySelector('#home-page-header');
  if (target) {
    if (scrollTop < 200) {
      target.style.backgroundColor = 'transparent';
    } else {
      target.style.backgroundColor = 'rgba(8, 41, 55, 0.6)';
    }
  }
}
const addScrollListener = () => {
  document.addEventListener('scroll', _scroll);
};
const deleteScrollListener = () => {
  document.removeEventListener('scroll', _scroll);
};
export { addScrollListener, deleteScrollListener };
