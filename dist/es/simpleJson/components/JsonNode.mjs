import _sfc_main from './JsonNode.vue_vue_type_script_lang.mjs';
import { resolveComponent, openBlock, createBlock, Transition, withCtx, createElementBlock, normalizeClass, normalizeStyle, createVNode, createCommentVNode, createElementVNode, toDisplayString, renderSlot, Fragment, withDirectives, renderList, vModelSelect } from 'vue';
import _export_sfc from '../../_virtual/plugin-vue_export-helper.mjs';

const _hoisted_1 = {
  key: 1,
  class: "json-node-separator"
};
const _hoisted_2 = {
  class: /* @__PURE__ */ normalizeClass(["json-node-value"])
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
  const _component_ValueEditor = resolveComponent("ValueEditor");
  const _component_IconArrowDown = resolveComponent("IconArrowDown");
  const _component_IconSvg = resolveComponent("IconSvg");
  const _component_IconArrowRight = resolveComponent("IconArrowRight");
  const _component_IconAdd = resolveComponent("IconAdd");
  const _component_Render = resolveComponent("Render");
  return openBlock(), createBlock(Transition, { name: "fade" }, {
    default: withCtx(() => [
      _ctx.stateData ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass([
          "json-node",
          { "node-active": (_ctx.isHover || _ctx.isEdit) && !_ctx.isExtend }
        ]),
        onMouseenter: _cache[6] || (_cache[6] = (...args) => _ctx.handleMouseEnter && _ctx.handleMouseEnter(...args)),
        onMouseleave: _cache[7] || (_cache[7] = (...args) => _ctx.handleMouseLeave && _ctx.handleMouseLeave(...args))
      }, [
        !_ctx.stateData.root ? (openBlock(), createElementBlock("span", {
          key: 0,
          class: "json-node-key",
          style: normalizeStyle({ color: _ctx.keyColor })
        }, [
          createVNode(_component_ValueEditor, {
            disabled: typeof _ctx.stateData.key === "number" || _ctx.disabled,
            value: _ctx.stateData.key,
            onChange: _cache[0] || (_cache[0] = ($event) => _ctx.handleValueChange($event, _ctx.json, "key")),
            onFocus: _ctx.handleValueFocus,
            onBlur: _ctx.handleValueBlur
          }, null, 8, ["disabled", "value", "onFocus", "onBlur"])
        ], 4)) : createCommentVNode("v-if", true),
        !_ctx.stateData.root ? (openBlock(), createElementBlock("span", _hoisted_1, ":")) : createCommentVNode("v-if", true),
        createElementVNode("span", _hoisted_2, [
          _ctx.isSub && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: "hidden-separator",
            onClick: _cache[1] || (_cache[1] = ($event) => _ctx.handleExtend())
          }, [
            _ctx.isExtend ? (openBlock(), createBlock(_component_IconSvg, {
              key: 0,
              color: "#fff",
              size: 12
            }, {
              default: withCtx(() => [
                createVNode(_component_IconArrowDown)
              ]),
              _: 1
            })) : (openBlock(), createBlock(_component_IconSvg, {
              key: 1,
              color: "#fff",
              size: 12
            }, {
              default: withCtx(() => [
                createVNode(_component_IconArrowRight)
              ]),
              _: 1
            }))
          ])) : createCommentVNode("v-if", true),
          _ctx.isSub && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.stateData.type === "object" ? "{" : "["), 1)) : createCommentVNode("v-if", true),
          _ctx.isSub && _ctx.isExtend && !_ctx.disabled && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", {
            key: 2,
            onClick: _cache[2] || (_cache[2] = ($event) => _ctx.handleAddAttr())
          }, [
            createVNode(_component_IconSvg, {
              color: "#71aff1",
              size: 16
            }, {
              default: withCtx(() => [
                createVNode(_component_IconAdd)
              ]),
              _: 1
            })
          ])) : createCommentVNode("v-if", true),
          _ctx.isSub && !_ctx.isExtend && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", _hoisted_4, "......")) : createCommentVNode("v-if", true),
          _ctx.valueSlot ? renderSlot(_ctx.$slots, "node-value", {
            key: 4,
            nodeValue: _ctx.stateData,
            handleChange: _ctx.handleSlotValueChange
          }) : createCommentVNode("v-if", true),
          !_ctx.isSub && !_ctx.valueSlot ? (openBlock(), createBlock(_component_ValueEditor, {
            key: _ctx.stateData.id,
            type: _ctx.stateData.type,
            value: _ctx.stateData.value,
            disabled: _ctx.disabled,
            onChange: _cache[3] || (_cache[3] = ($event) => _ctx.handleValueChange($event, _ctx.json, "value")),
            onFocus: _ctx.handleValueFocus,
            onBlur: _ctx.handleValueBlur
          }, null, 8, ["type", "value", "disabled", "onFocus", "onBlur"])) : createCommentVNode("v-if", true),
          _ctx.isSub && !_ctx.valueSlot ? (openBlock(), createElementBlock(Fragment, { key: 6 }, [
            _ctx.isExtend ? renderSlot(_ctx.$slots, "sub-node", {
              key: 0,
              node: _ctx.json.value
            }) : createCommentVNode("v-if", true),
            createElementVNode("span", null, toDisplayString(_ctx.json.type === "object" ? "}" : "]"), 1)
          ], 64)) : createCommentVNode("v-if", true),
          !_ctx.disabled && !_ctx.isExtend && !_ctx.stateData.root && _ctx.isHover ? (openBlock(), createElementBlock("span", _hoisted_5, [
            renderSlot(_ctx.$slots, "type-switch", {
              allowType: _ctx.allowType,
              nodeValue: _ctx.stateData
            }, () => [
              withDirectives(createElementVNode("select", {
                id: "dataType",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.stateData.type = $event),
                name: "dataType",
                onChange: _cache[5] || (_cache[5] = ($event) => _ctx.handleSwitch(_ctx.stateData))
              }, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.allowType, (datatype) => {
                  return openBlock(), createElementBlock("option", {
                    key: datatype.type,
                    value: datatype.type
                  }, toDisplayString(datatype.desc), 9, _hoisted_6);
                }), 128))
              ], 544), [
                [vModelSelect, _ctx.stateData.type]
              ])
            ])
          ])) : createCommentVNode("v-if", true),
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.customAppendOperate, (operate) => {
            return openBlock(), createElementBlock(Fragment, {
              key: operate.key
            }, [
              !_ctx.disabled && !_ctx.isExtend && !_ctx.stateData.root && _ctx.isHover ? (openBlock(), createElementBlock("span", {
                key: 0,
                title: operate.title,
                class: normalizeClass(["json-custom-warper", operate.className]),
                onClick: ($event) => _ctx.handleCustom(operate)
              }, [
                operate.render ? (openBlock(), createBlock(_component_Render, {
                  key: 0,
                  render: operate.render
                }, null, 8, ["render"])) : (openBlock(), createElementBlock("span", _hoisted_8, toDisplayString(operate.text), 1))
              ], 10, _hoisted_7)) : createCommentVNode("v-if", true)
            ], 64);
          }), 128))
        ])
      ], 34)) : createCommentVNode("v-if", true)
    ]),
    _: 3
  });
}
var JsonNode = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:\\project\\\u4E2A\u4EBA\\simple-json\\package\\simpleJson\\components\\JsonNode.vue"]]);

export { JsonNode as default };
