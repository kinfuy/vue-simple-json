import { Ref, VNodeArrayChildren } from 'vue';

interface PropJsonItem {
  id: string;
  key: string | number;
  value: any;
  type: string;
}
interface JsonItem {
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
type EventTrigger = (name: string, value: any) => void;

interface ExtendCatchKeyItem {
  id: string;
}

interface SpeciallyKeyItem {
  id: string;
  type: string;
}

interface JsonEditorContext {
  extendCatchKey: Ref<ExtendCatchKeyItem[]>;
  speciallyKey: Ref<ExtendCatchKeyItem[]>;
  disabled: Ref<boolean>;
  extendAll: Ref<boolean>;
  extendLevel: Ref<number>;
  jsonConfig: Ref<JsonEditorConfig>;
}
interface OperationItem {
  key: string;
  text?: string;
  title: string;
  className?: string;
  clickEvent: ({ key, value }: { key: string | number; value: any }) => Promise<{ type: string; value: any }>;
  render?: () => () => VNodeArrayChildren;
}
interface AllowTypeItem {
  type: string;
  desc: string;
  default: any;
  slot?: boolean;
}
interface JsonEditorConfig {
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
