import { defineComponent, resolveComponent, openBlock, createBlock, withCtx, createElementBlock, Fragment, renderList, renderSlot } from 'vue';
import JsonNode from './JsonNode.mjs';
import _export_sfc from '../../_virtual/plugin-vue_export-helper.mjs';

const _sfc_main = defineComponent({
  name: "SubJsonNode",
  components: { JsonNode },
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
  const _component_SubJsonNode = resolveComponent("SubJsonNode", true);
  const _component_JsonNode = resolveComponent("JsonNode");
  return openBlock(), createBlock(_component_JsonNode, {
    json: _ctx.json,
    "currect-level": _ctx.currectLevel
  }, {
    "sub-node": withCtx(({ node }) => [
      (openBlock(true), createElementBlock(Fragment, null, renderList(node, (item) => {
        return openBlock(), createBlock(_component_SubJsonNode, {
          key: item.id,
          json: item,
          "currect-level": _ctx.currectLevel + 1
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
          _: 2
        }, 1032, ["json", "currect-level"]);
      }), 128))
    ]),
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
  }, 8, ["json", "currect-level"]);
}
var SubJsonNode = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "SubJsonNode.vue"]]);

export { SubJsonNode as default };
