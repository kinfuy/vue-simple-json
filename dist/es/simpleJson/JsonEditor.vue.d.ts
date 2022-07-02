import type { PropType } from 'vue';
import type { JsonEditorConfig, PropJsonItem, SpeciallyKeyItem } from './type/simple-json';
declare const _default: import("vue").DefineComponent<{
    json: {
        type: PropType<PropJsonItem[]>;
        required: true;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    extendAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    extendLevel: {
        type: NumberConstructor;
        default: number;
    };
    speciallyKey: {
        type: PropType<SpeciallyKeyItem[]>;
        default: () => never[];
    };
    isBlock: {
        type: BooleanConstructor;
        default: boolean;
    };
    config: {
        type: PropType<JsonEditorConfig>;
        default: () => void;
    };
}, {
    stateData: import("vue").Ref<{
        id: string;
        key: string | number;
        value: any;
        catchValue?: {
            type: string;
            value: any;
        } | undefined;
        type: string;
        root?: boolean | undefined;
    }>;
    extendCatchKey: import("vue").Ref<{
        id: string;
    }[]>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:value" | "change" | "extend" | "delete" | "type-switch")[], "update:value" | "change" | "extend" | "delete" | "type-switch", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    json: {
        type: PropType<PropJsonItem[]>;
        required: true;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    extendAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    extendLevel: {
        type: NumberConstructor;
        default: number;
    };
    speciallyKey: {
        type: PropType<SpeciallyKeyItem[]>;
        default: () => never[];
    };
    isBlock: {
        type: BooleanConstructor;
        default: boolean;
    };
    config: {
        type: PropType<JsonEditorConfig>;
        default: () => void;
    };
}>> & {
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
    onExtend?: ((...args: any[]) => any) | undefined;
    onDelete?: ((...args: any[]) => any) | undefined;
    "onType-switch"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    extendAll: boolean;
    extendLevel: number;
    speciallyKey: SpeciallyKeyItem[];
    isBlock: boolean;
    config: JsonEditorConfig;
}>;
export default _default;
