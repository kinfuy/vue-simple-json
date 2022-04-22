import { defineComponent, ref, watch, nextTick, openBlock, createElementBlock, createElementVNode, normalizeClass, withKeys, Fragment, createTextVNode, toDisplayString, createCommentVNode } from 'vue';
import _export_sfc from '../../_virtual/plugin-vue_export-helper.mjs';

const _sfc_main = defineComponent({
  name: "ValueEditor",
  props: {
    type: {
      type: String,
      default: "string"
    },
    value: {
      type: [String, Number, Boolean],
      default: ""
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  emits: ["update:value", "change", "focus", "blur"],
  setup(props, { emit }) {
    const valueEditorRef = ref(null);
    const stateValue = ref("");
    const isRefresh = ref(false);
    const isEdit = ref(false);
    watch(() => props.value, (val) => {
      stateValue.value = val;
    }, {
      immediate: true
    });
    const handleClick = () => {
      if (!props.disabled) {
        isEdit.value = true;
        nextTick(() => {
          if (valueEditorRef.value) {
            valueEditorRef.value.focus();
            emit("focus");
          }
        });
        stateValue.value = props.value;
      } else {
        isEdit.value = false;
      }
    };
    const edited = ref(false);
    const handleBlur = () => {
      isEdit.value = false;
      if (valueEditorRef.value && edited.value) {
        let value = valueEditorRef.value.innerText.replace(/^"|"$/g, "");
        if (props.type === "number") {
          value = Number(value) === Number(value) ? Number(value) : 0;
        }
        if (props.type === "boolean")
          value = !!value;
        emit("update:value", value);
        emit("change", value);
        isRefresh.value = true;
        setTimeout(() => {
          isRefresh.value = false;
        }, 0);
      }
      emit("blur");
    };
    const handleInput = () => {
      edited.value = true;
    };
    const handleEnter = (e) => {
      e.preventDefault();
    };
    return {
      isEdit,
      stateValue,
      handleClick,
      handleBlur,
      handleEnter,
      valueEditorRef,
      handleInput,
      isRefresh
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return !_ctx.isRefresh ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: "value-editor",
    spellcheck: "false",
    onClick: _cache[3] || (_cache[3] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    createElementVNode("span", {
      ref: "valueEditorRef",
      class: normalizeClass(["value-editor-text", { "value-editor-input": _ctx.isEdit }]),
      onBlur: _cache[0] || (_cache[0] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args)),
      onInput: _cache[1] || (_cache[1] = (...args) => _ctx.handleInput && _ctx.handleInput(...args)),
      onKeydown: _cache[2] || (_cache[2] = withKeys((...args) => _ctx.handleEnter && _ctx.handleEnter(...args), ["enter"]))
    }, [
      _ctx.type === "number" || _ctx.type === "boolean" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        createTextVNode(toDisplayString(_ctx.stateValue), 1)
      ], 2112)) : _ctx.type === "string" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        createTextVNode(toDisplayString(`"${_ctx.stateValue}"`), 1)
      ], 2112)) : createCommentVNode("v-if", true)
    ], 34)
  ])) : createCommentVNode("v-if", true);
}
var ValueEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "ValueEditor.vue"]]);

export { ValueEditor as default };
