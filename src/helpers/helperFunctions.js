export function getModelsIndexFromName(name, models) {
  return models.findIndex((model) => model.name === name);
}

export function getModelFromQueryParams() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params ? params.model : null;
}

export function changeQueryParams(modelName) {
  if (history.pushState) {
    var newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      `?model=${modelName}`;
    window.history.pushState({ path: newurl }, "", newurl);
  }
}

export function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
