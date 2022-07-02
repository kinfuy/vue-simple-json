<template>
  <div
    v-if="stateData"
    :class="['json-node', { 'node-active': (isHover || isEdit) && !isExtend }]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span
      v-if="!stateData.root"
      class="json-node-key"
      :style="{ color: keyColor }"
    >
      <ValueEditor
        :disabled="typeof stateData.key === 'number' || disabled"
        :value="stateData.key"
        @change="handleValueChange($event, json, 'key')"
        @focus="handleValueFocus"
        @blur="handleValueBlur"
      />
    </span>
    <span v-if="!stateData.root" class="json-node-separator">:</span>
    <span :class="['json-node-value']">
      <span
        v-if="isSub && !valueSlot"
        class="hidden-separator"
        @click="handleExtend()"
      >
        <IconSvg v-if="isExtend" color="#fff" :size="12">
          <IconArrowDown />
        </IconSvg>
        <IconSvg v-else color="#fff" :size="12"> <IconArrowRight /></IconSvg>
      </span>
      <span v-if="isSub && !valueSlot">{{
        stateData.type === 'object' ? '{' : '['
      }}</span>
      <span
        v-if="isSub && isExtend && !disabled && !valueSlot"
        @click="handleAddAttr()"
      >
        <IconSvg color="#71aff1" :size="16"> <IconAdd /> </IconSvg>
      </span>
      <span v-if="isSub && !isExtend && !valueSlot">......</span>
      <slot
        v-if="valueSlot"
        name="node-value"
        :node-value="stateData"
        :handle-change="handleSlotValueChange"
      />
      <ValueEditor
        v-if="!isSub && !valueSlot"
        :key="stateData.id"
        :type="stateData.type"
        :value="stateData.value"
        :disabled="disabled"
        @change="handleValueChange($event, json, 'value')"
        @focus="handleValueFocus"
        @blur="handleValueBlur"
      />
      <template v-if="isSub && !valueSlot">
        <slot v-if="isExtend" name="sub-node" :node="json.value" />
        <span :class="{ 'root-brackets': stateData.root && isExtend }">{{
          json.type === 'object' ? '}' : ']'
        }}</span>
      </template>
      <span
        v-if="!disabled && !isExtend && !stateData.root && isHover"
        class="json-operate-warper"
      >
        <slot
          name="type-switch"
          :allow-type="allowType"
          :node-value="stateData"
        >
          <select
            id="dataType"
            v-model="stateData.type"
            name="dataType"
            @change="handleSwitch(stateData)"
          >
            <option
              v-for="datatype in allowType"
              :key="datatype.type"
              :value="datatype.type"
            >
              {{ datatype.desc }}
            </option>
          </select>
        </slot>
      </span>
      <template v-for="operate in customAppendOperate" :key="operate.key">
        <span
          v-if="!disabled && !isExtend && !stateData.root && isHover"
          :title="operate.title"
          :class="['json-custom-warper', operate.className]"
          @click="handleCustom(operate)"
        >
          <Render v-if="operate.render" :render="operate.render" />
          <span v-else> {{ operate.text }}</span>
        </span>
      </template>
    </span>
  </div>
