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
    window.chrome.browserAction.setIcon({ path: './icons/icon38.png' });
  } else {
    window.chrome.tabs.sendMessage(tabId, { type: 'getLibraries' }, (data) => {
      if (data && data.libraries && data.libraries.length) {
        window.chrome.browserAction.setIcon({ path: `./icons/${data.libraries[0].icon}.png` });
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

window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.status === 'hellscript-loaded') {
    console.log(sender.tab.url);
    window.chrome.tabs.getSelected(null, (tab) => {
      if (tab && tab.id === sender.tab.url) {
        changeIcon(tab.id, tab.url);
      }
    });
  }
});
