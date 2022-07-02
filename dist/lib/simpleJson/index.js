'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var JsonEditor = require('./JsonEditor.js');

const withInstall = (comp, extra) => {
  const c = comp;
  c.install = function(app) {
    if (c !== void 0) {
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
  return comp;
};
const SimpleJson = withInstall(JsonEditor["default"]);

exports.SimpleJson = SimpleJson;
exports["default"] = SimpleJson;
