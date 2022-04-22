import { defineComponent, ref, watch, nextTick, openBlock, createElementBlock, createElementVNode, normalizeClass, withKeys, Fragment, createTextVNode, toDisplayString, createCommentVNode, computed, inject, resolveComponent, normalizeStyle, createVNode, createBlock, renderSlot, withDirectives, renderList, vModelSelect, withCtx, provide, toRef } from 'vue';
import clonedeep from 'lodash.clonedeep';

const typeOf = (obj) => {
  const { toString } = Object.prototype;
  const map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  };
  return map[toString.call(obj)];
};
const _UUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
const deepAnalysisJson = (json) => {
  const jsonResult = [];
  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      if (typeOf(json[key]) === "object") {
        const item = deepAnalysisJson(json[key]);
        const jsonItem = {
          id: _UUID(),
          key,
          value: item,
          type: typeOf(json[key])
        };
        jsonResult.push(jsonItem);
      } else if (typeOf(json[key]) === "array") {
        const arr = [];
        json[key].forEach((x, index) => {
          if (typeOf(x) === "object") {
            const item = deepAnalysisJson(x);
            const jsonItem2 = {
              id: _UUID(),
              key: index,
              value: item,
              type: typeOf(x)
            };
            arr.push(jsonItem2);
          } else if (typeOf(x) === "array") {
            x.forEach((val) => {
              const item = deepAnalysisJson(val);
              const jsonItem2 = {
                id: _UUID(),
                key: index,
                value: item,
                type: typeOf(val)
              };
              arr.push(jsonItem2);
            });
          } else {
            const jsonItem2 = {
              id: _UUID(),
              key: index,
              value: x,
              type: typeOf(x)
            };
            arr.push(jsonItem2);
          }
        });
        const jsonItem = {
          id: _UUID(),
          key,
          value: arr,
          type: typeOf(json[key])
        };
        jsonResult.push(jsonItem);
      } else {
        const jsonItem = {
          id: _UUID(),
          key,
          value: json[key],
          type: typeOf(json[key])
        };
        jsonResult.push(jsonItem);
      }
    }
  }
  return jsonResult;
};
const deepReductionJson = (json) => {
  const jsonResult = {};
  json.forEach((x) => {
    if (x.type === "array") {
      const item = [];
      x.value.forEach((val) => {
        if (val.type === "object") {
          item.push(deepReductionJson(val.value));
        } else if (val.type === "array") {
          item.push(deepReductionJson(val.value));
        } else {
          item.push(val.value);
        }
      });
      jsonResult[x.key] = item;
    } else if (x.type === "object") {
      const item = {};
      x.value.forEach((val) => {
        if (val.type === "object") {
          item[val.key] = deepReductionJson(val.value);
        } else if (val.type === "array") {
          const arr = [];
          val.value.forEach((value, index) => {
            if (value.type === "object" || value.type === "array") {
              arr[index] = deepReductionJson(value.value);
            } else {
              arr[index] = value.value;
            }
          });
          item[val.key] = arr;
        } else {
          item[val.key] = val.value;
        }
      });
      jsonResult[x.key] = item;
    } else {
      jsonResult[x.key] = x.value;
    }
  });
  return jsonResult;
};
const deepDeleteJson = (json, tempId) => {
  if (json.type === "array" || json.type === "object") {
    for (let i = 0; i < json.value.length; i++) {
      deepDeleteJson(json.value[i], tempId);
      if (json.value[i].id === tempId) {
        json.value.splice(i, 1);
        updataArrIndex(json);
        i--;
      }
    }
  }
};
const updataArrIndex = (json) => {
  if (json.type === "array") {
    json.value.forEach((x, index) => {
      x.key = index;
    });
  }
};
const deepUpdataJson = (json, tempId, key, value) => {
  if (json.id === tempId) {
    json.key = key;
    json.value = value;
    return;
  }
  if (json.type === "array" || json.type === "object") {
    for (let i = 0; i < json.value.length; i++) {
      deepUpdataJson(json.value[i], tempId, key, value);
    }
  }
};
const mergeArray = (target, scoure) => {
  const rst = target.map((x) => {
    var _a, _b, _c;
    const configType = typeof x === "string";
    return {
      type: configType ? x : x.type,
      desc: configType ? findAllowType(x, scoure) : x.desc || ((_a = findAllowType(x.type, scoure)) == null ? void 0 : _a.desc),
      default: configType ? findAllowType(x, scoure) : x.default || ((_b = findAllowType(x.type, scoure)) == null ? void 0 : _b.default),
      slot: configType ? findAllowType(x, scoure) : x.slot || ((_c = findAllowType(x.type, scoure)) == null ? void 0 : _c.slot)
    };
  });
  return rst;
};
function findAllowType(type, scoure) {
  for (let i = 0; i < scoure.length; i++) {
    if (scoure[i].type === type) {
      return scoure[i];
    }
  }
}

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$4 = defineComponent({
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
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
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
var ValueEditor = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "ValueEditor.vue"]]);

