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

function changeIcon(tabId, interval, loading, cb) {
  window.chrome.tabs.sendMessage(tabId, { type: 'getLibraries' }, (data) => {
    if (data && data.loading) {
      cb(true);
    } else if (data && data.libraries && data.libraries.length && !loading) {
      cb(false);
      window.chrome.browserAction.setIcon({ path: `./icons/${data.libraries[0].icon}.png` });
      if (interval) {
        clearInterval(interval);
      }
    }
  });
}

window.chrome.tabs.onActivated.addListener((activeInfo) => {
  let prevLoadingState = false;
  changeIcon(activeInfo.tabId, null, prevLoadingState, (loading) => {
    prevLoadingState = loading;
  });
  const interval = setInterval(() => {
    changeIcon(activeInfo.tabId, interval, prevLoadingState, (state) => {
      prevLoadingState = state;
    });
  }, 500);
});
