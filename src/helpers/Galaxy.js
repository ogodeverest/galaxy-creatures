import {
  Object3D,
  ShaderMaterial,
  TextureLoader,
  Color,
  BufferGeometry,
  AdditiveBlending,
  Float32BufferAttribute,
  Points,
} from "three";
import Star from "./Star";
import galaxyColors from "./galaxyColors";

export default class Galaxy extends Object3D {
  constructor() {
    super();
    this.createStars();
  }

  createStars() {
    const sparklesMaterial = new ShaderMaterial({
      uniforms: {
        pointTexture: {
          value: new TextureLoader().load("./static/textures/dotTexture.png"),
        },
      },
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
      blending: AdditiveBlending,
      alphaTest: 1.0,
      transparent: true,
    });

    this.stars = [];
    const galaxyGeometryVertices = [];
    const galaxyGeometryColors = [];
    const galaxyGeometrySizes = [];

    for (let i = 0; i < 1500; i++) {
      const star = new Star();
      star.setup(
        new Color(
          galaxyColors[Math.floor(Math.random() * galaxyColors.length)]
        ).multiplyScalar(0.8)
      );
      galaxyGeometryVertices.push(star.x, star.y, star.z);
      galaxyGeometryColors.push(star.color.r, star.color.g, star.color.b);
      galaxyGeometrySizes.push(star.size);
      this.stars.push(star);
    }
    this.starsGeometry = new BufferGeometry();
    this.starsGeometry.setAttribute(
      "size",
      new Float32BufferAttribute(galaxyGeometrySizes, 1)
    );
    this.starsGeometry.setAttribute(
      "color",
      new Float32BufferAttribute(galaxyGeometryColors, 3)
    );
    this.galaxyPoints = new Points(this.starsGeometry, sparklesMaterial);
    this.add(this.galaxyPoints);
  }
  animate() {
    this.galaxyPoints.rotation.y += 0.0005;

    let tempStarsArray = [];
    this.stars.forEach((s) => {
      s.update();
      tempStarsArray.push(s.x, s.y, s.z);
    });

    this.starsGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(tempStarsArray, 3)
    );
  }
}
