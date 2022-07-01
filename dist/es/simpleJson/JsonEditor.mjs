import { defineComponent, ref, watch, provide, toRef, resolveComponent, openBlock, createBlock, withCtx, renderSlot } from 'vue';
import { deepDeleteJson, deepUpdataJson } from './utils/index.mjs';
import SubJsonNode from './components/SubJsonNode.mjs';
import _export_sfc from '../_virtual/plugin-vue_export-helper.mjs';

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const _sfc_main = defineComponent({
  name: "SimpleJson",
  components: { SubJsonNode },
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
    const stateData = ref({
      id: "root",
      key: "",
      value: "",
      type: "object",
      root: true
    });
    const extendCatchKey = ref([]);
    watch(() => props.json, (val) => {
      if (val)
        stateData.value.value = val;
    }, {
      immediate: true,
      deep: true
    });
    const handleChange = (name, value) => __async(this, null, function* () {
      if (!value.root) {
        yield deepUpdataJson(stateData.value, value.id, value.key, value.value);
      }
      yield emit(name, stateData.value.value);
    });
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
    const handleAttrDelete = (name, value) => __async(this, null, function* () {
      yield deepDeleteJson(stateData.value, value.id);
      yield emit("change", stateData.value.value);
      emit("delete", value);
    });
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
    provide("eventTrigger", eventTrigger);
    provide("JsonEditorContext", {
      extendCatchKey,
      disabled: toRef(props, "disabled"),
      extendAll: toRef(props, "extendAll"),
      extendLevel: toRef(props, "extendLevel"),
      jsonConfig: toRef(props, "config")
    });
    return {
      stateData,
      extendCatchKey
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SubJsonNode = resolveComponent("SubJsonNode");
  return openBlock(), createBlock(_component_SubJsonNode, {
    json: _ctx.stateData,
    "currect-level": 1
  }, {
    "type-switch": withCtx(({ nodeValue, allowType }) => [
      renderSlot(_ctx.$slots, "type-switch", {
        allowType,
        nodeValue
      })
    ]),
    "node-value": withCtx(({ nodeValue, handleChange }) => [
      renderSlot(_ctx.$slots, "node-value", {
        nodeValue,
        handleChange
      })
    ]),
    _: 3
  }, 8, ["json"]);
}
var JsonEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:\\project\\\u4E2A\u4EBA\\simple-json\\package\\simpleJson\\JsonEditor.vue"]]);

export { JsonEditor as default };
