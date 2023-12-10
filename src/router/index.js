import { createRouter, createWebHistory } from 'vue-router';
import ThreeDObjectGenerator from '../components/ThreeDObjectGenerator.vue';

const routes = [
  {
    path: '/geometry1',
    components: {
      geometry1: ThreeDObjectGenerator,
    },
    props: {
      geometry1: { shapePoints: [[0,0],[0,10],[15,10],[7,15],[7,8],[7,0]], editableHeight: 15, editableColor: '#00ff00' },
    },
  },
  {
    path: '/geometry2',
    components: {
      geometry2: ThreeDObjectGenerator,
    },
    props: {
      geometry2: { shapePoints: [[0,0], [7,12], [0,14]], editableHeight: 5, editableColor: '#00ff00' },
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
