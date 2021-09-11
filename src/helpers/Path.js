import {
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
} from "three";
import galaxyColors from "./galaxyColors";
const materials = [
  new LineBasicMaterial({
    color: galaxyColors[0],
    transparent: true,
    opacity: 0.5,
  }),
  new LineBasicMaterial({
    color: galaxyColors[1],
    transparent: true,
    opacity: 0.5,
  }),
  new LineBasicMaterial({
    color: galaxyColors[2],
    transparent: true,
    opacity: 0.5,
  }),
  new LineBasicMaterial({
    color: galaxyColors[3],
    transparent: true,
    opacity: 0.5,
  }),
  new LineBasicMaterial({
    color: galaxyColors[4],
    transparent: true,
    opacity: 0.5,
  }),
];

export default class Path {
  constructor(index, sampler, tempPosition) {
    this.vertices = [];
    this.geometry = new BufferGeometry();
    this.sampler = sampler;
    this.tempPosition = tempPosition;

    this.material = materials[index % 4];

    this.line = new Line(this.geometry, this.material);

    this.sampler.sample(tempPosition);

    this.previousPoint = tempPosition.clone();
  }

  construct() {
    let pointFound = false;
    while (!pointFound) {
      this.sampler.sample(this.tempPosition);
      if (this.tempPosition.distanceTo(this.previousPoint) < 1) {
        this.vertices.push(
          this.tempPosition.x,
          this.tempPosition.y,
          this.tempPosition.z
        );
        this.previousPoint = this.tempPosition.clone();

        pointFound = true;
      }
    }
    this.geometry.setAttribute(
      "position",
      new Float32BufferAttribute(this.vertices, 3)
    );
  }

  deconstruct() {
    this.vertices.splice(this.vertices.length - 100, 100);
    this.geometry.setAttribute(
      "position",
      new Float32BufferAttribute(this.vertices, 3)
    );
  }
}
