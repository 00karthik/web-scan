const head = document.getElementsByTagName('head')[0];
const libScript = document.createElement('script');
let webScanLibraries = [];
libScript.src = window.chrome.extension.getURL('./detect.js');
head.appendChild(libScript);
let getLibraries = false;
window.addEventListener(
  'message',
  (messageContent) => {
    const { data } = messageContent;
    if (data && data.id === 'library-list') {
      getLibraries = true;
      webScanLibraries = data.libraries;
    }
  },
  false,
);

window.chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'getLibraries':
      if (getLibraries === false) {
        sendResponse({ libraries: webScanLibraries, loading: true });
      } else {
        sendResponse({ libraries: webScanLibraries, loading: document.readyState !== 'complete' });
      }
      break;
    default:
      console.error('Unrecognised message: ', message);
  }
});
