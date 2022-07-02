'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var index = require('./utils/index.js');
var SubJsonNode = require('./components/SubJsonNode.js');
var pluginVue_exportHelper = require('../_virtual/plugin-vue_export-helper.js');

const _sfc_main = vue.defineComponent({
  name: "SimpleJson",
  components: { SubJsonNode: SubJsonNode["default"] },
  props: {
    json: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    extendAll: {
      type: Boolean,
      default: false
    },
    extendLevel: {
      type: Number,
      default: 0
    },
    speciallyKey: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ["update:value", "change", "extend", "delete", "type-switch"],
  setup(props, { emit }) {
    const stateData = vue.ref({
      id: "root",
      key: "",
      value: "",
      type: "object",
      root: true
    });
    const extendCatchKey = vue.ref([]);
    vue.watch(() => props.json, (val) => {
      if (val)
        stateData.value.value = val;
    }, {
      immediate: true,
      deep: true
    });
    const handleChange = async (name, value) => {
      if (!value.root) {
        index.deepUpdataJson(stateData.value, value.id, value.key, value.value);
      }
      emit(name, stateData.value.value);
    };
    const handleExtend = (value) => {
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
      emit("extend", extendCatchKey.value);
    };
    const handleAttrDelete = async (name, value) => {
      index.deepDeleteJson(stateData.value, value.id);
      emit("change", stateData.value.value);
      emit("delete", value);
    };
    const eventTrigger = (name, value) => {
      if (name === "change")
        handleChange(name, value);
      if (name === "delete")
        handleAttrDelete(name, value);
      if (name === "extend")
        handleExtend(value);
      if (name === "type-switch")
        emit(name, value);
    };
    vue.provide("eventTrigger", eventTrigger);
    const { disabled, extendAll, extendLevel, config } = vue.toRefs(props);
    vue.provide("JsonEditorContext", {
      extendCatchKey,
      disabled,
      extendAll,
      extendLevel,
      jsonConfig: config
    });
    return {
      stateData,
      extendCatchKey
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SubJsonNode = vue.resolveComponent("SubJsonNode");
  return vue.openBlock(), vue.createBlock(_component_SubJsonNode, {
    json: _ctx.stateData,
    "currect-level": 1
  }, {
    "type-switch": vue.withCtx(({ nodeValue, allowType }) => [
      vue.renderSlot(_ctx.$slots, "type-switch", {
        allowType,
        nodeValue
      })
    ]),
    "node-value": vue.withCtx(({ nodeValue, handleChange }) => [
      vue.renderSlot(_ctx.$slots, "node-value", {
        nodeValue,
        handleChange
      })
    ]),
    _: 3
  }, 8, ["json"]);
}
var JsonEditor = /* @__PURE__ */ pluginVue_exportHelper["default"](_sfc_main, [["render", _sfc_render], ["__file", "D:\\project\\\u4E2A\u4EBA\\simple-json\\package\\simpleJson\\JsonEditor.vue"]]);

exports["default"] = JsonEditor;
