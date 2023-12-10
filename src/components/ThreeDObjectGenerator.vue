<template>
  <div class="threeContainer" ref="threeContainer">
    <div class="controls">
      <div class="color-controls" ref="colorControls"></div>
      <div class="height-controls" ref="heightControls"></div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
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
    editableColor: {
      type: String,
      default: "#00ff00",
    },
  },
  setup(props) {
    const localEditableHeight = ref(props.editableHeight);
    const localEditableColor = ref(props.editableColor);
    const form = ref(null);
    const threeContainer = ref(null);
    const colorControls = ref(null);
    const heightControls = ref(null);

    const init = () => {
      const scene = new THREE.Scene();
      const sizes = { width: 800, height: 600 };
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        1000
      );
      const shape = new THREE.Shape(
        props.shapePoints.map((point) => new THREE.Vector2(point[0], point[1]))
      );

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: localEditableHeight.value,
      });
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(sizes.width, sizes.height);
      threeContainer.value.appendChild(renderer.domElement);

      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const formValue = new THREE.Mesh(geometry, material);
      form.value = formValue;
      scene.add(formValue);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      camera.position.set(0, 30, 100);
      controls.update();

      const gui = new dat.GUI();
      gui.add(localEditableHeight, "value", 0, 50).onChange((value) => {
        formValue.scale.z = value;
      });
      heightControls.value.appendChild(gui.domElement);
      camera.position.z = 0;

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
      };

      animate();
    };

    const updateGeometry = () => {
      const shape = new THREE.Shape(
        props.shapePoints.map((point) => new THREE.Vector2(point[0], point[1]))
      );
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: localEditableHeight.value,
      });
      form.value.geometry = geometry;
    };

    const updateMaterialColor = () => {
      form.value.material.color.set(localEditableColor.value);
    };

    const setupColorControls = () => {
      const gui = new dat.GUI({ autoPlace: false });
      const colorObject = { color: localEditableColor.value };
      const colorController = gui.addColor(colorObject, "color");

      colorController.onChange(() => {
        localEditableColor.value = colorObject.color;
        updateMaterialColor();
      });

      colorControls.value.appendChild(gui.domElement);
    };

    onMounted(() => {
      init();
      setupColorControls();
    });

    watch(
      () => props.editableHeight,
      (newValue) => {
        localEditableHeight.value = newValue;
        updateGeometry();
      }
    );

    return {
      localEditableHeight,
      localEditableColor,
      form,
      updateGeometry,
      updateMaterialColor,
      setupColorControls,
      threeContainer,
      colorControls,
      heightControls,
    };
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
