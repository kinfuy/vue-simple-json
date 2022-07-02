'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var pluginVue_exportHelper = require('../../_virtual/plugin-vue_export-helper.js');

const _sfc_main = vue.defineComponent({
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
    const valueEditorRef = vue.ref(null);
    const stateValue = vue.ref("");
    const isRefresh = vue.ref(false);
    const isEdit = vue.ref(false);
    vue.watch(() => props.value, (val) => {
      stateValue.value = val;
    }, {
      immediate: true
    });
    const handleClick = () => {
      if (!props.disabled) {
        isEdit.value = true;
        vue.nextTick(() => {
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
    const edited = vue.ref(false);
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
  return !_ctx.isRefresh ? (vue.openBlock(), vue.createElementBlock("div", {
    key: 0,
    class: "value-editor",
    spellcheck: "false",
    onClick: _cache[3] || (_cache[3] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    vue.createElementVNode("span", {
      ref: "valueEditorRef",
      class: vue.normalizeClass(["value-editor-text", { "value-editor-input": _ctx.isEdit }]),
      onBlur: _cache[0] || (_cache[0] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args)),
      onInput: _cache[1] || (_cache[1] = (...args) => _ctx.handleInput && _ctx.handleInput(...args)),
      onKeydown: _cache[2] || (_cache[2] = vue.withKeys((...args) => _ctx.handleEnter && _ctx.handleEnter(...args), ["enter"]))
    }, [
      _ctx.type === "number" || _ctx.type === "boolean" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        vue.createTextVNode(vue.toDisplayString(_ctx.stateValue), 1)
      ], 64)) : _ctx.type === "string" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
        vue.createTextVNode(vue.toDisplayString(`"${_ctx.stateValue}"`), 1)
      ], 64)) : vue.createCommentVNode("v-if", true)
    ], 34)
  ])) : vue.createCommentVNode("v-if", true);
}
var ValueEditor = /* @__PURE__ */ pluginVue_exportHelper["default"](_sfc_main, [["render", _sfc_render], ["__file", "D:\\project\\\u4E2A\u4EBA\\simple-json\\package\\simpleJson\\components\\ValueEditor.vue"]]);

exports["default"] = ValueEditor;
