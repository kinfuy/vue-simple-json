import { type PropType, defineComponent } from 'vue';
import LineNode from './line-node';
import type { LineTarget } from '../core/line';

export default defineComponent({
  name: 'LineChildren',
  props: {
    line: {
      type: Object as PropType<LineTarget>,
      default: () => {},
    },
  },
  render() {
    const { line } = this.$props;
    const children = line.children?.map((node) => {
      return <LineNode line={node}></LineNode>;
    });
    return children;
  },
});
