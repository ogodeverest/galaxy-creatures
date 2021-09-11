import { Object3D, Vector3 } from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import Path from "./Path";

export default class SampledModel extends Object3D {
  constructor(modelPath) {
    super();
    this.model = null;
    this.sampler = null;
    this.paths = [];
    this.show = true;
    this.maxVerticesPerPath = 12000;
    this.sampleModel(modelPath);
  }

  sampleModel(model) {
    const tempPosition = new Vector3();

    this.model = model;

    this.sampler = new MeshSurfaceSampler(this.model).build();

    for (let i = 0; i < 5; i++) {
      const path = new Path(i, this.sampler, tempPosition);
      this.paths.push(path);
      this.add(path.line);
    }
  }

  toggleShow() {
    this.show = !this.show;
  }

  constructModel() {
    this.paths.forEach((path) => {
      if (path.vertices.length < this.maxVerticesPerPath) {
        path.construct();
      }
    });
  }

  deconstructModel() {
    this.paths.forEach((path) => {
      if (path.vertices.length > 0) {
        path.deconstruct();
      }
    });
  }

  hidden() {
    return this.paths.every((path) => path.vertices.length === 0);
  }

  animate() {
    this.rotation.y += 0.002;
    if (this.show) {
      this.constructModel();
    } else {
      this.deconstructModel();
    }
  }

  isFinished() {
    return this.paths.every((path) => path.vertices.length === 12000);
  }
}
