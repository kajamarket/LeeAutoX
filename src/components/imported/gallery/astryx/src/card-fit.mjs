export function fitCardPreview(panel, {waitForGraphic = false} = {}) {
  const stage = panel.parentElement;
  const padding = 7;
  let scale = 1;

  function resize() {
    const origin = panel.getBoundingClientRect();
    // scrollWidth 不包含伸到左侧的内容，居中布局可能同时超出两边。
    let left = 0, top = 0;
    let right = Math.max(panel.offsetWidth, panel.scrollWidth);
    let bottom = Math.max(panel.offsetHeight, panel.scrollHeight);
    for (const child of panel.children) {
      const box = child.getBoundingClientRect();
      left = Math.min(left, (box.left - origin.left) / scale);
      right = Math.max(right, (box.right - origin.left) / scale);
      top = Math.min(top, (box.top - origin.top) / scale);
      bottom = Math.max(bottom, (box.bottom - origin.top) / scale);
    }
    const width = right - left;
    const height = bottom - top;
    scale = Math.max(0.001, Math.min(1,
      (stage.clientWidth - 2 * padding) / width,
      (stage.clientHeight - 2 * padding) / height));
    panel.style.setProperty('--preview-scale', scale);
    panel.style.setProperty('--preview-x', `${(stage.clientWidth - width * scale) / 2 - left * scale}px`);
    panel.style.setProperty('--preview-y', `${(stage.clientHeight - height * scale) / 2 - top * scale}px`);
    panel.dataset.previewFit = 'ready';
  }

  const observer = new ResizeObserver(resize);
  function observeLayout() {
    observer.observe(stage);
    observer.observe(panel);
    for (const child of panel.children) observer.observe(child);
  }

  if (!waitForGraphic) {
    resize();
    observeLayout();
    return () => observer.disconnect();
  }

  // Some charts mount their drawing only after measuring their own container.
  function observeChart() {
    const graphic = panel.querySelector('svg, canvas');
    if (!graphic) return;
    renderObserver.disconnect();
    observer.observe(graphic);
    observeLayout();
  }
  const renderObserver = new MutationObserver(observeChart);
  renderObserver.observe(panel, {childList: true, subtree: true});
  observeChart();
  return () => {
    renderObserver.disconnect();
    observer.disconnect();
  };
}
