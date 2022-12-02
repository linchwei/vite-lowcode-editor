
import { defineComponent } from 'vue';
import { useVModel } from '@vueuse/core';
import { $$tablePropEditor } from './table-prop-edit.service';

export const TablePropEditor = defineComponent({
  props: {
    modelValue: { type: Array },
    propConfig: { type: Object, required: true },
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const model = useVModel(props, 'modelValue', emit);

    const onClick = async () => {
      const data = await $$tablePropEditor({
        config: props.propConfig,
        data: props.modelValue || [],
      });
      model.value = data;
    };

    return () => (
      <div>
        {(!model.value || model.value.length == 0) && (
          <a-button {...({ onClick })}>添加</a-button>
        )}
        {(model.value || []).map((item) => (
          <a-tag {...({ onClick })}>{item[props.propConfig.table.showKey]}</a-tag>
        ))}
      </div>
    );
  },
});
