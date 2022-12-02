import { defineComponent } from 'vue';
import { useVModel } from '@vueuse/core';
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import styles from './index.module.scss';

export const FormatInputNumber = defineComponent({
  props: {
    modelValue: {
      type: [String],
      default: '',
    },
    symbol: {
      // 符号
      type: String,
      default: 'px',
    },
    max: {
      type: [Number],
      default: 100,
    },
    min: {
      type: [Number],
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup (props, { attrs }) {
    const modelValue = useVModel(props, 'modelValue');

    const onInput = (val) => {
      let num = parseFloat(`${val}`.replace(/[^0-9]/gi, ''));
      num = Number.isNaN(num) ? 0 : num;
      num = Math.max(props.min, num);
      num = Math.min(props.max, num);
      modelValue.value = num + props.symbol;
    };

    const increment = () => {
      onInput(parseFloat(modelValue.value) + 1);
    };

    const cutdown = () => {
      onInput(Math.max(props.min, parseFloat(modelValue.value) - 1));
    };

    return () => (
      <div class={styles.formatInputNumber}>
        <a-input
          model-value={modelValue.value}
          placeholder={'请输入内容'}
          {...attrs}
          onInput={onInput}
        >
          {{
            append: () => (
              <div class={'flex flex-col'}>
                <div onClick={increment} class={'cursor-pointer leading-0'}>
                  <UpOutlined />
                </div>
                <div onClick={cutdown} class={'cursor-pointer leading-0'}>
                  <DownOutlined />
                </div>
              </div>
            ),
          }}
        </a-input>
      </div>
    );
  },
});
