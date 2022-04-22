import SimpleJson from './JsonEditor.mjs';
import './components/Icon/iconfont.mjs';

const install = (app) => {
  app.component("SimpleJson", SimpleJson);
  return app;
};
var index = {
  install
};

export { index as default };
