(() => {
  const controls = document.querySelector('.controls');
  const previous = document.createElement('button');
  const next = document.createElement('button');
  previous.type = next.type = 'button';
  previous.className = next.className = 'control secondary';
  previous.textContent = '← 上一站';
  next.textContent = '下一站 →';
  controls.insertBefore(previous, document.getElementById('toggle'));
  controls.insertBefore(next, document.getElementById('toggle'));
  function navigate(delta) {
    const destination = Math.max(0, Math.min(chapters.length - 1, index + delta));
    clearTimers();
    playing = false;
    go(destination, false);
    updateControls();
  }
  previous.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest('button, a, input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
})();
