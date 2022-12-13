import { defineComponent, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { WarningOutlined } from '@ant-design/icons-vue';
import { PropConfig } from './components/prop-config';
import { visualConfig } from '@/config/componentModules';
import { useComponentStore } from "@/store/componentStore";
import { FormatInputNumber } from '@/designer/components/common/format-input-number';

export const AttrEditor = defineComponent({
  setup () {
    const componentStore = useComponentStore();
    const { currentComponent } = storeToRefs(componentStore);
    const compPaddingAttrs = ['paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom'];

    /**
     * @description 监听组件padding值的变化
     */
    watch(
      compPaddingAttrs.map((item) => () => currentComponent.value.styles?.[item]),
      (val) => {
        const isSame = val.every((item) => currentComponent.value.styles?.tempPadding == item);
        if (isSame || new Set(val).size === 1) {
          if (Reflect.has(currentComponent.value, 'styles')) {
            currentComponent.value.styles.tempPadding = val[0];
          }
        } else {
          currentComponent.value.styles.tempPadding = '';
        }
      },
    );

    /**
     * @description 总的组件padding变化时进行的操作
     */
    const compPadding = computed({
      get: () => currentComponent.value.styles?.tempPadding,
      set (val) {
        compPaddingAttrs.forEach((item) => (currentComponent.value.styles[item] = val));
        currentComponent.value.styles.tempPadding = val;
      },
    });

    // 表单项
    const FormEditor = () => {
      const content = [];
      if (currentComponent.value) {
        const { componentKey } = currentComponent.value;
        const component = visualConfig.componentMap[componentKey];
        console.log('props.block:', currentComponent.value);
        content.push(
          <>
            <a-form-item label="组件ID" labelWidth={'76px'}>
              {currentComponent.value._vid}
              <a-tooltip
                title={`你可以利用该组件ID。对该组件进行获取和设置其属性，组件可用属性可在控制台输入：$$refs.${currentComponent.value._vid} 进行查看`}
              >
                <WarningOutlined />
              </a-tooltip>
            </a-form-item>
          </>,
        );
        if (component) {
          if (component.props) {
            content.push(<PropConfig component={component} block={currentComponent.value} />);
            {
              currentComponent.value.showStyleConfig &&
                content.push(
                  <a-form-item label={'组件对齐方式'} labelWidth={'90px'}>
                    <a-radio-group v-model={currentComponent.value.styles.justifyContent}>
                      <a-radio-button value="flex-start">{'左对齐'}</a-radio-button>
                      <a-radio-button value="center">{'居中'}</a-radio-button>
                      <a-radio-button value="flex-end">{'右对齐'}</a-radio-button>
                    </a-radio-group>
                  </a-form-item>,
                  <a-form-item class={'flex flex-col justify-start'}>
                    {{
                      label: () => (
                        <div class={'flex justify-between mb-2'}>
                          <div class="mr-3">组件内边距</div>
                          <FormatInputNumber v-model={compPadding.value} class={'!w-100px'} />
                        </div>
                      ),
                      default: () => (
                        <div
                          class={'grid grid-cols-3 gap-2 w-full bg-gray-100 p-20px items-center'}
                        >
                          <FormatInputNumber
                            v-model={currentComponent.value.styles.paddingTop}
                            class={'!w-100px col-span-full col-start-2'}
                          />
                          <FormatInputNumber
                            v-model={currentComponent.value.styles.paddingLeft}
                            class={'!w-100px col-span-1'}
                          />
                          <div class={'bg-white col-span-1 h-40px'}></div>
                          <FormatInputNumber
                            v-model={currentComponent.value.styles.paddingRight}
                            class={'!w-100px col-span-1'}
                          />
                          <FormatInputNumber
                            v-model={currentComponent.value.styles.paddingBottom}
                            class={'!w-100px col-span-full col-start-2'}
                          />
                        </div>
                      ),
                    }}
                  </a-form-item>,
                );
            }
          }
        }
      }
      return (
        <>
          <a-form >{content}</a-form>
        </>
      );
    };

    return () => (
      <>
        <FormEditor />
      </>
    );
  },
});