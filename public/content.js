// DevSpace Content Script - Grid Overlay System
(function() {
  let gridOverlay = null;
  let guideOverlay = null;

  function removeGridOverlay() {
    if (gridOverlay) { gridOverlay.remove(); gridOverlay = null; }
    if (guideOverlay) { guideOverlay.remove(); guideOverlay = null; }
  }

  function createGridOverlay(config) {
    removeGridOverlay();
    const { columns, gutter, margin, maxWidth, color, opacity, type } = config;

    gridOverlay = document.createElement('div');
    gridOverlay.id = 'devspace-grid-overlay';
    gridOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 2147483646; pointer-events: none;
      display: flex; justify-content: center;
    `;

    const container = document.createElement('div');
    container.style.cssText = `
      width: 100%; max-width: ${maxWidth}px;
      height: 100%; display: flex; gap: ${gutter}px;
      padding: 0 ${margin}px; box-sizing: border-box;
    `;

    for (let i = 0; i < columns; i++) {
      const col = document.createElement('div');
      col.style.cssText = `
        flex: 1; height: 100%;
        background: ${color};
        opacity: ${opacity};
        ${type === 'lines' ? `background: transparent; border-left: 1px solid ${color}; border-right: 1px solid ${color}; opacity: ${opacity};` : ''}
      `;
      container.appendChild(col);
    }
    gridOverlay.appendChild(container);
    document.body.appendChild(gridOverlay);
  }

  function createGuides(config) {
    if (guideOverlay) guideOverlay.remove();
    const { guides } = config;
    if (!guides || guides.length === 0) return;

    guideOverlay = document.createElement('div');
    guideOverlay.id = 'devspace-guide-overlay';
    guideOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      z-index: 2147483645; pointer-events: none;
    `;

    guides.forEach(g => {
      const line = document.createElement('div');
      if (g.axis === 'horizontal') {
        line.style.cssText = `position:absolute; left:0; width:100%; height:1px; top:${g.position}px; background:${g.color || '#ff3366'}; opacity:0.8;`;
      } else {
        line.style.cssText = `position:absolute; top:0; height:100%; width:1px; left:${g.position}px; background:${g.color || '#ff3366'}; opacity:0.8;`;
      }
      const label = document.createElement('span');
      label.textContent = `${g.position}px`;
      label.style.cssText = `position:absolute; ${g.axis === 'horizontal' ? 'left:4px; top:-14px' : 'top:4px; left:4px'}; font-size:10px; color:${g.color || '#ff3366'}; font-family:monospace; background:rgba(0,0,0,0.7); padding:1px 4px; border-radius:2px;`;
      line.appendChild(label);
      guideOverlay.appendChild(line);
    });
    document.body.appendChild(guideOverlay);
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'toggleGrid') {
      if (gridOverlay) {
        removeGridOverlay();
        sendResponse({ status: 'removed' });
      } else {
        createGridOverlay(msg.config);
        sendResponse({ status: 'created' });
      }
    } else if (msg.action === 'updateGrid') {
      createGridOverlay(msg.config);
      sendResponse({ status: 'updated' });
    } else if (msg.action === 'removeGrid') {
      removeGridOverlay();
      sendResponse({ status: 'removed' });
    } else if (msg.action === 'updateGuides') {
      createGuides(msg.config);
      sendResponse({ status: 'updated' });
    } else if (msg.action === 'getPageInfo') {
      sendResponse({
        url: window.location.href,
        title: document.title,
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    return true;
  });
})();
