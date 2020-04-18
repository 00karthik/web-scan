const head = document.getElementsByTagName('head')[0];
const libScript = document.createElement('script');
let webScanLibraries = [];
let fonts = '';
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
      fonts = data.fonts;
    }
  },
  false,
);

window.chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'getLibraries':
      if (getLibraries === false) {
        sendResponse({ libraries: webScanLibraries, fonts, loading: true });
      } else {
        sendResponse({
          libraries: webScanLibraries,
          fonts,
          loading: document.readyState !== 'complete',
        });
      }
      break;
    default:
    // console.error('Unrecognised message: ', message);
  }
});
