import { createRouter, createWebHistory } from 'vue-router';
import RestaurantList from '../components/RestaurantList.vue';
import RestaurantInfo from '../components/RestaurantInfo.vue';
import Register from '../components/Register.vue';

const routes = [
  { path: '/', name: 'Home', component: RestaurantList },
  { path: '/register', component: Register },
  { path: '/restaurant/:id', name: 'RestaurantInfo', component: RestaurantInfo, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
