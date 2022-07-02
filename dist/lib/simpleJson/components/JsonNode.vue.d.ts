import type { PropType } from 'vue';
import type { JsonItem } from './../type/simple-json';
declare const _default: import("vue").DefineComponent<{
    json: {
        type: PropType<JsonItem>;
        required: true;
    };
    currectLevel: {
        type: NumberConstructor;
        default: number;
    };
}, void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
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
