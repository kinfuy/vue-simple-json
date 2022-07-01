import JsonEditor from './JsonEditor.vue';
import type { App, Plugin } from 'vue';

const withInstall = <T, E extends Record<string, any>>(comp: T, extra?: E) => {
  const c = comp as any;
  c.install = function (app: App) {
    if (c !== undefined) {
      app.component(c.displayName || c.name, comp);
    }
    if (extra) {
      Object.values(extra).forEach((e) => {
        app.component(e.displayName || e.name, e);
      });
    }
  };

  if (extra) {
    Object.entries(extra).forEach(([key, e]) => {
      c[key] = e;
    });
  }

  return comp as T & Plugin & E;
};

export const SimpleJson = withInstall(JsonEditor);

export default SimpleJson;
