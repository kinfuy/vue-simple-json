import type { Plugin } from 'vue';
export declare const SimpleJson: {
    new (...args: any[]): {
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            disabled: boolean;
            extendAll: boolean;
            extendLevel: number;
            speciallyKey: import("..").SpeciallyKeyItem[];
            isBlock: boolean;
            config: import("..").JsonEditorConfig;
        }> & Omit<Readonly<import("vue").ExtractPropTypes<{
            json: {
                type: import("vue").PropType<import("..").PropJsonItem[]>;
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
                type: import("vue").PropType<import("..").SpeciallyKeyItem[]>;
                default: () => never[];
            };
            isBlock: {
                type: BooleanConstructor;
                default: boolean;
            };
            config: {
                type: import("vue").PropType<import("..").JsonEditorConfig>;
                default: () => void;
            };
        }>> & {
            "onUpdate:value"?: ((...args: any[]) => any) | undefined;
            onChange?: ((...args: any[]) => any) | undefined;
            onExtend?: ((...args: any[]) => any) | undefined;
            onDelete?: ((...args: any[]) => any) | undefined;
            "onType-switch"?: ((...args: any[]) => any) | undefined;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, "disabled" | "extendAll" | "extendLevel" | "speciallyKey" | "isBlock" | "config">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import("vue").Slot | undefined;
        }>;
        $root: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $parent: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $emit: (event: "update:value" | "change" | "extend" | "delete" | "type-switch", ...args: any[]) => void;
        $el: any;
        $options: import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
            json: {
                type: import("vue").PropType<import("..").PropJsonItem[]>;
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
                type: import("vue").PropType<import("..").SpeciallyKeyItem[]>;
                default: () => never[];
            };
            isBlock: {
                type: BooleanConstructor;
                default: boolean;
            };
            config: {
                type: import("vue").PropType<import("..").JsonEditorConfig>;
                default: () => void;
            };
        }>> & {
            "onUpdate:value"?: ((...args: any[]) => any) | undefined;
            onChange?: ((...args: any[]) => any) | undefined;
            onExtend?: ((...args: any[]) => any) | undefined;
            onDelete?: ((...args: any[]) => any) | undefined;
            "onType-switch"?: ((...args: any[]) => any) | undefined;
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
        }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:value" | "change" | "extend" | "delete" | "type-switch")[], string, {
            disabled: boolean;
            extendAll: boolean;
            extendLevel: number;
            speciallyKey: import("..").SpeciallyKeyItem[];
            isBlock: boolean;
            config: import("..").JsonEditorConfig;
        }> & {
            beforeCreate?: ((() => void) | (() => void)[]) | undefined;
            created?: ((() => void) | (() => void)[]) | undefined;
            beforeMount?: ((() => void) | (() => void)[]) | undefined;
            mounted?: ((() => void) | (() => void)[]) | undefined;
            beforeUpdate?: ((() => void) | (() => void)[]) | undefined;
            updated?: ((() => void) | (() => void)[]) | undefined;
            activated?: ((() => void) | (() => void)[]) | undefined;
            deactivated?: ((() => void) | (() => void)[]) | undefined;
            beforeDestroy?: ((() => void) | (() => void)[]) | undefined;
            beforeUnmount?: ((() => void) | (() => void)[]) | undefined;
            destroyed?: ((() => void) | (() => void)[]) | undefined;
            unmounted?: ((() => void) | (() => void)[]) | undefined;
            renderTracked?: (((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[]) | undefined;
            renderTriggered?: (((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[]) | undefined;
            errorCaptured?: (((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import("vue").ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null, info: string) => boolean | void)[]) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof import("vue").nextTick;
        $watch(source: string | Function, cb: Function, options?: import("vue").WatchOptions<boolean> | undefined): import("vue").WatchStopHandle;
    } & Readonly<import("vue").ExtractPropTypes<{
        json: {
            type: import("vue").PropType<import("..").PropJsonItem[]>;
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
            type: import("vue").PropType<import("..").SpeciallyKeyItem[]>;
            default: () => never[];
        };
        isBlock: {
            type: BooleanConstructor;
            default: boolean;
        };
        config: {
            type: import("vue").PropType<import("..").JsonEditorConfig>;
            default: () => void;
        };
    }>> & {
        "onUpdate:value"?: ((...args: any[]) => any) | undefined;
        onChange?: ((...args: any[]) => any) | undefined;
        onExtend?: ((...args: any[]) => any) | undefined;
        onDelete?: ((...args: any[]) => any) | undefined;
        "onType-switch"?: ((...args: any[]) => any) | undefined;
    } & import("vue").ShallowUnwrapRef<{
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
    }> & {} & import("vue").ComponentCustomProperties;
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    json: {
        type: import("vue").PropType<import("..").PropJsonItem[]>;
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
        type: import("vue").PropType<import("..").SpeciallyKeyItem[]>;
        default: () => never[];
    };
    isBlock: {
        type: BooleanConstructor;
        default: boolean;
    };
    config: {
        type: import("vue").PropType<import("..").JsonEditorConfig>;
        default: () => void;
    };
}>> & {
    "onUpdate:value"?: ((...args: any[]) => any) | undefined;
    onChange?: ((...args: any[]) => any) | undefined;
    onExtend?: ((...args: any[]) => any) | undefined;
    onDelete?: ((...args: any[]) => any) | undefined;
    "onType-switch"?: ((...args: any[]) => any) | undefined;
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
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:value" | "change" | "extend" | "delete" | "type-switch")[], "update:value" | "change" | "extend" | "delete" | "type-switch", {
    disabled: boolean;
    extendAll: boolean;
    extendLevel: number;
    speciallyKey: import("..").SpeciallyKeyItem[];
    isBlock: boolean;
    config: import("..").JsonEditorConfig;
}> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin & Record<string, any>;
export default SimpleJson;
