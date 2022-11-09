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
      type: [String, Number, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value', 'change', 'focus', 'blur'],
  setup(props, { emit }) {
    const ValueEditorRef = ref();
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
      ValueEditorRef.value = el;
    };

    const handleClick = () => {
      if (!props.disabled) {
        isEdit.value = true;
        nextTick(() => {
          if (ValueEditorRef.value) {
            ValueEditorRef.value.focus();
            emit('focus');
          }
        });
        stateValue.value = props.value;
      } else {
        isEdit.value = false;
      }
    };

    const edited = ref(false);
    const handleBlur = () => {
      isEdit.value = false;
      if (ValueEditorRef.value && edited.value) {
        let value: any = ValueEditorRef.value.innerText.replace(/^"|"$/g, '');
        if (props.valueType === 'number') {
          value = Number(value);
        }
        if (props.valueType === 'boolean') value = !!value;
        emit('update:value', value);
        emit('change', value);
      }
      emit('blur');
    };

    const handleInput = () => {
      edited.value = true;
      // if (valueEditorRef.value) {
      //   emit('update:value', valueEditorRef.value.innerText);
      //   emit('change', valueEditorRef.value.innerText);
      // }
    };
    const handleEnter = (e: KeyboardEvent) => {
      e.preventDefault();
    };
    return {
      ValueEditorRef,
      isEdit,
      stateValue,
      mountedRef,
      handleClick,
      handleBlur,
      handleInput,
      handleEnter,
    };
  },
  render() {
    const { valueType, type } = this.$props;
    const {
      mountedRef,
      handleBlur,
      handleInput,
      handleClick,
      stateValue,
      isEdit,
    } = this;
    return (
      <div spellcheck="false" onClick={() => handleClick()}>
        <span
          ref={mountedRef}
          class={{ 'line-node-edited': isEdit }}
          onBlur={handleBlur}
          onInput={handleInput}
        >
          {valueType === 'number' || valueType === 'boolean'
            ? String(stateValue)
            : null}
          {valueType === 'string' &&
            (type === 'value' ? `"${stateValue}"` : String(stateValue))}
        </span>
      </div>
    );
  },
});
