import { type PropType, computed, defineComponent, inject } from 'vue';
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
import { SIMPLEJSON_INJECTKEY } from './simple-json';
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

    const { clearActive, setActive, activekeys } =
      inject(SIMPLEJSON_INJECTKEY)!;

    const getKeys = (line: LineTarget) => {
      const ids = [];
      ids.push(line.id);
      line.children.forEach((x) => {
        ids.push(x.id);
        if (line.children.length > 0) {
          ids.push(...getKeys(x));
        }
      });
      return ids;
    };

    const mouseenter = () => {
      const ids = getKeys(props.line);
      setActive(ids);
    };

    return { isCanAdd, clearActive, setActive, activekeys, mouseenter };
  },
  render() {
    const { isCanAdd, clearActive, activekeys, mouseenter } = this;
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
          class={['line-node', { 'node-active': activekeys.includes(line.id) }]}
          style={{ 'padding-left': `${line.level * 24}px` }}
        >
          <RenderLine />
        </div>
        {line.isExtend ? <LineChildren line={line}></LineChildren> : null}
        {line.type !== 'line' && line.isExtend && isCanAdd && (
          <div
            class={[
              'line-node-add',
              { 'node-active': activekeys.includes(line.id) },
            ]}
            style={{ 'padding-left': `${(line.level + 1) * 24 + 20}px` }}
          >
            <div class="line-node-add-icon" onClick={() => line.insert()}>
              <Icon
                onMouseenter={() => mouseenter()}
                onMouseleave={() => clearActive()}
              >
                <IconAdd />
              </Icon>
            </div>
          </div>
        )}
      </>
    );
  },
});
