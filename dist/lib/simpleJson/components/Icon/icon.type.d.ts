import type { ExtractPropTypes } from 'vue';
import type Icon from './IconSvg.vue';
export declare const iconProps: {
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
};
export declare type IconProps = ExtractPropTypes<typeof iconProps>;
export declare type IconInstanceType = InstanceType<typeof Icon>;
