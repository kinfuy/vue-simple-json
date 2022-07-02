'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var JsonNode_vue_vue_type_script_lang = require('./JsonNode.vue_vue_type_script_lang.js');
var vue = require('vue');
var pluginVue_exportHelper = require('../../_virtual/plugin-vue_export-helper.js');

const _hoisted_1 = {
  key: 1,
  class: "json-node-separator"
};
const _hoisted_2 = {
  class: /* @__PURE__ */ vue.normalizeClass(["json-node-value"])
};
const _hoisted_3 = { key: 1 };
const _hoisted_4 = { key: 3 };
const _hoisted_5 = {
  key: 7,
  class: "json-operate-warper"
};
const _hoisted_6 = ["value"];
const _hoisted_7 = ["title", "onClick"];
const _hoisted_8 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ValueEditor = vue.resolveComponent("ValueEditor");
  const _component_IconArrowDown = vue.resolveComponent("IconArrowDown");
  const _component_IconSvg = vue.resolveComponent("IconSvg");
  const _component_IconArrowRight = vue.resolveComponent("IconArrowRight");
  const _component_IconAdd = vue.resolveComponent("IconAdd");
  const _component_Render = vue.resolveComponent("Render");
  return _ctx.stateData ? (vue.openBlock(), vue.createElementBlock("div", {
    key: 0,
    class: vue.normalizeClass(["json-node", { "node-active": (_ctx.isHover || _ctx.isEdit) && !_ctx.isExtend }]),
    onMouseenter: _cache[6] || (_cache[6] = (...args) => _ctx.handleMouseEnter && _ctx.handleMouseEnter(...args)),
    onMouseleave: _cache[7] || (_cache[7] = (...args) => _ctx.handleMouseLeave && _ctx.handleMouseLeave(...args))
  }, [
    !_ctx.stateData.root ? (vue.openBlock(), vue.createElementBlock("span", {
      key: 0,
      class: "json-node-key",
      style: vue.normalizeStyle({ color: _ctx.keyColor })
    }, [
      vue.createVNode(_component_ValueEditor, {
        disabled: typeof _ctx.stateData.key === "number" || _ctx.disabled,
        value: _ctx.stateData.key,
        onChange: _cache[0] || (_cache[0] = ($event) => _ctx.handleValueChange($event, _ctx.json, "key")),
        onFocus: _ctx.handleValueFocus,
        onBlur: _ctx.handleValueBlur
      }, null, 8, ["disabled", "value", "onFocus", "onBlur"])
    ], 4)) : vue.createCommentVNode("v-if", true),
    !_ctx.stateData.root ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, ":")) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("span", _hoisted_2, [
      _ctx.isSub && !_ctx.valueSlot ? (vue.openBlock(), vue.createElementBlock("span", {
        key: 0,
        class: "hidden-separator",
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.handleExtend())
      }, [
        _ctx.isExtend ? (vue.openBlock(), vue.createBlock(_component_IconSvg, {
          key: 0,
          color: "#fff",
          size: 12
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_IconArrowDown)
          ]),
          _: 1
        })) : (vue.openBlock(), vue.createBlock(_component_IconSvg, {
          key: 1,
          color: "#fff",
          size: 12
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_IconArrowRight)
          ]),
          _: 1
        }))
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.isSub && !_ctx.valueSlot ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(_ctx.stateData.type === "object" ? "{" : "["), 1)) : vue.createCommentVNode("v-if", true),
      _ctx.isSub && _ctx.isExtend && !_ctx.disabled && !_ctx.valueSlot ? (vue.openBlock(), vue.createElementBlock("span", {
        key: 2,
        onClick: _cache[2] || (_cache[2] = ($event) => _ctx.handleAddAttr())
      }, [
        vue.createVNode(_component_IconSvg, {
          color: "#71aff1",
          size: 16
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_IconAdd)
          ]),
          _: 1
        })
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.isSub && !_ctx.isExtend && !_ctx.valueSlot ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, "......")) : vue.createCommentVNode("v-if", true),
      _ctx.valueSlot ? vue.renderSlot(_ctx.$slots, "node-value", {
        key: 4,
        nodeValue: _ctx.stateData,
        handleChange: _ctx.handleSlotValueChange
      }) : vue.createCommentVNode("v-if", true),
      !_ctx.isSub && !_ctx.valueSlot ? (vue.openBlock(), vue.createBlock(_component_ValueEditor, {
        key: _ctx.stateData.id,
        type: _ctx.stateData.type,
        value: _ctx.stateData.value,
        disabled: _ctx.disabled,
        onChange: _cache[3] || (_cache[3] = ($event) => _ctx.handleValueChange($event, _ctx.json, "value")),
        onFocus: _ctx.handleValueFocus,
        onBlur: _ctx.handleValueBlur
      }, null, 8, ["type", "value", "disabled", "onFocus", "onBlur"])) : vue.createCommentVNode("v-if", true),
      _ctx.isSub && !_ctx.valueSlot ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 6 }, [
        _ctx.isExtend ? vue.renderSlot(_ctx.$slots, "sub-node", {
          key: 0,
          node: _ctx.json.value
        }) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("span", {
          class: vue.normalizeClass({ "root-brackets": _ctx.stateData.root && _ctx.isExtend })
        }, vue.toDisplayString(_ctx.json.type === "object" ? "}" : "]"), 3)
      ], 64)) : vue.createCommentVNode("v-if", true),
      !_ctx.disabled && !_ctx.isExtend && !_ctx.stateData.root && _ctx.isHover ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5, [
        vue.renderSlot(_ctx.$slots, "type-switch", {
          allowType: _ctx.allowType,
          nodeValue: _ctx.stateData
        }, () => [
          vue.withDirectives(vue.createElementVNode("select", {
            id: "dataType",
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.stateData.type = $event),
            name: "dataType",
            onChange: _cache[5] || (_cache[5] = ($event) => _ctx.handleSwitch(_ctx.stateData))
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.allowType, (datatype) => {
              return vue.openBlock(), vue.createElementBlock("option", {
                key: datatype.type,
                value: datatype.type
              }, vue.toDisplayString(datatype.desc), 9, _hoisted_6);
            }), 128))
          ], 544), [
            [vue.vModelSelect, _ctx.stateData.type]
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.customAppendOperate, (operate) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
          key: operate.key
        }, [
          !_ctx.disabled && !_ctx.isExtend && !_ctx.stateData.root && _ctx.isHover ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            title: operate.title,
            class: vue.normalizeClass(["json-custom-warper", operate.className]),
            onClick: ($event) => _ctx.handleCustom(operate)
          }, [
            operate.render ? (vue.openBlock(), vue.createBlock(_component_Render, {
              key: 0,
              render: operate.render
            }, null, 8, ["render"])) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_8, vue.toDisplayString(operate.text), 1))
          ], 10, _hoisted_7)) : vue.createCommentVNode("v-if", true)
        ], 64);
      }), 128))
    ])
  ], 34)) : vue.createCommentVNode("v-if", true);
}
var JsonNode = /* @__PURE__ */ pluginVue_exportHelper["default"](JsonNode_vue_vue_type_script_lang["default"], [["render", _sfc_render], ["__file", "D:\\project\\\u4E2A\u4EBA\\simple-json\\package\\simpleJson\\components\\JsonNode.vue"]]);

exports["default"] = JsonNode;
