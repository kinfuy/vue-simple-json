import { App } from 'vue';
import SimpleJson from './JsonEditor.vue';
import './components/Icon/iconfont.js';
const install = (app: App) => {
  app.component('SimpleJson', SimpleJson);
  return app;
};
export default {
  install
};
