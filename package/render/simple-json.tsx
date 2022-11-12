import { computed, defineComponent, provide, ref, watch } from 'vue';
import { JsonEditor } from '../core/editor';
import LineNode from './line-node';
import type { SimpleJsonConfig } from './defaultConfig';
import type { InjectionKey, PropType, Ref } from 'vue';

interface SimpleContent {
  activekeys: Ref<string[]>;
  clearActive: () => void;
  setActive: (ids: string[]) => void;
}

export const SIMPLEJSON_INJECTKEY: InjectionKey<SimpleContent> =
  Symbol('simple-json');

export default defineComponent({
  name: 'StateEditor',
  props: {
    json: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    extendAll: {
      type: Boolean,
      default: false,
    },
    extendLevel: {
      type: Number,
      default: 1,
    },
    extraConfig: {
      type: Object as PropType<SimpleJsonConfig>,
      default: undefined,
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

    const activekeys = ref<string[]>([]);

    provide(SIMPLEJSON_INJECTKEY, {
      activekeys,
      setActive: (ids: string[]) => {
        activekeys.value.push(...ids);
      },
      clearActive: () => {
        activekeys.value = [];
      },
    });
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
