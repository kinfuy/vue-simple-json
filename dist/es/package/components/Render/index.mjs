const Render = (props) => {
  return props.render();
};
Render.props = {
  render: {
    type: Function
  }
};

export { Render as default };
