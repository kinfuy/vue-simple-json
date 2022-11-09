import { computed, defineComponent, watch } from 'vue';
import { JsonEditor } from '../core/editor';
import LineNode from './line-node';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'StateEditor',
  props: {
    json: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
  },
  setup(props) {
    const editor = new JsonEditor(props.json);

    watch(
      () => props.json,
      (val) => {
        editor.import(val);
      }
    );

    const lineRoot = computed(() => {
      return editor.lineRoot;
    });

    const validate = () => {
      if (document.body.querySelector('.line-error')) return false;
      return true;
    };
    const exportJson = () => {
      return editor.json;
    };
    return {
      lineRoot,
      exportJson,
      validate,
    };
  },
  render() {
    return (
      <div class="simple-json-editor">
        <LineNode line={this.lineRoot} />
      </div>
    );
  },
});
