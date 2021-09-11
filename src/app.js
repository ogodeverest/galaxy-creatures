import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector2,
  ReinhardToneMapping,
  AudioLoader,
  AudioListener,
  Audio,
  LoadingManager,
} from "three";
import { Manager, Tap } from "hammerjs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import SampledModel from "./helpers/SampledModel";
import Galaxy from "./helpers/Galaxy";
import {
  getModelsIndexFromName,
  getModelFromQueryParams,
  changeQueryParams,
  resizeRendererToDisplaySize,
} from "./helpers/helperFunctions";

export default class WegblApp {
  constructor() {
    this.initRenderer();
    this.initScene();
    this.initCamera();
    this.initPostProcessing();

    this.selectedModel = null;
    this.initHammerGestures();
    this.initLoadingManager();
    this.initModels();
    this.initAudio();
    this.initOrbitControls();
    this.initGalaxy();

    this.currentIndex = getModelsIndexFromName(
      getModelFromQueryParams() || "Deer",
      this.models
    );

    this.autoSwitchModels();
    this.initEventListeners();
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true,
    });
    document.body.appendChild(this.renderer.domElement);
  }

  initScene() {
    this.scene = new Scene();
  }

  initCamera() {
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 30;
    this.camera.position.y = 9;
  }

  initPostProcessing() {
    this.renderer.toneMapping = ReinhardToneMapping;
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      3,
      1,
      0
    );
    this.composer = new EffectComposer(this.renderer);
    this.composer.setPixelRatio(window.devicePixelRatio);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
  }

  initLoadingManager() {
    this.loadingManager = new LoadingManager();

    this.loadingManager.onLoad = () => {
      this.selectedModel = new SampledModel(this.models[this.currentIndex].obj);
      this.scene.add(this.selectedModel);
      document.getElementById("loading-screen").style.display = "none";
      this.renderer.setAnimationLoop(this.render.bind(this));
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      document.getElementById("loading-file-info").innerText =
        "Loaded " + itemsLoaded + " of " + itemsTotal + " files...";
    };
  }

  initModels() {
    this.models = [
      { path: "./static/objects/deer/Deer.obj", name: "Deer" },
      { path: "./static/objects/owl/Owl.obj", name: "Owl" },
      { path: "./static/objects/wolf/Wolf.obj", name: "Wolf" },
      { path: "./static/objects/rabbit/Rabbit.obj", name: "Rabbit" },
      { path: "./static/objects/cat/Cat.obj", name: "Cat" },
      { path: "./static/objects/frog/Frog.obj", name: "Frog" },
      { path: "./static/objects/Bear/Bear.obj", name: "Bear" },
      { path: "./static/objects/fish/Fish.obj", name: "Fish" },
    ];

    this.models.forEach((model) => {
      new OBJLoader(this.loadingManager).load(model.path, (obj) => {
        model.obj = obj.children[0];
      });
    });
  }

  initAudio() {
    const listener = new AudioListener();
    this.camera.add(listener);
    this.audio = new Audio(listener);
    const audioLoader = new AudioLoader(this.loadingManager);
    audioLoader.load("./static/audio/Oxygène.mp3", (buffer) => {
      this.audio.setBuffer(buffer);
      this.audio.setLoop(true);
      this.audio.setVolume(0.3);
      this.audio.play();
    });
  }

  initHammerGestures() {
    this.stage = document.getElementById("stage");
    this.hammerManager = new Manager(this.stage);
    const DoubleTap = new Tap({
      event: "doubletap",
      taps: 2,
    });
    this.hammerManager.add(DoubleTap);
  }

  initOrbitControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  initGalaxy() {
    this.galaxy = new Galaxy();
    this.scene.add(this.galaxy);
  }

  switchToNextModel() {
    if (this.selectedModel.hidden() && !this.selectedModel.show) {
      this.selectedModel.toggleShow();
      this.scene.remove(this.selectedModel);
      changeQueryParams(
        this.models[this.currentIndex % this.models.length].name
      );
      this.selectedModel = new SampledModel(
        this.models[this.currentIndex % this.models.length].obj
      );
      this.scene.add(this.selectedModel);
    }
  }

  autoSwitchModels() {
    setInterval(() => this.selectedModel.isFinished() && showNext(), 20000);
  }

  initEventListeners() {
    document.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "ArrowRight":
          {
            this.showNext();
          }
          break;
        case "ArrowLeft": {
          if (this.currentIndex > 0) {
            this.showPrevious();
          }
          break;
        }
        case "KeyA":
          {
            this.toggleAudio();
          }
          break;
        default:
      }
    });

    this.hammerManager.on("doubletap", (e) => this.showNext());
  }

  toggleAudio() {
    this.audio.isPlaying ? this.audio.pause() : this.audio.play();
  }

  showNext() {
    this.currentIndex++;
    this.selectedModel.toggleShow();
  }

  showPrevious() {
    this.currentIndex--;
    this.selectedModel.toggleShow();
  }

  render() {
    if (resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.composer.setSize(canvas.width, canvas.height);
    }

    this.selectedModel.animate();
    this.galaxy.animate();
    this.switchToNextModel();

    this.controls.update();
    this.composer.render();
  }
}
