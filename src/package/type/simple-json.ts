import { Ref, VNodeArrayChildren } from 'vue';

export interface PropJsonItem {
  id: string;
  key: string | number;
  value: any;
  type: string;
}
export interface JsonItem {
  id: string;
  key: string | number;
  value: any;
  catchValue?: {
    type: string;
    value: any;
  };
  type: string;
  root?: boolean;
}
export type EventTrigger = (name: string, value: any) => void;

export interface ExtendCatchKeyItem {
  id: string;
}

export interface SpeciallyKeyItem {
  id: string;
  type: string;
}

export interface JsonEditorContext {
  extendCatchKey: Ref<ExtendCatchKeyItem[]>;
  speciallyKey: Ref<ExtendCatchKeyItem[]>;
  disabled: Ref<boolean>;
  extendAll: Ref<boolean>;
  extendLevel: Ref<number>;
  jsonConfig: Ref<JsonEditorConfig>;
}
export interface OperationItem {
  key: string;
  text?: string;
  title: string;
  className?: string;
  clickEvent: ({ key, value }: { key: string | number; value: any }) => Promise<{ type: string; value: any }>;
  render?: () => () => VNodeArrayChildren;
}
export interface AllowTypeItem {
  type: string;
  desc: string;
  default: any;
  slot?: boolean;
}
export interface JsonEditorConfig {
  keyColor: {
    [key: string]: string;
    string: string;
    object: string;
    array: string;
    number: string;
    boolean: string;
    function: string;
    date: string;
    regExp: string;
    undefined: string;
    null: string;
  };
  allowType: Array<AllowTypeItem>;
  showHover: boolean;
  addType: boolean;
  appendOperate?: Array<OperationItem>;
}
