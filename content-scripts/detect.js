import testRules from '../rules/libraries';
import getFontFromComputedStyle from '../rules/fonts';

function getUserBrowsersFont() {
  const fontData = getFontFromComputedStyle(
    window.getComputedStyle(document.getElementsByTagName('body')[0]),
  );
  if (fontData) {
    return fontData;
  }
  return null;
}

const findLibraries = async () => {
  const detectedLibraries = [];
  await Object.keys(testRules).forEach(async (key) => {
    try {
      if (testRules[key] && testRules[key].test) {
        const result = await testRules[key].test(window);
        if (result === false) return;
        const libraryInfo = {
          name: key,
          id: testRules[key].id,
          npm: testRules[key].npm,
          url: testRules[key].url,
          icon: testRules[key].icon,
          version: result.version,
        };
        detectedLibraries.push(libraryInfo);
      }
    } catch (e) {
      // console.log(`Library Detector test for ${key} failed:`, e);
    }
  });
  return detectedLibraries;
};

async function startApp() {
  const libraries = await findLibraries();
  const fonts = getUserBrowsersFont();
  window.postMessage({
    id: 'library-list',
    libraries,
    fonts,
  });
}
startApp();
window.onload = () => {
  startApp();
};
