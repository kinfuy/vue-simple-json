'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Render = (props) => {
  return props.render();
};
Render.props = {
  render: {
    type: Function
  }
};

exports["default"] = Render;
