import { type PropType, computed, defineComponent } from 'vue';
import ValueEditor from './value.editor';
import Icon from './icon/Icon.vue';
import {
  IconAdd,
  IconArrowDown,
  IconArrowRight,
  IconDelete,
  IconSwitch,
} from './icon/libs';
import LineChildren from './line-children';
import type { LineTarget } from '../core/line';

const supportTypes = [
  { label: '数组', value: 'array' },
  { label: '对象', value: 'object' },
  { label: '数字', value: 'number' },
  { label: '布尔值', value: 'boolean' },
  { label: '字符串', value: 'string' },
  { label: '时间', value: 'date' },
];

export default defineComponent({
  name: 'LineNode',
  props: {
    line: {
      type: Object as PropType<LineTarget>,
      default: () => {},
    },
  },
  setup(props) {
    const isCanAdd = computed(() => {
      return !props.line?.children.some((x) => x.lineError);
    });

    return { isCanAdd };
  },
  render() {
    const { isCanAdd } = this;
    const { line } = this.$props;

    const RenderValue = () => {
      return (
        <ValueEditor
          onChange={(value) => line.update('value', value)}
          valueType={line.valueType}
          value={line.value}
        />
      );
    };

    const RenderLine = () => {
      const LinePrefix = () => {
        const prefix = () => {
          return (
            <Icon onClick={() => line.extend()} class="pointer">
              {line.isExtend ? <IconArrowDown /> : <IconArrowRight />}
            </Icon>
          );
        };
        return (
          <div class="line-node-prefix">
            {line.type !== 'line' ? prefix() : null}
          </div>
        );
      };
      const LineContent = () => {
        return (
          <div
            class={['line-node-content', { 'line-error': line.lineError }]}
            title={line.lineError}
          >
            {!line.isRoot ? (
              <div class="line-node-key">
                <ValueEditor
                  disabled={line.parent?.type === 'array'}
                  type="key"
                  onChange={(value) => line.update('key', value)}
                  valueType="string"
                  value={line.key}
                />
              </div>
            ) : (
              'state'
            )}
            {line.type === 'object' && (
              <div class="line-children-length">
                &#123; {line.children?.length} &#125;
              </div>
            )}
            {line.type === 'array' && (
              <div class="line-children-length">
                &#91; {line.children?.length} &#93;
              </div>
            )}
            {line.type === 'line' && (
              <>
                <div class="line-node-division">:</div>
                <div class={['line-node-value', `${line.valueType}`]}>
                  <RenderValue />
                </div>
              </>
            )}
          </div>
        );
      };

      const LineSuffix = () => {
        return (
          <div class="line-node-suffix">
            {!line.isRoot && (
              <>
                <Icon class="pointer" onClick={() => line.remove()}>
                  <IconDelete />
                </Icon>
              </>
            )}
          </div>
        );
      };
      return (
        <>
          <LinePrefix />
          <LineContent />
          <LineSuffix />
        </>
      );
    };
    return (
      <>
        <div
          class="line-node"
          style={{ 'margin-left': `${line.level * 24}px` }}
        >
          <RenderLine />
        </div>
        {line.isExtend ? <LineChildren line={line}></LineChildren> : null}
        {line.type !== 'line' && line.isExtend && isCanAdd && (
          <div
            class="line-node-add "
            style={{ 'margin-left': `${(line.level + 1) * 24}px` }}
          >
            <div class="line-node-add-icon" onClick={() => line.insert()}>
              <Icon>
                <IconAdd />
              </Icon>
            </div>
          </div>
        )}
      </>
    );
  },
});
