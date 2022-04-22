import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, createElementVNode } from 'vue';
import _export_sfc from '../../../_virtual/plugin-vue_export-helper.mjs';

const _sfc_main = defineComponent({
  name: "IconSvg",
  props: {
    name: {
      type: String,
      required: true
    },
    fixClass: {
      type: String,
      default: void 0
    }
  },
  setup(props) {
    let iconName = computed(() => {
      return `#${props.name}`;
    });
    return {
      iconName
    };
  }
});
const _hoisted_1 = ["xlink:href"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    class: normalizeClass(["svg-icon", _ctx.fixClass]),
    "aria-hidden": "true"
  }, [
    createElementVNode("use", { "xlink:href": _ctx.iconName }, null, 8, _hoisted_1)
  ], 2);
}
var IconSvg = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "IconSvg.vue"]]);

export { IconSvg as default };
