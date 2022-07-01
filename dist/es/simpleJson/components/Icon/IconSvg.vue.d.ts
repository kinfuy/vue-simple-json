declare const _default: import("vue").DefineComponent<{
    rotate: {
        type: NumberConstructor;
        default: undefined;
    };
    spin: BooleanConstructor;
    size: {
        type: NumberConstructor;
        default: undefined;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
}, {
    rotateStyle: import("vue").ComputedRef<{
        transform: string;
    } | {
        transform?: undefined;
    }>;
    sizeStyle: import("vue").ComputedRef<{
        fontSize: string;
    } | {
        fontSize?: undefined;
    }>;
    colorStyle: import("vue").ComputedRef<{
        color: string;
    } | {
        color?: undefined;
    }>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    rotate: {
        type: NumberConstructor;
        default: undefined;
    };
    spin: BooleanConstructor;
    size: {
        type: NumberConstructor;
        default: undefined;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    rotate: number;
    spin: boolean;
    size: number;
    color: string;
}>;
export default _default;
