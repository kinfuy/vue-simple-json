import { defineComponent, ref, inject, watch, computed, createVNode, Fragment } from 'vue';
import { mergeArray, deepCopy, _UUID, updataArrIndex, deepReductionJson, deepAnalysisJson } from '../utils/index.mjs';
import ValueEditor from './ValueEditor.mjs';
import IconSvg from './Icon/IconSvg.mjs';
import { defaultConfig } from '../libs/defaultConfig.mjs';
import Render from './Render/index.mjs';
import IconAdd from './Icon/libs/icon-add.mjs';
import IconArrowDown from './Icon/libs/icon-arrow-down.mjs';
import IconArrowRight from './Icon/libs/icon-arrow-right.mjs';
import './Icon/libs/icon-auth.mjs';
import './Icon/libs/icon-date-point.mjs';
import IconDelete from './Icon/libs/icon-delete.mjs';
import './Icon/libs/icon-lock.mjs';
import './Icon/libs/icon-set.mjs';
import './Icon/libs/icon-switch-down.mjs';
import './Icon/libs/icon-switch.mjs';
import './Icon/libs/icon-time.mjs';

var _sfc_main = defineComponent({
  name: "JsonNode",
  components: {
    ValueEditor,
    IconSvg,
    Render,
    IconArrowRight,
    IconArrowDown,
    IconAdd
  },
  props: {
    json: {
      type: Object,
      required: true
    },
    currectLevel: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const stateData = ref(null);
    const {
      extendLevel,
      extendAll,
      extendCatchKey,
      disabled,
      jsonConfig
    } = inject("JsonEditorContext", {});
    watch(() => props.json, (val) => {
      stateData.value = val;
    }, {
      immediate: true
    });
    const allowType = computed(() => {
      if (jsonConfig.value && jsonConfig.value.allowType)
        return mergeArray(jsonConfig.value.allowType, defaultConfig.allowType);
      return defaultConfig.allowType;
    });
    const handleAttrDelete = () => {
      var _a;
      if (eventTrigger)
        eventTrigger("delete", deepCopy(stateData.value));
      eventTrigger("extend", {
        isExtend: false,
        id: ((_a = stateData.value) == null ? void 0 : _a.id) || null
      });
      return Promise.resolve();
    };
    const defaultMenu = {
      key: "delete",
      title: "\u5220\u9664",
      clickEvent: handleAttrDelete,
      render: () => createVNode(Fragment, null, [createVNode(IconSvg, {
        "color": "red",
        "size": 16
      }, {
        default: () => [createVNode(IconDelete, null, null)]
      })])
    };
    const customAppendOperate = computed(() => {
      if (jsonConfig.value && jsonConfig.value.appendOperate) {
        if (jsonConfig.value.appendOperate.some((x) => x.key === defaultMenu.key)) {
          return jsonConfig.value.appendOperate;
        }
        return [defaultMenu, ...jsonConfig.value.appendOperate];
      }
      return [defaultMenu];
    });
    const isSub = computed(() => {
      return stateData.value && (stateData.value.type === "array" || stateData.value.type === "object");
    });
    const isExtend = ref(false);
    const eventTrigger = inject("eventTrigger");
    watch(() => extendLevel.value, (val) => {
      var _a;
      const extend = extendCatchKey.value.some((x) => {
        var _a2;
        return x.id === ((_a2 = stateData.value) == null ? void 0 : _a2.id) || null;
      });
      const isCanExtendChildren = stateData.value && Array.isArray(stateData.value.value) && stateData.value.value.length > 0;
      if (val >= props.currectLevel && isCanExtendChildren || extendAll.value || extend) {
        isExtend.value = true;
        eventTrigger("extend", {
          isExtend: isExtend.value,
          id: (_a = stateData.value) == null ? void 0 : _a.id
        });
      }
    }, {
      immediate: true
    });
    const handleExtend = () => {
      var _a;
      isExtend.value = !isExtend.value;
      eventTrigger("extend", {
        isExtend: isExtend.value,
        id: (_a = stateData.value) == null ? void 0 : _a.id
      });
    };
    const handleSwitch = (item) => {
      var _a, _b;
      if (!item)
        return;
      if (item.type === "array" || item.type === "object") {
        item.value = [];
      } else {
        allowType.value.forEach((x) => {
          if (x.type === item.type) {
            item.value = x.default;
          }
        });
      }
      eventTrigger("type-switch", {
        level: props.currectLevel,
        key: (_a = stateData.value) == null ? void 0 : _a.key,
        value: (_b = stateData.value) == null ? void 0 : _b.value
      });
    };
    const hoverNodeId = ref("");
    const handleMouseEnter = () => {
      var _a;
      hoverNodeId.value = ((_a = stateData.value) == null ? void 0 : _a.id) || "";
    };
    const handleMouseLeave = () => {
      hoverNodeId.value = "";
    };
    const isHover = computed(() => {
      var _a;
      return hoverNodeId.value === ((_a = stateData.value) == null ? void 0 : _a.id);
    });
    const handleValueChange = (value, item, type = "value") => {
      item[type] = value;
      if (eventTrigger)
        eventTrigger("change", deepCopy(stateData.value));
    };
    const handleSlotValueChange = (value) => {
      if (stateData.value)
        stateData.value.value = value;
      if (eventTrigger)
        eventTrigger("change", deepCopy(stateData.value));
    };
    const currectEditId = ref();
    const handleValueFocus = () => {
      var _a;
      currectEditId.value = (_a = stateData.value) == null ? void 0 : _a.id;
    };
    const isEdit = computed(() => {
      var _a;
      return currectEditId.value === ((_a = stateData.value) == null ? void 0 : _a.id);
    });
    const handleValueBlur = () => {
      currectEditId.value = void 0;
    };
    const handleAddAttr = () => {
      var _a, _b;
      const key = ((_a = stateData.value) == null ? void 0 : _a.type) === "array" ? stateData.value.value.length : "defalut";
      const neWAttr = {
        id: _UUID(),
        key,
        value: "new attr",
        type: "string"
      };
      const addType = jsonConfig.value.addType !== void 0 ? jsonConfig.value.addType : defaultConfig.addType;
      if (addType && stateData.value) {
        stateData.value.value.unshift(neWAttr);
        updataArrIndex(stateData.value);
      } else {
        (_b = stateData.value) == null ? void 0 : _b.value.push(neWAttr);
      }
      if (eventTrigger)
        eventTrigger("change", deepCopy(stateData.value));
    };
    const keyColor = computed(() => {
      let rst = "";
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
    const handleCustom = (operate) => {
      if (stateData.value) {
        const currect = {
          key: stateData.value.key,
          value: isSub.value ? deepReductionJson(stateData.value.value) : deepCopy(stateData.value.value)
        };
        operate.clickEvent(currect).then((customValue) => {
          if (customValue && stateData.value) {
            stateData.value.type = customValue.type;
            if (customValue.type === "array" || customValue.type === "object") {
              stateData.value.value = deepAnalysisJson({
                [stateData.value.key]: customValue
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
        if (stateData.value && x.type === stateData.value.type) {
          isSlot = x.slot || false;
        }
      });
      if (stateData.value)
        return isSlot && !stateData.value.root;
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
      valueSlot
    };
  }
});

export { _sfc_main as default };
