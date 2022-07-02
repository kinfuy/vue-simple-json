'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.defaultConfig = defaultConfig;
