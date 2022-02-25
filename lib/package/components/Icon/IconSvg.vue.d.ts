declare const _default: import("vue").DefineComponent<{
    name: {
        type: StringConstructor;
        required: true;
    };
    fixClass: {
        type: StringConstructor;
        default: undefined;
    };
}, {
    iconName: import("vue").ComputedRef<string>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    name: {
        type: StringConstructor;
        required: true;
    };
    fixClass: {
        type: StringConstructor;
        default: undefined;
    };
}>>, {
    fixClass: string;
}>;
export default _default;
