import { createApp } from 'vue';
import App from './App.vue';
import { SimpleJson } from '../lib/index.js';
createApp(App).use(SimpleJson).mount('#app');
