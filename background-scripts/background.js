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
