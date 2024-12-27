import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import store from './store';

import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');

//export const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://backend:3000';
export const API_URL = import.meta.env.VITE_API_URL;


