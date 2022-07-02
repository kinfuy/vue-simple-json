'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var icon_type = require('./icon.type.js');
var pluginVue_exportHelper = require('../../../_virtual/plugin-vue_export-helper.js');

const _sfc_main = vue.defineComponent({
  name: "IconSvg",
  props: icon_type.iconProps,
  setup(props) {
    const rotateStyle = vue.computed(() => {
      if (props.rotate) {
        return {
          transform: `rotate(${props.rotate}deg)`
        };
      }
      return {};
    });
    const sizeStyle = vue.computed(() => {
      if (props.size) {
        return {
          fontSize: `${props.size}px`
        };
      }
      return {};
    });
    const colorStyle = vue.computed(() => {
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
  return vue.openBlock(), vue.createElementBlock("i", {
    class: vue.normalizeClass([
      "svg-icon",
      {
        [`svg-animation-spin`]: _ctx.spin
      }
    ]),
    style: vue.normalizeStyle([_ctx.rotateStyle, _ctx.sizeStyle, _ctx.colorStyle])
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 6);
}
var IconSvg = /* @__PURE__ */ pluginVue_exportHelper["default"](_sfc_main, [["render", _sfc_render], ["__file", "D:\\project\\\u4E2A\u4EBA\\simple-json\\package\\simpleJson\\components\\Icon\\IconSvg.vue"]]);

exports["default"] = IconSvg;
