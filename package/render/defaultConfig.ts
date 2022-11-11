import type { Ref } from 'vue';

export interface ColorType {
  key?: string;
  value?: string;
}
export interface KeyColorConfig extends Record<string, any> {
  string: ColorType;
  object: ColorType;
  array: ColorType;
  number: ColorType;
  boolean: ColorType;
  function: ColorType;
  date: ColorType;
  regExp: ColorType;
  undefined: ColorType;
  null: ColorType;
}
export interface SimpleJsonConfig {
  keyColor: Partial<KeyColorConfig>;
}
export const defaultConfig: SimpleJsonConfig = {
  keyColor: {
    string: {
      key: '#8812a1',
      value: '#ac4b1e',
    },
    boolean: {
      key: '#8812a1',
      value: '#1a1aa6',
    },
    number: {
      key: '#8812a1',
      value: '#1a1aa6',
    },
  },
};

export interface JsonEditorContent {
  disabled: Ref<boolean>;
  extendAll: boolean;
  extendLevel: number;
  extraConfig: SimpleJsonConfig;
}
