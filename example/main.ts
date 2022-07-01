import { createApp } from 'vue';
import SimpleJson from '../package/index';
import App from './App.vue';
import '../package/style/index.less';
createApp(App).use(SimpleJson).mount('#app');