</template>
<script lang="tsx">
import { computed, defineComponent, inject, ref, watch } from 'vue';
import {
  _UUID,
  deepAnalysisJson,
  deepCopy,
  deepReductionJson,
  mergeArray,
  updataArrIndex,
} from '../utils';
import ValueEditor from './ValueEditor.vue';
import IconSvg from './Icon/IconSvg.vue';
import { defaultConfig } from './../libs/defaultConfig';
import Render from './Render';
import {
  IconAdd,
  IconArrowDown,
  IconArrowRight,
  IconDelete,
} from './Icon/libs';
import type { PropType } from 'vue';
import type {
  EventTrigger,
  JsonEditorContext,
  JsonItem,
  OperationEvent,
  OperationItem,
} from './../type/simple-json';
export default defineComponent({
  name: 'JsonNode',
  components: {
    ValueEditor,
    IconSvg,
    Render,
    IconArrowRight,
    IconArrowDown,
    IconAdd,
  },
  props: {
    json: {
      type: Object as PropType<JsonItem>,
      required: true,
    },
    currectLevel: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const stateData = ref<JsonItem | undefined>(undefined);

    const { extendLevel, extendAll, extendCatchKey, disabled, jsonConfig } =
      inject('JsonEditorContext') as JsonEditorContext;

    watch(
      () => props.json,
      (val) => {
        stateData.value = val;
      },
      {
        immediate: true,
      }
    );
    // 用户允许类型
    const allowType = computed(() => {
      if (jsonConfig.value && jsonConfig.value.allowType)
        return mergeArray(jsonConfig.value.allowType, defaultConfig.allowType);
      return defaultConfig.allowType;
    });

    // 删除属性
    const handleAttrDelete: OperationEvent = () => {
      if (eventTrigger) eventTrigger('delete', deepCopy(stateData.value));
      eventTrigger('extend', {
        isExtend: false,
        id: stateData.value?.id || null,
      });
      return Promise.resolve();
    };

    // 默认按钮
    const defaultMenu: OperationItem = {
      key: 'delete',
      title: '删除',
      clickEvent: handleAttrDelete,
      render: () => (
        <>
          <IconSvg color="red" size={16}>
            <IconDelete />
          </IconSvg>
        </>
      ),
    };

    // 生成用户操作
    const customAppendOperate = computed(() => {
      if (jsonConfig.value && jsonConfig.value.appendOperate) {
        if (
          jsonConfig.value.appendOperate.some((x) => x.key === defaultMenu.key)
        ) {
          return jsonConfig.value.appendOperate;
        }
        return [defaultMenu, ...jsonConfig.value.appendOperate];
      }
      return [defaultMenu];
    });

    // 是否需要递归处理
    const isSub = computed(() => {
      return (
        stateData.value &&
        (stateData.value.type === 'array' || stateData.value.type === 'object')
      );
    });

    // 折叠展开
    const isExtend = ref(false);
    const eventTrigger = inject('eventTrigger') as EventTrigger;
    watch(
      () => extendLevel.value,
      (val) => {
        const extend = extendCatchKey.value.some((x) => {
          return x.id === stateData.value?.id || null;
        });
        const isCanExtendChildren =
          stateData.value &&
          Array.isArray(stateData.value.value) &&
          stateData.value.value.length > 0;
        if (
          (val >= props.currectLevel && isCanExtendChildren) ||
          extendAll.value ||
          extend
        ) {
          isExtend.value = true;
          eventTrigger('extend', {
            isExtend: isExtend.value,
            id: stateData.value?.id,
          });
        }
      },
      {
        immediate: true,
      }
    );

    const handleExtend = () => {
      isExtend.value = !isExtend.value;
      eventTrigger('extend', {
        isExtend: isExtend.value,
        id: stateData.value?.id,
      });
    };

    const handleSwitch = (item?: JsonItem) => {
      if (!item) return;
      if (item.type === 'array' || item.type === 'object') {
        item.value = [];
      } else {
        allowType.value.forEach((x) => {
          if (x.type === item.type) {
            item.value = x.default;
          }
        });
      }
      eventTrigger('type-switch', {
        level: props.currectLevel,
        key: stateData.value?.key,
        value: stateData.value?.value,
      });
    };

    // 鼠标悬浮
    const hoverNodeId = ref('');
    const handleMouseEnter = () => {
      hoverNodeId.value = stateData.value?.id || '';
    };
    const handleMouseLeave = () => {
      hoverNodeId.value = '';
    };
    const isHover = computed(() => {
      return hoverNodeId.value === stateData.value?.id;
    });

    // 修改json
    const handleValueChange = (
      value: any,
      item: JsonItem,
      type: 'key' | 'value' = 'value'
    ) => {
      item[type] = value;
      if (eventTrigger) eventTrigger('change', deepCopy(stateData.value));
    };
    const handleSlotValueChange = (value: any) => {
      if (stateData.value) stateData.value.value = value;
      if (eventTrigger) eventTrigger('change', deepCopy(stateData.value));
    };
    // node-active
    const currectEditId = ref();
    const handleValueFocus = () => {
      currectEditId.value = stateData.value?.id;
    };
    const isEdit = computed(() => {
      return currectEditId.value === stateData.value?.id;
    });
    const handleValueBlur = () => {
      currectEditId.value = undefined;
    };
    // 添加属性
    const handleAddAttr = () => {
      const key =
        stateData.value?.type === 'array'
          ? stateData.value.value.length
          : 'defalut';
      const neWAttr = {
        id: _UUID(),
        key,
        value: 'new attr',
        type: 'string',
      };
      const addType =
        jsonConfig.value.addType !== undefined
          ? jsonConfig.value.addType
          : defaultConfig.addType;
      if (addType && stateData.value) {
        stateData.value.value.unshift(neWAttr);
        updataArrIndex(stateData.value);
      } else {
        stateData.value?.value.push(neWAttr);
      }
      if (eventTrigger) eventTrigger('change', deepCopy(stateData.value));
    };

    // key color
    const keyColor = computed(() => {
      let rst = '';
      if (stateData.value) {
        rst = defaultConfig.keyColor[stateData.value.type];
      }
      if (jsonConfig.value && jsonConfig.value.keyColor && stateData.value) {
        if (jsonConfig.value.keyColor[stateData.value.type]) {
          rst = jsonConfig.value.keyColor[stateData.value.type];
        }
      }
      return rst;
    });

    // 用户自定义操作
    // 如果用户返回值，将该值改为用户操作返回值
    const handleCustom = (operate: OperationItem) => {
      console.log('handleCustom');
      console.log('log=>JsonNode=>348:operate:%o', operate);
      if (stateData.value) {
        const currect = {
          key: stateData.value.key,
          value: isSub.value
            ? deepReductionJson(stateData.value.value)
            : deepCopy(stateData.value.value),
        };
        operate.clickEvent(currect).then((customValue) => {
          if (customValue && stateData.value) {
            stateData.value.type = customValue.type;
            if (customValue.type === 'array' || customValue.type === 'object') {
              stateData.value.value = deepAnalysisJson({
                [stateData.value.key]: customValue,
              })[0].value;
            } else {
              stateData.value.value = customValue.value;
            }
          }
        });
      }
    };

    const valueSlot = computed(() => {
      let isSlot = false;
      allowType.value.forEach((x) => {
        if (x.type === stateData.value?.type) {
          isSlot = x.slot;
        }
      });
      if (stateData.value) return isSlot && !stateData.value.root;
      return isSlot;
    });
    return {
      stateData,
      isSub,
      isEdit,
      isExtend,
      extendLevel,
      extendAll,
      keyColor,
      extendCatchKey,
      disabled,
      handleExtend,
      handleSwitch,
      isHover,
      jsonConfig,
      handleMouseEnter,
      handleMouseLeave,
      handleValueChange,
      handleSlotValueChange,
      handleAddAttr,
      handleValueFocus,
      handleValueBlur,
      handleCustom,
      allowType,
      customAppendOperate,
      valueSlot,
    };
  },
});
</script>
