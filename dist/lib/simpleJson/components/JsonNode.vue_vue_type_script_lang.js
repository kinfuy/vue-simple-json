'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var index$1 = require('../utils/index.js');
var ValueEditor = require('./ValueEditor.js');
var IconSvg = require('./Icon/IconSvg.js');
var defaultConfig = require('../libs/defaultConfig.js');
var index = require('./Render/index.js');
var iconAdd = require('./Icon/libs/icon-add.js');
var iconArrowDown = require('./Icon/libs/icon-arrow-down.js');
var iconArrowRight = require('./Icon/libs/icon-arrow-right.js');
require('./Icon/libs/icon-auth.js');
require('./Icon/libs/icon-date-point.js');
var iconDelete = require('./Icon/libs/icon-delete.js');
require('./Icon/libs/icon-lock.js');
require('./Icon/libs/icon-set.js');
require('./Icon/libs/icon-switch-down.js');
require('./Icon/libs/icon-switch.js');
require('./Icon/libs/icon-time.js');

var _sfc_main = vue.defineComponent({
  name: "JsonNode",
  components: {
    ValueEditor: ValueEditor["default"],
    IconSvg: IconSvg["default"],
    Render: index["default"],
    IconArrowRight: iconArrowRight["default"],
    IconArrowDown: iconArrowDown["default"],
    IconAdd: iconAdd["default"]
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
    const stateData = vue.ref(void 0);
    const {
      extendLevel,
      extendAll,
      extendCatchKey,
      disabled,
      jsonConfig
    } = vue.inject("JsonEditorContext");
    vue.watch(() => props.json, (val) => {
      stateData.value = val;
    }, {
      immediate: true
    });
    const allowType = vue.computed(() => {
      if (jsonConfig.value && jsonConfig.value.allowType)
        return index$1.mergeArray(jsonConfig.value.allowType, defaultConfig.defaultConfig.allowType);
      return defaultConfig.defaultConfig.allowType;
    });
    const handleAttrDelete = () => {
      var _a;
      if (eventTrigger)
        eventTrigger("delete", index$1.deepCopy(stateData.value));
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
      render: () => vue.createVNode(vue.Fragment, null, [vue.createVNode(IconSvg["default"], {
        "color": "red",
        "size": 16
      }, {
        default: () => [vue.createVNode(iconDelete["default"], null, null)]
      })])
    };
    const customAppendOperate = vue.computed(() => {
      if (jsonConfig.value && jsonConfig.value.appendOperate) {
        if (jsonConfig.value.appendOperate.some((x) => x.key === defaultMenu.key)) {
          return jsonConfig.value.appendOperate;
        }
        return [defaultMenu, ...jsonConfig.value.appendOperate];
      }
      return [defaultMenu];
    });
    const isSub = vue.computed(() => {
      return stateData.value && (stateData.value.type === "array" || stateData.value.type === "object");
    });
    const isExtend = vue.ref(false);
    const eventTrigger = vue.inject("eventTrigger");
    vue.watch(() => extendLevel.value, (val) => {
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
    const hoverNodeId = vue.ref("");
    const handleMouseEnter = () => {
      var _a;
      hoverNodeId.value = ((_a = stateData.value) == null ? void 0 : _a.id) || "";
    };
    const handleMouseLeave = () => {
      hoverNodeId.value = "";
    };
    const isHover = vue.computed(() => {
      var _a;
      return hoverNodeId.value === ((_a = stateData.value) == null ? void 0 : _a.id);
    });
    const handleValueChange = (value, item, type = "value") => {
      item[type] = value;
      if (eventTrigger)
        eventTrigger("change", index$1.deepCopy(stateData.value));
    };
    const handleSlotValueChange = (value) => {
      if (stateData.value)
        stateData.value.value = value;
      if (eventTrigger)
        eventTrigger("change", index$1.deepCopy(stateData.value));
    };
    const currectEditId = vue.ref();
    const handleValueFocus = () => {
      var _a;
      currectEditId.value = (_a = stateData.value) == null ? void 0 : _a.id;
    };
    const isEdit = vue.computed(() => {
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
        id: index$1._UUID(),
        key,
        value: "new attr",
        type: "string"
      };
      const addType = jsonConfig.value.addType !== void 0 ? jsonConfig.value.addType : defaultConfig.defaultConfig.addType;
      if (addType && stateData.value) {
        stateData.value.value.unshift(neWAttr);
        index$1.updataArrIndex(stateData.value);
      } else {
        (_b = stateData.value) == null ? void 0 : _b.value.push(neWAttr);
      }
      if (eventTrigger)
        eventTrigger("change", index$1.deepCopy(stateData.value));
    };
    const keyColor = vue.computed(() => {
      let rst = "";
      if (stateData.value) {
        rst = defaultConfig.defaultConfig.keyColor[stateData.value.type];
      }
      if (jsonConfig.value && jsonConfig.value.keyColor && stateData.value) {
        if (jsonConfig.value.keyColor[stateData.value.type]) {
          rst = jsonConfig.value.keyColor[stateData.value.type];
        }
      }
      return rst;
    });
    const handleCustom = (operate) => {
      console.log("handleCustom");
      console.log("log=>JsonNode=>348:operate:%o", operate);
      if (stateData.value) {
        const currect = {
          key: stateData.value.key,
          value: isSub.value ? index$1.deepReductionJson(stateData.value.value) : index$1.deepCopy(stateData.value.value)
        };
        operate.clickEvent(currect).then((customValue) => {
          if (customValue && stateData.value) {
            stateData.value.type = customValue.type;
            if (customValue.type === "array" || customValue.type === "object") {
              stateData.value.value = index$1.deepAnalysisJson({
                [stateData.value.key]: customValue
              })[0].value;
            } else {
              stateData.value.value = customValue.value;
            }
          }
        });
      }
    };
    const valueSlot = vue.computed(() => {
      let isSlot = false;
      allowType.value.forEach((x) => {
        var _a;
        if (x.type === ((_a = stateData.value) == null ? void 0 : _a.type)) {
          isSlot = x.slot;
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

exports["default"] = _sfc_main;
