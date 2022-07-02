'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var JsonNode = require('./JsonNode.js');
var pluginVue_exportHelper = require('../../_virtual/plugin-vue_export-helper.js');

const _sfc_main = vue.defineComponent({
  name: "SubJsonNode",
  components: { JsonNode: JsonNode["default"] },
  props: {
    json: {
      type: Object,
      required: true
    },
    currectLevel: {
      type: Number,
      default: 0
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SubJsonNode = vue.resolveComponent("SubJsonNode", true);
  const _component_JsonNode = vue.resolveComponent("JsonNode");
  return vue.openBlock(), vue.createBlock(_component_JsonNode, {
    json: _ctx.json,
    "currect-level": _ctx.currectLevel
  }, {
    "sub-node": vue.withCtx(({ node }) => [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(node, (item) => {
        return vue.openBlock(), vue.createBlock(_component_SubJsonNode, {
          key: item.id,
          json: item,
          "currect-level": _ctx.currectLevel + 1
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
          _: 2
        }, 1032, ["json", "currect-level"]);
      }), 128))
    ]),
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
  }, 8, ["json", "currect-level"]);
}
var SubJsonNode = /* @__PURE__ */ pluginVue_exportHelper["default"](_sfc_main, [["render", _sfc_render], ["__file", "D:\\project\\\u4E2A\u4EBA\\simple-json\\package\\simpleJson\\components\\SubJsonNode.vue"]]);

exports["default"] = SubJsonNode;
