if (window.chrome.webRequest && window.chrome.webRequest.onCompleted) {
  window.chrome.webRequest.onCompleted.addListener(
    async (request) => {
      const headers = {};
      if (request.responseHeaders) {
        const { url } = request;

        let tab;

        window.chrome.tabs.query({ url: [url] }, (tabs) => {
          [tab] = tabs;
          if (tab) {
            request.responseHeaders.forEach((header) => {
              const name = header.name.toLowerCase();

              headers[name] = headers[name] || [];

              headers[name].push((header.value || header.binaryValue || '').toString());
            });
            // window.alert(JSON.stringify(headers));
          }
        });
      }
    },
    { urls: ['http://*/*', 'https://*/*'], types: ['main_frame'] },
    ['responseHeaders'],
  );
}

function changeIcon(tabId, url) {
  if (url.includes('devtools://')) {
    return;
  }
  if (url.includes('chrome://')) {
    window.chrome.browserAction.setIcon({ path: './icons/icon.png' });
  } else {
    window.chrome.tabs.sendMessage(tabId, { type: 'getLibraries' }, (data) => {
      if (data && data.libraries && data.libraries.length && !data.loading) {
        window.chrome.browserAction.setIcon({ path: `./icons/${data.libraries[0].icon}.png` });
      } else if (data && data.loading) {
        setTimeout(() => {
          window.chrome.tabs.sendMessage(tabId, { type: 'getLibraries' }, (data) => {
            if (data && data.libraries && data.libraries.length && !data.loading) {
              window.chrome.browserAction.setIcon({
                path: `./icons/${data.libraries[0].icon}.png`,
              });
            }
          });
        }, 2000);
      } else {
        window.chrome.browserAction.setIcon({ path: './icons/icon.png' });
      }
    });
  }
}

window.chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    window.chrome.tabs.getSelected(null, (tab) => {
      if (tab) {
        changeIcon(tabId, tab.url);
      }
    });
  }
});

window.chrome.tabs.onActivated.addListener((activeInfo) => {
  window.chrome.tabs.getSelected(null, (tab) => {
    if (tab) {
      changeIcon(activeInfo.tabId, tab.url);
    }
  });
});

// Add a `manifest` property to the `chrome` object.
window.chrome.manifest = window.chrome.app.getDetails();

function injectIntoTab(tab) {
  // You could iterate through the content scripts here
  const scripts = window.chrome.manifest.content_scripts[0].js;
  let i = 0;
  const s = scripts.length;
  for (; i < s; i += 1) {
    window.chrome.tabs.executeScript(tab.id, {
      file: scripts[i],
    });
  }
}

// Get all windows
window.chrome.windows.getAll(
  {
    populate: true,
  },
  (windows) => {
    let i = 0;
    const w = windows.length;
    let currentWindow;
    for (; i < w; i += 1) {
      currentWindow = windows[i];
      let j = 0;
      const t = currentWindow.tabs.length;
      let currentTab;
      for (; j < t; j += 1) {
        currentTab = currentWindow.tabs[j];
        // Skip chrome:// and https:// pages
        if (!currentTab.url.match(/(chrome):\/\//gi)) {
          injectIntoTab(currentTab);
        }
      }
    }
  },
);
