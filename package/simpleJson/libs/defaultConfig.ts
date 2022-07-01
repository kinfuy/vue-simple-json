import type { JsonEditorConfig } from '../type/simple-json';
export const defaultConfig: JsonEditorConfig = {
  keyColor: {
    string: '#71aff1',
    object: '#71aff1',
    array: '#71aff1',
    number: '#71aff1',
    function: '#71aff1',
    boolean: '#71aff1',
    null: '#71aff1',
    undefined: '#71aff1',
    date: '#71aff1',
    regExp: '#71aff1',
  },
  allowType: [
    {
      type: 'boolean',
      desc: '布尔值',
      default: false,
      slot: false,
    },
    {
      type: 'number',
      desc: '数字',
      default: 0,
      slot: false,
    },
    {
      type: 'string',
      desc: '字符串',
      default: '',
      slot: false,
    },
    {
      type: 'array',
      desc: '数组',
      default: () => [],
      slot: false,
    },
    {
      type: 'date',
      desc: '时间',
      default: new Date(),
      slot: false,
    },
    {
      type: 'object',
      desc: '对象',
      default: () => [],
      slot: false,
    },
    {
      type: 'null',
      desc: 'null',
      default: 'null',
      slot: false,
    },
    {
      type: 'undefined',
      desc: 'undefined',
      default: 'undefined',
      slot: false,
    },
    {
      type: 'function',
      desc: 'function',
      default: () => {},
      slot: false,
    },
  ],
  showHover: true,
  addType: true, // true 添加属性时向开头加入  false往结尾加入
};
