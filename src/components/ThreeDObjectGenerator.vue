<template>
  <div class="threeContainer" ref="threeContainer">
    <div class="controls">
      <div class="color-controls" ref="colorControls"></div>
      <div class="height-controls" ref="heightControls"></div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  props: {
    shapePoints: {
      type: Array,
      required: true,
    },
    editableHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      localEditableHeight: this.editableHeight,
      localEditableColor: "#00ff00",
      form: null,
    };
  },
  watch: {
    editableHeight(newValue) {
      this.localEditableHeight = newValue;
      this.updateGeometry();
    },
  },
  mounted() {
    this.init();
    this.setupColorControls();
  },
  methods: {
    init() {
      const scene = new THREE.Scene();
      const sizes = { width: 800, height: 600 };
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        1000
      );
      const shape = new THREE.Shape(
        this.shapePoints.map((point) => new THREE.Vector2(point[0], point[1]))
      );

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: this.localEditableHeight,
      });
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(sizes.width, sizes.height);
      this.$refs.threeContainer.appendChild(renderer.domElement);

      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const form = new THREE.Mesh(geometry, material);
      scene.add(form);
      this.form = form;

      window.addEventListener("resize", () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      camera.position.set(0, 20, 100);
      controls.update();

      const gui = new dat.GUI();
      gui.add(this, "localEditableHeight", 0, 50).onChange((value) => {
        this.form.scale.z = value;
      });
      this.$refs.heightControls.appendChild(gui.domElement);
      camera.position.z = 0;

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
      };

      animate();
    },

    updateGeometry() {
      const shape = new THREE.Shape(
        this.shapePoints.map((point) => new THREE.Vector2(point[0], point[1]))
      );
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: this.localEditableHeight,
      });
      this.form.geometry = geometry;
    },

    updateMaterialColor() {
      this.form.material.color.set(this.localEditableColor);
    },

    setupColorControls() {
      const gui = new dat.GUI({ autoPlace: false });
      const colorObject = { color: this.localEditableColor };
      const colorController = gui.addColor(colorObject, "color");

      colorController.onChange(() => {
        this.localEditableColor = colorObject.color;
        this.updateMaterialColor();
      });

      this.$refs.colorControls.appendChild(gui.domElement);
    },
  },
};
</script>

<style>
.threeContainer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.controls {
  width: 100%;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}
</style>
