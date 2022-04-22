import { PropType } from 'vue';
import { JsonEditorConfig, PropJsonItem, SpeciallyKeyItem } from './type/simple-json';
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
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "delete" | "update:value" | "extend" | "type-switch")[], "change" | "delete" | "update:value" | "extend" | "type-switch", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
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
    config: {
        type: PropType<JsonEditorConfig>;
        default: () => void;
    };
}>> & {
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
    onDelete?: ((...args: any[]) => any) | undefined;
    onExtend?: ((...args: any[]) => any) | undefined;
    "onType-switch"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    config: JsonEditorConfig;
    extendLevel: number;
    extendAll: boolean;
    speciallyKey: SpeciallyKeyItem[];
}>;
export default _default;
