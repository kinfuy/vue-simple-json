import { type PropType, defineComponent, nextTick, ref, watch } from 'vue';

export default defineComponent({
  name: 'ValueEditor',
  props: {
    type: {
      type: String as PropType<'key' | 'value'>,
      default: 'value',
    },
    valueType: {
      type: String,
      default: 'string',
    },
    value: {
      type: [String, Number, Boolean, Date],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value', 'change', 'focus', 'blur'],
  setup(props, { emit }) {
    const valueEditorRef = ref();
    const stateValue = ref<string | number | boolean | Date>('');

    const isEdit = ref(false);
    watch(
      () => props.value,
      (val) => {
        stateValue.value = val;
      },
      {
        immediate: true,
      }
    );
    const mountedRef = (el: any) => {
      valueEditorRef.value = el;
    };

    const handleClick = () => {
      if (!props.disabled) {
        isEdit.value = true;
        nextTick(() => {
          if (valueEditorRef.value) {
            valueEditorRef.value.focus();
            emit('focus');
          }
        });
        stateValue.value = props.value;
      } else {
        isEdit.value = false;
      }
    };

    const handleChange = () => {
      let value = valueEditorRef.value.innerText.replace(/^"|"$/g, '');
      if (props.valueType === 'number')
        value = Number.isNaN(Number(value)) ? 0 : Number(value);
      emit('update:value', value);
      emit('change', value);
      handleBlur();
    };

    const handleBlur = () => {
      emit('blur');
      isEdit.value = false;
    };

    const handleEnter = (e: KeyboardEvent) => {
      e.preventDefault();
    };
    return {
      valueEditorRef,
      isEdit,
      stateValue,
      mountedRef,
      handleClick,
      handleChange,
      handleEnter,
    };
  },
  render() {
    const { valueType } = this.$props;
    const { mountedRef, handleChange, handleClick, stateValue, isEdit } = this;

    return (
      <div spellcheck="false" onClick={() => handleClick()}>
        <span
          ref={mountedRef}
          class={[valueType, { 'line-node-edited': isEdit }]}
          onBlur={() => handleChange()}
        >
          {String(stateValue)}
        </span>
      </div>
    );
  },
});
