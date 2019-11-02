function injectLibrary(library) {
  let wrapper = null;
  if (library.url) {
    wrapper = document.createElement('a');
    wrapper.setAttribute('href', library.url);
    wrapper.target = '_blank';
    const name = null;
  } else {
    wrapper = document.createElement('div');
  }
  wrapper.className = 'lib-wrap';
  const name = document.createElement('span');
  name.className = 'name';
  name.innerText = `${library.name} ${library.version ? library.version : ''}`;

  const image = document.createElement('img');
  image.className = 'lib-icon';
  image.src = `./icons/${library.icon}.png`;
  wrapper.append(image);
  wrapper.append(name);
  return wrapper;
}

function createLibraryList(libraries) {
  const wrapper = document.createElement('div');
  wrapper.className = 'container';
  libraries.forEach((library) => {
    wrapper.append(injectLibrary(library));
  });
  return wrapper;
}

function createLoader() {
  const wrapper = document.createElement('div');
  wrapper.className = 'loading-wrapper';
  wrapper.innerHTML = '<di><div class="loader"></div><p>Analyzing</p></div>';
  return wrapper;
}

function fetchContents(tabs, intervel, prevLoadingState, cb) {
  if (tabs[0].url.includes('chrome://')) {
    const container = document.getElementById('inject-elements');
    container.innerHTML = '<p>webscan an js library analyzer</p>';
  }
  window.chrome.tabs.sendMessage(tabs[0].id, { type: 'getLibraries' }, (data) => {
    const container = document.getElementById('inject-elements');
    if (data && data.loading && !(data.libraries && data.libraries.length) && !prevLoadingState) {
      container.innerHTML = '';
      container.append(createLoader());
      cb(true);
    } else if (data && data.libraries && data.libraries.length) {
      cb(false);
      window.chrome.browserAction.setIcon({ path: `./icons/${data.libraries[0].icon}.png` });
      if (intervel) {
        clearInterval(intervel);
      }
      const children = createLibraryList(data.libraries);
      container.innerHTML = '';
      container.append(children);
    }
  });
}

window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  let prevLoadingState = false;
  fetchContents(tabs, null, prevLoadingState, (state) => {
    prevLoadingState = state;
  });
  const intervel = setInterval(() => {
    fetchContents(tabs, intervel, prevLoadingState, (state) => {
      prevLoadingState = state;
    });
  }, 500);
});
