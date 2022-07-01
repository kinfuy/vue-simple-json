import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from 'vue';
import { iconProps } from './icon.type.mjs';
import _export_sfc from '../../../_virtual/plugin-vue_export-helper.mjs';

const _sfc_main = defineComponent({
  name: "IconSvg",
  props: iconProps,
  setup(props) {
    const rotateStyle = computed(() => {
      if (props.rotate) {
        return {
          transform: `rotate(${props.rotate}deg)`
        };
      }
      return {};
    });
    const sizeStyle = computed(() => {
      if (props.size) {
        return {
          fontSize: `${props.size}px`
        };
      }
      return {};
    });
    const colorStyle = computed(() => {
      if (props.color) {
        return {
          color: props.color
        };
      }
      return {};
    });
    return {
      rotateStyle,
      sizeStyle,
      colorStyle
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("i", {
    class: normalizeClass([
      "svg-icon",
      {
        [`svg-animation-spin`]: _ctx.spin
      }
    ]),
    style: normalizeStyle([_ctx.rotateStyle, _ctx.sizeStyle, _ctx.colorStyle])
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6);
}
var IconSvg = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:\\project\\\u4E2A\u4EBA\\simple-json\\package\\simpleJson\\components\\Icon\\IconSvg.vue"]]);

export { IconSvg as default };