const _sfc_main$3 = defineComponent({
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
const _hoisted_1$1 = ["xlink:href"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    class: normalizeClass(["svg-icon", _ctx.fixClass]),
    "aria-hidden": "true"
  }, [
    createElementVNode("use", { "xlink:href": _ctx.iconName }, null, 8, _hoisted_1$1)
  ], 2);
}
var IconSvg = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "IconSvg.vue"]]);

const defaultConfig = {
  keyColor: {
    string: "#71aff1",
    object: "#71aff1",
    array: "#71aff1",
    number: "#71aff1",
    function: "#71aff1",
    boolean: "#71aff1",
    null: "#71aff1",
    undefined: "#71aff1",
    date: "#71aff1",
    regExp: "#71aff1"
  },
  allowType: [
    {
      type: "boolean",
      desc: "\u5E03\u5C14\u503C",
      default: false,
      slot: false
    },
    {
      type: "number",
      desc: "\u6570\u5B57",
      default: 0,
      slot: false
    },
    {
      type: "string",
      desc: "\u5B57\u7B26\u4E32",
      default: "",
      slot: false
    },
    {
      type: "array",
      desc: "\u6570\u7EC4",
      default: () => [],
      slot: false
    },
    {
      type: "date",
      desc: "\u65F6\u95F4",
      default: new Date(),
      slot: false
    },
    {
      type: "object",
      desc: "\u5BF9\u8C61",
      default: () => [],
      slot: false
    },
    {
      type: "null",
      desc: "null",
      default: "null",
      slot: false
    },
    {
      type: "undefined",
      desc: "undefined",
      default: "undefined",
      slot: false
    },
    {
      type: "function",
      desc: "function",
      default: () => {
      },
      slot: false
    }
  ],
  showHover: true,
  addType: true
};

const Render = (props) => {
  return props.render();
};
Render.props = {
  render: {
    type: Function
  }
};

const _sfc_main$2 = defineComponent({
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
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
var JsonNode = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "JsonNode.vue"]]);

