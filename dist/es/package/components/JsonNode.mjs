import { defineComponent, ref, inject, watch, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createVNode, createCommentVNode, createElementVNode, createBlock, toDisplayString, renderSlot, Fragment, withDirectives, renderList, vModelSelect } from 'vue';
import ValueEditor from './ValueEditor.mjs';
import IconSvg from './Icon/IconSvg.mjs';
import { mergeArray, _UUID, updataArrIndex, deepReductionJson, deepAnalysisJson } from '../utils/index.mjs';
import clonedeep from 'lodash.clonedeep';
import { defaultConfig } from '../libs/defaultConfig.mjs';
import Render from './Render/index.mjs';
import _export_sfc from '../../_virtual/plugin-vue_export-helper.mjs';

const _sfc_main = defineComponent({
  name: "JsonNode",
  components: { ValueEditor, IconSvg, Render },
  props: {
    json: {
      type: Object,
      required: true
    },
    currectLevel: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const stateData = ref();
    const { extendLevel, extendAll, extendCatchKey, disabled, jsonConfig } = inject("JsonEditorContext");
    watch(() => props.json, (val) => {
      stateData.value = val;
    }, {
      immediate: true
    });
    const allowType = computed(() => {
      if (jsonConfig.value && jsonConfig.value.allowType)
        return mergeArray(jsonConfig.value.allowType, defaultConfig.allowType);
      return defaultConfig.allowType;
    });
    const customAppendOperate = computed(() => {
      let rst = [];
      if (jsonConfig.value && jsonConfig.value.appendOperate) {
        rst = jsonConfig.value.appendOperate;
      }
      return rst;
    });
    const isSub = computed(() => {
      return stateData.value && (stateData.value.type === "array" || stateData.value.type === "object");
    });
    const isExtend = ref(false);
    const eventTrigger = inject("eventTrigger");
    watch(() => extendLevel.value, (val) => {
      var _a;
      const extend = extendCatchKey.value.some((x) => {
        var _a2;
        return x.id === ((_a2 = stateData.value) == null ? void 0 : _a2.id);
      });
      if (val >= props.currectLevel || extendAll.value || extend) {
        isExtend.value = true;
        eventTrigger("extend", {
          isExtend: isExtend.value,
          id: (_a = stateData.value) == null ? void 0 : _a.id
        });
      }
    }, {
      immediate: true
    });
    const handleExtend = () => {
      var _a;
      isExtend.value = !isExtend.value;
      eventTrigger("extend", { isExtend: isExtend.value, id: (_a = stateData.value) == null ? void 0 : _a.id });
    };
    const handleSwitch = (item) => {
      var _a, _b;
      if (!item)
        return;
      if (item.type === "array" || item.type === "object") {
        item.value = [];
      } else {
        allowType.value.forEach((x) => {
          if (x.type === item.type) {
            item.value = x.default;
          }
        });
      }
      eventTrigger("type-switch", {
        level: props.currectLevel,
        key: (_a = stateData.value) == null ? void 0 : _a.key,
        value: (_b = stateData.value) == null ? void 0 : _b.value
      });
    };
    const hoverNodeId = ref("");
    const handleMouseEnter = () => {
      var _a;
      hoverNodeId.value = ((_a = stateData.value) == null ? void 0 : _a.id) || "";
    };
    const handleMouseLeave = () => {
      hoverNodeId.value = "";
    };
    const isHover = computed(() => {
      var _a;
      return hoverNodeId.value === ((_a = stateData.value) == null ? void 0 : _a.id);
    });
    const handleValueChange = (value, item, type = "value") => {
      item[type] = value;
      if (eventTrigger)
        eventTrigger("change", clonedeep(stateData.value));
    };
    const handleSlotValueChange = (value) => {
      if (stateData.value)
        stateData.value.value = value;
      if (eventTrigger)
        eventTrigger("change", clonedeep(stateData.value));
    };
    const currectEditId = ref();
    const handleValueFocus = () => {
      var _a;
      currectEditId.value = (_a = stateData.value) == null ? void 0 : _a.id;
    };
    const isEdit = computed(() => {
      var _a;
      return currectEditId.value === ((_a = stateData.value) == null ? void 0 : _a.id);
    });
    const handleValueBlur = () => {
      currectEditId.value = void 0;
    };
    const handleAddAttr = () => {
      var _a, _b;
      const key = ((_a = stateData.value) == null ? void 0 : _a.type) === "array" ? stateData.value.value.length : "defalut";
      const neWAttr = {
        id: _UUID(),
        key,
        value: "new attr",
        type: "string"
      };
      const addType = jsonConfig.value.addType !== void 0 ? jsonConfig.value.addType : defaultConfig.addType;
      if (addType && stateData.value) {
        stateData.value.value.unshift(neWAttr);
        updataArrIndex(stateData.value);
      } else {
        (_b = stateData.value) == null ? void 0 : _b.value.push(neWAttr);
      }
      if (eventTrigger)
        eventTrigger("change", clonedeep(stateData.value));
    };
    const handleAttrDelete = () => {
      var _a;
      if (eventTrigger)
        eventTrigger("delete", clonedeep(stateData.value));
      eventTrigger("extend", { isExtend: false, id: (_a = stateData.value) == null ? void 0 : _a.id });
    };
    const keyColor = computed(() => {
      let rst = "";
      if (stateData.value) {
        rst = defaultConfig.keyColor[stateData.value.type];
      }
      if (jsonConfig.value && jsonConfig.value.keyColor && stateData.value) {
        if (jsonConfig.value.keyColor[stateData.value.type]) {
          rst = jsonConfig.value.keyColor[stateData.value.type];
        }
      }
      return rst;
    });
    const handleCustom = (operate) => {
      if (stateData.value) {
        const currect = {
          key: stateData.value.key,
          value: isSub.value ? deepReductionJson(stateData.value.value) : clonedeep(stateData.value.value)
        };
        operate.clickEvent(currect).then((customValue) => {
          if (customValue && stateData.value) {
            stateData.value.type = customValue.type;
            if (customValue.type === "array" || customValue.type === "object") {
              stateData.value.value = deepAnalysisJson({
                [stateData.value.key]: customValue
              })[0].value;
            } else {
              stateData.value.value = customValue.value;
            }
          }
        });
      }
    };
    const valueSlot = computed(() => {
      let isSlot = false;
      allowType.value.forEach((x) => {
        var _a;
        if (x.type === ((_a = stateData.value) == null ? void 0 : _a.type)) {
          isSlot = x.slot;
        }
      });
      if (stateData.value)
        return isSlot && !stateData.value.root;
      return isSlot;
    });
    return {
      stateData,
      isSub,
      isEdit,
      isExtend,
      extendLevel,
      extendAll,
      keyColor,
      extendCatchKey,
      disabled,
      handleExtend,
      handleSwitch,
      isHover,
      jsonConfig,
      handleMouseEnter,
      handleMouseLeave,
      handleValueChange,
      handleSlotValueChange,
      handleAddAttr,
      handleAttrDelete,
      handleValueFocus,
      handleValueBlur,
      handleCustom,
      allowType,
      customAppendOperate,
      valueSlot
    };
  }
});
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
  const _component_IconSvg = resolveComponent("IconSvg");
  const _component_Render = resolveComponent("Render");
  return _ctx.stateData ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: normalizeClass(["json-node", { "node-active": (_ctx.isHover || _ctx.isEdit) && !_ctx.isExtend }]),
    onMouseenter: _cache[7] || (_cache[7] = (...args) => _ctx.handleMouseEnter && _ctx.handleMouseEnter(...args)),
    onMouseleave: _cache[8] || (_cache[8] = (...args) => _ctx.handleMouseLeave && _ctx.handleMouseLeave(...args))
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
          "fix-class": "json-node-icon json-node-icon-blue",
          if: "isExtend",
          name: "icon-zhankai"
        })) : (openBlock(), createBlock(_component_IconSvg, {
          key: 1,
          "fix-class": "json-node-icon json-node-icon-blue",
          name: "icon-zhankai-copy"
        }))
      ])) : createCommentVNode("v-if", true),
      _ctx.isSub && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.stateData.type === "object" ? "{" : "["), 1)) : createCommentVNode("v-if", true),
      _ctx.isSub && _ctx.isExtend && !_ctx.disabled && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", {
        key: 2,
        class: "json-node-icon-add",
        onClick: _cache[2] || (_cache[2] = ($event) => _ctx.handleAddAttr())
      }, [
        createVNode(_component_IconSvg, {
          "fix-class": "json-node-operate-icon",
          name: "icon-tianjia"
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
      !_ctx.disabled && !_ctx.isExtend && !_ctx.stateData.root && _ctx.isHover ? (openBlock(), createElementBlock("span", {
        key: 8,
        class: "json-node-icon-delete",
        title: "\u5220\u9664",
        onClick: _cache[6] || (_cache[6] = ($event) => _ctx.handleAttrDelete())
      }, [
        createVNode(_component_IconSvg, {
          "fix-class": "json-node-operate-icon",
          name: "icon-delete"
        })
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
  ], 34)) : createCommentVNode("v-if", true);
}
var JsonNode = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "JsonNode.vue"]]);

export { JsonNode as default };
