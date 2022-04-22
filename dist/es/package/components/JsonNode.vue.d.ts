import { PropType } from 'vue';
import { JsonItem, OperationItem } from './../type/simple-json';
declare const _default: import("vue").DefineComponent<{
    json: {
        type: PropType<JsonItem>;
        required: true;
    };
    currectLevel: {
        type: NumberConstructor;
        default: number;
    };
}, {
    stateData: import("vue").Ref<JsonItem | undefined>;
    isSub: import("vue").ComputedRef<boolean | undefined>;
    isEdit: import("vue").ComputedRef<boolean>;
    isExtend: import("vue").Ref<boolean>;
    extendLevel: import("vue").Ref<number>;
    extendAll: import("vue").Ref<boolean>;
    keyColor: import("vue").ComputedRef<string>;
    extendCatchKey: import("vue").Ref<import("./../type/simple-json").ExtendCatchKeyItem[]>;
    disabled: import("vue").Ref<boolean>;
    handleExtend: () => void;
    handleSwitch: (item?: JsonItem | undefined) => void;
    isHover: import("vue").ComputedRef<boolean>;
    jsonConfig: import("vue").Ref<import("./../type/simple-json").JsonEditorConfig>;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleValueChange: (value: any, item: JsonItem, type?: 'key' | 'value') => void;
    handleSlotValueChange: (value: any) => void;
    handleAddAttr: () => void;
    handleAttrDelete: () => void;
    handleValueFocus: () => void;
    handleValueBlur: () => void;
    handleCustom: (operate: OperationItem) => void;
    allowType: import("vue").ComputedRef<import("./../type/simple-json").AllowTypeItem[] | {
        type: any;
        desc: any;
        default: any;
        slot: any;
    }[]>;
    customAppendOperate: import("vue").ComputedRef<OperationItem[]>;
    valueSlot: import("vue").ComputedRef<boolean>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    json: {
        type: PropType<JsonItem>;
        required: true;
    };
    currectLevel: {
        type: NumberConstructor;
        default: number;
    };
}>>, {
    currectLevel: number;
}>;
export default _default;