const _sfc_main$1 = defineComponent({
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
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
var SubJsonNode = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "SubJsonNode.vue"]]);

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const _sfc_main = defineComponent({
  name: "SimpleJson",
  components: { SubJsonNode },
  props: {
    json: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    extendAll: {
      type: Boolean,
      default: false
    },
    extendLevel: {
      type: Number,
      default: 0
    },
    speciallyKey: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ["update:value", "change", "extend", "delete", "type-switch"],
  setup(props, { emit }) {
    const stateData = ref({
      id: "root",
      key: "",
      value: "",
      type: "object",
      root: true
    });
    const extendCatchKey = ref([]);
    watch(() => props.json, (val) => {
      if (val)
        stateData.value.value = val;
    }, {
      immediate: true,
      deep: true
    });
    const handleChange = (name, value) => __async(this, null, function* () {
      if (!value.root) {
        yield deepUpdataJson(stateData.value, value.id, value.key, value.value);
      }
      yield emit(name, stateData.value.value);
    });
    const handleExtend = (value) => {
      const exist = extendCatchKey.value.some((x) => {
        return value.id === x.id;
      });
      if (exist) {
        if (!value.isExtend) {
          for (let i = 0; i < extendCatchKey.value.length; i++) {
            if (value.id === extendCatchKey.value[i].id) {
              extendCatchKey.value.splice(i, 1);
              i--;
            }
          }
        }
      } else if (value.isExtend) {
        extendCatchKey.value.push({ id: value.id });
      }
      emit("extend", extendCatchKey.value);
    };
    const handleAttrDelete = (name, value) => __async(this, null, function* () {
      yield deepDeleteJson(stateData.value, value.id);
      yield emit("change", stateData.value.value);
      emit("delete", value);
    });
    const eventTrigger = (name, value) => {
      if (name === "change")
        handleChange(name, value);
      if (name === "delete")
        handleAttrDelete(name, value);
      if (name === "extend")
        handleExtend(value);
      if (name === "type-switch")
        emit(name, value);
    };
    provide("eventTrigger", eventTrigger);
    provide("JsonEditorContext", {
      extendCatchKey,
      disabled: toRef(props, "disabled"),
      extendAll: toRef(props, "extendAll"),
      extendLevel: toRef(props, "extendLevel"),
      jsonConfig: toRef(props, "config")
    });
    return {
      stateData,
      extendCatchKey
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SubJsonNode = resolveComponent("SubJsonNode");
  return openBlock(), createBlock(_component_SubJsonNode, {
    json: _ctx.stateData,
    "currect-level": 1
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
    _: 3
  }, 8, ["json"]);
}
var SimpleJson = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "JsonEditor.vue"]]);

!function(a) {
  var l, t, c, e, i, n = '<svg><symbol id="icon-shujukaifagongzuoliushujutansuozuijindakai" viewBox="0 0 1024 1024"><path d="M237.348571 123.611429l-7.094857 8.996571c3.072-10.971429 5.339429-19.602286 6.875429-26.112l6.875428-29.257143c7.021714-21.211429 2.486857-33.865143-18.651428-40.96-15.945143-2.706286-29.988571-0.365714-37.010286 13.750857l-33.792 142.482286c-4.681143 16.822857-6.290286 29.403429 14.848 36.498286l132.461714 33.645714c21.211429 7.021714 36.352-1.901714 42.422858-19.456 5.924571-17.627429-7.021714-34.962286-22.820572-38.180571l-56.100571-14.482286c5.193143-3.730286 4.827429-5.997714 12.214857-11.849143 83.968-65.828571 156.672-101.522286 248.32-101.522286 211.382857 0 396.8 190.317714 396.8 401.700572 0 211.456-185.417143 398.116571-396.8 398.116571-211.382857 0-396.8-186.660571-396.8-398.116571 0-21.138286-13.897143-38.034286-35.108572-38.034286-21.138286 0-34.011429 16.896-34.011428 38.034286 0 253.805714 212.187429 467.821714 465.92 467.821714 253.659429 0 467.675429-214.674286 467.675428-468.406857S790.966857 11.264 526.774857 11.264a437.540571 437.540571 0 0 0-289.426286 112.274286zM470.308571 329.216v222.427429c0 21.211429 14.116571 35.254857 35.254858 35.254857h160.036571c21.211429 0 34.377143-14.116571 34.377143-35.254857s-13.165714-31.012571-34.377143-31.012572H539.062857V329.289143c0-21.138286-11.995429-35.620571-33.206857-35.620572-21.138286 0-35.474286 14.482286-35.474286 35.620572z" fill="#000000" ></path></symbol><symbol id="icon-icon_xinyong_xianxing_jijin-" viewBox="0 0 1024 1024"><path d="M512 230.4c-63.5136 0-115.2-51.6864-115.2-115.2s51.6864-115.2 115.2-115.2c63.5264 0 115.2 51.6864 115.2 115.2s-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM512 1024c-63.5136 0-115.2-51.6736-115.2-115.2s51.6864-115.2 115.2-115.2c63.5264 0 115.2 51.6736 115.2 115.2s-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM908.8 627.2c-63.5264 0-115.2-51.6736-115.2-115.2 0-63.5136 51.6736-115.2 115.2-115.2s115.2 51.6864 115.2 115.2c0 63.5264-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM115.2 627.2c-63.5136 0-115.2-51.6736-115.2-115.2 0-63.5136 51.6864-115.2 115.2-115.2s115.2 51.6864 115.2 115.2c0 63.5264-51.6864 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64z" fill="#333333" ></path><path d="M320.5376 219.392a25.6 25.6 0 0 1-13.184-47.5648 392.256 392.256 0 0 1 116.5184-46.6688 25.6 25.6 0 0 1 11.1488 49.984 341.5552 341.5552 0 0 0-101.3376 40.6016 25.6384 25.6384 0 0 1-13.1456 3.648zM703.4624 219.4048c-4.4928 0-9.024-1.1776-13.1456-3.6608a341.2736 341.2736 0 0 0-101.3248-40.6016 25.6256 25.6256 0 0 1-19.4176-30.5664 25.664 25.664 0 0 1 30.5664-19.4176 392.3968 392.3968 0 0 1 116.5312 46.6688 25.6128 25.6128 0 0 1-13.2096 47.5776zM429.4656 899.456c-1.8432 0-3.7248-0.2048-5.5936-0.6144a392.64 392.64 0 0 1-116.5184-46.656 25.6 25.6 0 0 1 26.3296-43.9296 341.2096 341.2096 0 0 0 101.3376 40.6016 25.6 25.6 0 0 1-5.5552 50.5984zM594.5344 899.456a25.6 25.6 0 0 1-5.5424-50.5856 341.1712 341.1712 0 0 0 101.3248-40.6144 25.6 25.6 0 1 1 26.3424 43.904 392.0256 392.0256 0 0 1-116.5312 46.6816 26.0864 26.0864 0 0 1-5.5936 0.6144zM150.1696 455.04a25.6256 25.6256 0 0 1-25.024-31.1808 391.808 391.808 0 0 1 46.6816-116.5184 25.6 25.6 0 0 1 43.904 26.3424 341.184 341.184 0 0 0-40.6144 101.3376 25.5872 25.5872 0 0 1-24.9472 20.0192zM193.8176 729.088c-8.704 0-17.1776-4.4288-21.9776-12.4288a392.1664 392.1664 0 0 1-46.6816-116.5312 25.6 25.6 0 0 1 49.984-11.1488 341.0304 341.0304 0 0 0 40.6144 101.3248 25.6 25.6 0 0 1-21.9392 38.784zM830.1952 729.088a25.5744 25.5744 0 0 1-21.9392-38.7584 341.2096 341.2096 0 0 0 40.6016-101.3248 25.6768 25.6768 0 0 1 30.5536-19.4304 25.6 25.6 0 0 1 19.4304 30.5536 392.512 392.512 0 0 1-46.656 116.5312 25.6256 25.6256 0 0 1-21.9904 12.4288zM873.8304 455.04a25.6128 25.6128 0 0 1-24.96-20.032 341.4912 341.4912 0 0 0-40.6016-101.3376 25.6128 25.6128 0 0 1 43.9296-26.3296 392.64 392.64 0 0 1 46.656 116.5184 25.6 25.6 0 0 1-25.024 31.1808z" fill="#333333" ></path><path d="M231.424 913.0496a102.016 102.016 0 0 1-72.3712-29.9264l-18.176-18.176c-39.9104-39.9104-39.9104-104.832 0-144.7552l34.816-34.816a25.6 25.6 0 0 1 36.2112 36.1984l-34.816 34.816a51.2256 51.2256 0 0 0 0 72.3456l18.176 18.176a51.2256 51.2256 0 0 0 72.3456 0l34.816-34.8288a25.6 25.6 0 0 1 36.2112 36.1984l-34.816 34.8288a102.0928 102.0928 0 0 1-72.3968 29.9392zM830.1952 346.112a25.6 25.6 0 0 1-18.0992-43.712l34.8288-34.816a50.7648 50.7648 0 0 0 14.9632-36.16 50.8416 50.8416 0 0 0-14.9632-36.1856l-18.176-18.176a51.2256 51.2256 0 0 0-72.3456 0l-34.816 34.816a25.6 25.6 0 1 1-36.1984-36.2112l34.816-34.816c39.8976-39.9104 104.8448-39.9104 144.7552 0l18.176 18.176a101.6832 101.6832 0 0 1 29.9648 72.384 101.632 101.632 0 0 1-29.9648 72.3712l-34.8288 34.816a25.4848 25.4848 0 0 1-18.112 7.5136zM792.576 913.0624a101.952 101.952 0 0 1-72.3712-29.9392l-34.816-34.8288a25.6 25.6 0 1 1 36.1984-36.1984l34.816 34.8288c19.3024 19.3024 53.056 19.3024 72.3456 0l18.176-18.176c9.6512-9.6512 14.9632-22.5024 14.9632-36.1728s-5.312-26.5216-14.9632-36.1728l-34.8288-34.816a25.6 25.6 0 1 1 36.1984-36.1984l34.8288 34.816c39.9104 39.9104 39.9104 104.832 0 144.7552l-18.176 18.176a101.9904 101.9904 0 0 1-72.3712 29.9264zM193.792 346.112a25.472 25.472 0 0 1-18.0992-7.5008l-34.816-34.816c-19.328-19.3152-29.9648-45.0304-29.9648-72.3712s10.6496-53.056 29.9648-72.3712l18.176-18.1632c39.9104-39.8976 104.8576-39.8976 144.7424 0l34.816 34.816a25.6 25.6 0 1 1-36.1984 36.1984l-34.816-34.816a51.2256 51.2256 0 0 0-72.3456 0l-18.176 18.1632c-9.6512 9.6512-14.9632 22.4896-14.9632 36.1728s5.312 26.5216 14.9632 36.1728l34.816 34.816a25.6 25.6 0 0 1-18.0992 43.6992zM512 665.6c-84.6976 0-153.6-68.9024-153.6-153.6s68.9024-153.6 153.6-153.6 153.6 68.9024 153.6 153.6-68.9024 153.6-153.6 153.6z m0-256c-56.4608 0-102.4 45.9392-102.4 102.4s45.9392 102.4 102.4 102.4 102.4-45.9392 102.4-102.4-45.9392-102.4-102.4-102.4z" fill="#333333" ></path></symbol><symbol id="icon-01zhushuju_shujuquanxian" viewBox="0 0 1024 1024"><path d="M905.671111 545.564444v-341.333333a23.324444 23.324444 0 0 0-16.497778-21.617778l-370.346666-113.777777a27.875556 27.875556 0 0 0-13.653334 0l-370.346666 113.777777a23.324444 23.324444 0 0 0-16.497778 21.617778v341.333333a307.768889 307.768889 0 0 0 121.173333 243.484445l258.844445 196.266667a22.755556 22.755556 0 0 0 27.306666 0l258.844445-196.266667a307.768889 307.768889 0 0 0 121.173333-243.484445z m-148.48 207.075556L512 938.666667l-245.191111-186.026667a261.688889 261.688889 0 0 1-102.968889-207.075556V221.866667L512 113.777778l348.16 108.088889v323.697777a261.688889 261.688889 0 0 1-102.968889 207.075556z"  ></path><path d="M650.808889 362.382222a138.808889 138.808889 0 1 0-161.564445 136.533334v284.444444a22.755556 22.755556 0 0 0 45.511112 0v-153.6h64.853333a22.755556 22.755556 0 0 0 0-45.511111H534.755556v-85.333333a138.808889 138.808889 0 0 0 116.053333-136.533334zM512 455.111111a93.297778 93.297778 0 1 1 93.297778-93.297778A93.866667 93.866667 0 0 1 512 455.111111z"  ></path></symbol><symbol id="icon-shujushujudian" viewBox="0 0 1024 1024"><path d="M661.333333 128a128 128 0 0 1 82.773334 225.621333l56.832 117.482667a117.333333 117.333333 0 1 1-57.578667 27.882667l-56.832-117.461334a128.618667 128.618667 0 0 1-43.52 1.173334l-133.546667 266.368a128 128 0 1 1-182.186666 16.938666l-103.445334-137.514666a106.666667 106.666667 0 1 1 52.48-36.48l102.293334 135.978666a128.597333 128.597333 0 0 1 73.578666-6.784l131.861334-263.168A128 128 0 0 1 661.333333 128zM426.666667 688.490667a58.176 58.176 0 1 0 0 116.352 58.176 58.176 0 0 0 0-116.352zM821.333333 533.333333a53.333333 53.333333 0 1 0 0 106.666667 53.333333 53.333333 0 0 0 0-106.666667zM192 378.176a48.490667 48.490667 0 1 0 0 96.981333 48.490667 48.490667 0 0 0 0-96.981333z m469.333333-180.352a58.176 58.176 0 1 0 0 116.352 58.176 58.176 0 0 0 0-116.352z" fill="#000000" ></path></symbol><symbol id="icon-yangshi_icon_tongyong_swap" viewBox="0 0 1024 1024"><path d="M851.512889 673.393778l-204.8 233.671111c-7.111111 7.68-20.366222 2.844444-20.366222-7.452445V199.480889 142.506667a28.444444 28.444444 0 0 1 28.444444-28.444445h28.444445a28.444444 28.444444 0 0 1 28.444444 28.444445v56.888889c0 1.137778-0.512 2.104889-0.654222 3.214222V654.791111h131.783111c10.040889 0 15.388444 11.377778 8.704 18.602667zM370.346667 910.506667h-28.444445a28.444444 28.444444 0 0 1-28.444444-28.444445v-56.888889c0-1.137778 0.512-2.104889 0.654222-3.214222V369.834667H182.328889c-10.040889 0-15.36-11.406222-8.704-18.602667l204.8-233.671111c7.111111-7.68 20.366222-2.844444 20.366222 7.395555V882.062222a28.444444 28.444444 0 0 1-28.444444 28.444445z"  ></path><path d="M851.512889 673.393778l-204.8 233.671111c-7.111111 7.68-20.366222 2.844444-20.366222-7.452445V199.480889 142.506667a28.444444 28.444444 0 0 1 28.444444-28.444445h28.444445a28.444444 28.444444 0 0 1 28.444444 28.444445v56.888889c0 1.137778-0.512 2.104889-0.654222 3.214222V654.791111h131.783111c10.040889 0 15.388444 11.377778 8.704 18.602667zM370.346667 910.506667h-28.444445a28.444444 28.444444 0 0 1-28.444444-28.444445v-56.888889c0-1.137778 0.512-2.104889 0.654222-3.214222V369.834667H182.328889c-10.040889 0-15.36-11.406222-8.704-18.602667l204.8-233.671111c7.111111-7.68 20.366222-2.844444 20.366222 7.395555v757.134223a28.444444 28.444444 0 0 1-28.444444 28.444444z"  ></path></symbol><symbol id="icon-delete" viewBox="0 0 1024 1024"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zM864 256H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"  ></path></symbol><symbol id="icon-zhankai" viewBox="0 0 1024 1024"><path d="M818.393225 300.939003c12.824073-14.09502 34.658358-15.126512 48.752354-2.303462 14.09502 12.843516 15.126512 34.678824 2.302439 48.752354l-332.676845 364.835266c-12.844539 14.114462-34.659381 15.127536-48.753377 2.302439-0.815575-0.733711-1.588171-1.486864-2.302439-2.302439l-0.080841-0.078795-0.13917-0.13917L153.018046 347.388918c-12.824073-14.074553-11.791557-35.909861 2.302439-48.752354 14.09502-12.824073 35.930327-11.792581 48.753377 2.303462l307.168891 336.845795 307.149449-336.845795L818.393225 300.939003 818.393225 300.939003z"  ></path></symbol><symbol id="icon-tianjia" viewBox="0 0 1024 1024"><path d="M801.171 483.589H544V226.418c0-17.673-14.327-32-32-32s-32 14.327-32 32v257.171H222.83c-17.673 0-32 14.327-32 32s14.327 32 32 32H480v257.17c0 17.673 14.327 32 32 32s32-14.327 32-32v-257.17h257.171c17.673 0 32-14.327 32-32s-14.327-32-32-32z" fill="" ></path></symbol><symbol id="icon-zhuanhuan" viewBox="0 0 1024 1024"><path d="M113.664 444.16h798.72c11.264 0 20.48-9.216 20.48-20.48s-9.216-20.48-20.48-20.48H158.0032l192.4608-192.4608a20.52096 20.52096 0 0 0 0-28.9792 20.52096 20.52096 0 0 0-28.9792 0L97.024 406.2208c-7.6288 7.6288-7.8848 19.8656-0.8704 27.904 3.584 5.9904 10.0864 10.0352 17.5104 10.0352zM912.384 582.4h-798.72c-11.264 0-20.48 9.216-20.48 20.48s9.216 20.48 20.48 20.48h749.2608l-189.9008 189.9008a20.52096 20.52096 0 0 0 0 28.9792 20.52096 20.52096 0 0 0 28.9792 0l224.4608-224.4608c0.1024-0.1024 0.1536-0.2048 0.256-0.3072a20.3776 20.3776 0 0 0 6.144-14.592c0-11.264-9.216-20.48-20.48-20.48z" fill="#666666" ></path></symbol><symbol id="icon-zhankai-copy" viewBox="0 0 1024 1024"><path d="M300.939003 205.606775c-14.09502-12.824073-15.126512-34.658358-2.303462-48.752354 12.843516-14.09502 34.67882399-15.126512 48.752354-2.302439l364.835266 332.676845c14.114462 12.844539 15.127536 34.659381 2.302439 48.753377-0.733711 0.815575-1.486864 1.588171-2.302439 2.302439l-0.078795 0.080841-0.13917 0.13917L347.388918 870.981954c-14.074553 12.824073-35.909861 11.791557-48.752354-2.302439-12.824073-14.09502-11.792581-35.930327 2.303462-48.753377l336.845795-307.16889101-336.845795-307.14944899L300.939003 205.606775 300.939003 205.606775z"  ></path></symbol></svg>', o = (o = document.getElementsByTagName("script"))[o.length - 1].getAttribute("data-injectcss"), d = function(a2, l2) {
    l2.parentNode.insertBefore(a2, l2);
  };
  if (o && !a.__iconfont__svg__cssinject__) {
    a.__iconfont__svg__cssinject__ = true;
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (a2) {
      console && console.log(a2);
    }
  }
  function s() {
    i || (i = true, c());
  }
  function h() {
    try {
      e.documentElement.doScroll("left");
    } catch (a2) {
      return void setTimeout(h, 50);
    }
    s();
  }
  l = function() {
    var a2, l2 = document.createElement("div");
    l2.innerHTML = n, n = null, (l2 = l2.getElementsByTagName("svg")[0]) && (l2.setAttribute("aria-hidden", "true"), l2.style.position = "absolute", l2.style.width = 0, l2.style.height = 0, l2.style.overflow = "hidden", l2 = l2, (a2 = document.body).firstChild ? d(l2, a2.firstChild) : a2.appendChild(l2));
  }, document.addEventListener ? ~["complete", "loaded", "interactive"].indexOf(document.readyState) ? setTimeout(l, 0) : (t = function() {
    document.removeEventListener("DOMContentLoaded", t, false), l();
  }, document.addEventListener("DOMContentLoaded", t, false)) : document.attachEvent && (c = l, e = a.document, i = false, h(), e.onreadystatechange = function() {
    e.readyState == "complete" && (e.onreadystatechange = null, s());
  });
}(window);

const install = (app) => {
  app.component("SimpleJson", SimpleJson);
  return app;
};
var index = {
  install
};

export { index as SimpleJson, deepAnalysisJson, deepReductionJson };
