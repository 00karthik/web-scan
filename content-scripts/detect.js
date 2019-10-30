import testRules from '../rules/libraries';

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
      console.log(`Library Detector test for ${key} failed:`, e);
    }
  });
  return detectedLibraries;
};

async function startApp() {
  const libraries = await findLibraries();
  window.postMessage({
    id: 'library-list',
    libraries,
  });
}

window.onload = () => {
  startApp();
};
