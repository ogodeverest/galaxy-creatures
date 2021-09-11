// import {
//   PerspectiveCamera,
//   Scene,
//   WebGLRenderer,
//   Vector2,
//   ReinhardToneMapping,
//   AudioLoader,
//   AudioListener,
//   Audio,
//   LoadingManager,
// } from "three";
// import { Manager, Tap } from "hammerjs";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import SampledModel from "./helpers/SampledModel";
// import Galaxy from "./helpers/Galaxy";

// let selectedModel = null;

// const stage = document.getElementById("stage");
// const manager = new LoadingManager();

// //hammerjs
// const hammerManager = new Manager(stage);
// const DoubleTap = new Tap({
//   event: "doubletap",
//   taps: 2,
// });
// hammerManager.add(DoubleTap);

// const models = [
//   { path: "./static/objects/deer/Deer.obj", name: "Deer" },
//   { path: "./static/objects/owl/Owl.obj", name: "Owl" },
//   { path: "./static/objects/wolf/Wolf.obj", name: "Wolf" },
//   { path: "./static/objects/rabbit/Rabbit.obj", name: "Rabbit" },
//   { path: "./static/objects/cat/Cat.obj", name: "Cat" },
//   { path: "./static/objects/frog/Frog.obj", name: "Frog" },
//   { path: "./static/objects/Bear/Bear.obj", name: "Bear" },
//   { path: "./static/objects/fish/Fish.obj", name: "Fish" },
// ];

// models.forEach((model) => {
//   new OBJLoader(manager).load(model.path, (obj) => {
//     console.log(obj);
//     model.obj = obj.children[0];
//   });
// });

// manager.onLoad = () => {
//   selectedModel = new SampledModel(models[currentIndex].obj);
//   scene.add(selectedModel);
//   renderer.setAnimationLoop(render);
// };

// manager.onProgress = (url, itemsLoaded, itemsTotal) => {
//   console.log(
//     "Loading file: " +
//       url +
//       ".\nLoaded " +
//       itemsLoaded +
//       " of " +
//       itemsTotal +
//       " files."
//   );
// };

// let currentIndex = getModelsIndexFromName(getModelFromQueryParams() || "Deer");

// const scene = new Scene();

// const camera = new PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.z = 30;
// camera.position.y = 9;

// const renderer = new WebGLRenderer({
//   antialias: true,
// });

// const listener = new AudioListener();

// camera.add(listener);

// const audio = new Audio(listener);
// const audioLoader = new AudioLoader(manager);
// audioLoader.load("./static/audio/Oxygène.mp3", (buffer) => {
//   audio.setBuffer(buffer);
//   audio.setLoop(true);
//   audio.setVolume(0.3);
//   audio.play();
// });

// renderer.toneMapping = ReinhardToneMapping;
// const renderScene = new RenderPass(scene, camera);
// const bloomPass = new UnrealBloomPass(
//   new Vector2(window.innerWidth, window.innerHeight),
//   3,
//   1,
//   0
// );
// const composer = new EffectComposer(renderer);
// composer.setPixelRatio(window.devicePixelRatio);
// composer.addPass(renderScene);
// composer.addPass(bloomPass);
// document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// const galaxy = new Galaxy();
// scene.add(galaxy);

// function render() {
//   if (resizeRendererToDisplaySize(renderer)) {
//     const canvas = renderer.domElement;
//     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     camera.updateProjectionMatrix();
//     composer.setSize(canvas.width, canvas.height);
//   }

//   selectedModel.animate();
//   galaxy.animate();
//   switchToNextModel();

//   controls.update();
//   composer.render();
// }

// // utils functions

// function switchToNextModel() {
//   if (selectedModel.hidden() && !selectedModel.show) {
//     selectedModel.toggleShow();
//     scene.remove(selectedModel);
//     changeQueryParams();
//     selectedModel = new SampledModel(models[currentIndex % models.length].obj);
//     scene.add(selectedModel);
//   }
// }

// function resizeRendererToDisplaySize(renderer) {
//   const canvas = renderer.domElement;
//   const width = canvas.clientWidth;
//   const height = canvas.clientHeight;
//   const needResize = canvas.width !== width || canvas.height !== height;
//   if (needResize) {
//     renderer.setSize(width, height, false);
//   }
//   return needResize;
// }

// function showNext() {
//   currentIndex++;
//   selectedModel.toggleShow();
// }

// function showPrevious() {
//   currentIndex--;
//   selectedModel.toggleShow();
// }

// function changeQueryParams() {
//   if (history.pushState) {
//     var newurl =
//       window.location.protocol +
//       "//" +
//       window.location.host +
//       window.location.pathname +
//       `?model=${models[currentIndex % models.length].name}`;
//     window.history.pushState({ path: newurl }, "", newurl);
//   }
// }

// function getModelFromQueryParams() {
//   const urlSearchParams = new URLSearchParams(window.location.search);
//   const params = Object.fromEntries(urlSearchParams.entries());
//   return params ? params.model : null;
// }

// function getModelsIndexFromName(name) {
//   return models.findIndex((model) => model.name === name);
// }
// // Event listeners

// setInterval(() => selectedModel.isFinished() && showNext(), 20000);

// document.addEventListener("keyup", (e) => {
//   console.log(e.code);
//   switch (e.code) {
//     case "ArrowRight":
//       {
//         showNext();
//       }
//       break;
//     case "ArrowLeft": {
//       if (currentIndex > 0) {
//         showPrevious();
//       }
//       break;
//     }
//     case "KeyA":
//       {
//         audio.isPlaying ? audio.pause() : audio.play();
//       }
//       break;
//     default:
//       console.log("Asd");
//   }
// });

// hammerManager.on("doubletap", (e) => showNext());

import WegblApp from "./app";

const webglApp = new WegblApp();
