import type { PropType, VNodeArrayChildren } from 'vue';
export interface RenderProps {
    render: () => VNodeArrayChildren;
}
declare const Render: {
    (props: RenderProps): VNodeArrayChildren;
    props: {
        render: {
            type: PropType<() => VNodeArrayChildren>;
        };
    };
};
export default Render;
