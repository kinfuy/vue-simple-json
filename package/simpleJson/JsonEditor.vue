<template>
  <SubJsonNode :json="stateData" :currect-level="1">
    <template #type-switch="{ nodeValue, allowType }">
      <slot
        name="type-switch"
        :allow-type="allowType"
        :node-value="nodeValue"
      />
    </template>
    <template #node-value="{ nodeValue, handleChange }">
      <slot
        name="node-value"
        :node-value="nodeValue"
        :handle-change="handleChange"
      />
    </template>
  </SubJsonNode>
</template>
<script lang="ts">
import { defineComponent, provide, ref, toRefs, watch } from 'vue';
import { deepDeleteJson, deepUpdataJson } from './utils';
import SubJsonNode from './components/SubJsonNode.vue';
import type { PropType } from 'vue';
import type {
  ExtendCatchKeyItem,
  JsonEditorConfig,
  JsonItem,
  PropJsonItem,
  SpeciallyKeyItem,
} from './type/simple-json';
export default defineComponent({
  name: 'SimpleJson',
  components: { SubJsonNode },
  props: {
    json: {
      type: Array as PropType<Array<PropJsonItem>>,
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
      default: 0,
    },
    speciallyKey: {
      type: Array as PropType<Array<SpeciallyKeyItem>>,
      default: () => [],
    },
    config: {
      type: Object as PropType<JsonEditorConfig>,
      default: () => {},
    },
  },
  emits: ['update:value', 'change', 'extend', 'delete', 'type-switch'],
  setup(props, { emit }) {
    const stateData = ref<JsonItem>({
      id: 'root',
      key: '',
      value: '',
      type: 'object',
      root: true,
    });

    const extendCatchKey = ref<ExtendCatchKeyItem[]>([]);

    watch(
      () => props.json,
      (val: Array<PropJsonItem>) => {
        if (val) stateData.value.value = val;
      },
      {
        immediate: true,
        deep: true,
      }
    );

    // json change
    const handleChange = async (
      name: 'change' | 'extend' | 'delete',
      value: any
    ) => {
      if (!value.root) {
        deepUpdataJson(stateData.value, value.id, value.key, value.value);
      }
      emit(name, stateData.value.value);
    };

    // 展开折叠
    const handleExtend = (value: { id: string; isExtend: boolean }) => {
      const exist = extendCatchKey.value.some((x) => {
        return value.id === x.id;
      });
      if (exist) {
        if (!value.isExtend) {
          for (let i = 0; i < extendCatchKey.value.length; i++) {
            if (value.id === extendCatchKey.value[i].id) {
              extendCatchKey.value.splice(i, 1);
              i--;
            }
          }
        }
      } else if (value.isExtend) {
        extendCatchKey.value.push({ id: value.id });
      }
      emit('extend', extendCatchKey.value);
    };

    //删除属性
    const handleAttrDelete = async (
      name: 'change' | 'extend' | 'delete',
      value: any
    ) => {
      deepDeleteJson(stateData.value, value.id);
      emit('change', stateData.value.value);
      emit('delete', value);
    };

    // 触发事件
    const eventTrigger = (
      name: 'change' | 'extend' | 'delete' | 'type-switch',
      value: any
    ) => {
      if (name === 'change') handleChange(name, value);
      if (name === 'delete') handleAttrDelete(name, value);
      if (name === 'extend') handleExtend(value);
      if (name === 'type-switch') emit(name, value);
    };

    provide('eventTrigger', eventTrigger);

    const { disabled, extendAll, extendLevel, config } = toRefs(props);
    provide('JsonEditorContext', {
      extendCatchKey,
      disabled,
      extendAll,
      extendLevel,
      jsonConfig: config,
    });
    return {
      stateData,
      extendCatchKey,
    };
  },
});
</script>
