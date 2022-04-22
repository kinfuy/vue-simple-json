import { createApp } from 'vue';
import App from './App.vue';
import { SimpleJson } from '../dist';
import '../dist/style/index.css';
createApp(App).use(SimpleJson).mount('#app');
