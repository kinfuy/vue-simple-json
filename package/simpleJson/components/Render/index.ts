import type { PropType, VNodeArrayChildren } from 'vue';

export interface RenderProps {
  render: () => VNodeArrayChildren;
}

const Render = (props: RenderProps) => {
  return props.render();
};

Render.props = {
  render: {
    type: Function as PropType<() => VNodeArrayChildren>,
  },
};

export default Render;
