import { defineComponent, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import Draggable from 'vuedraggable';
import { useVModel } from '@vueuse/core';
import { cloneDeep } from 'lodash-es';
import { PlusCircleFilled, DeleteFilled } from '@ant-design/icons-vue';
import { PropConfig } from '../prop-config';
import { isObject } from '@/designer/utils/is';
import { useComponentStore } from "@/store/componentStore";

export const CrossSortableOptionsEditor = defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    multiple: Boolean, // 是否多选
    showItemPropsConfig: Boolean, // 是否多选
  },
  setup (props, { emit }) {
    const componentStore = useComponentStore();
    const { currentComponent } = storeToRefs(componentStore);
    const state = reactive({
      list: useVModel(props, 'modelValue', emit),
      drag: false,
    });

    const checkList = computed({
      get: () => {
        const value = currentComponent.value.props.modelValue;
        return Array.isArray(value) ? value : [...new Set(value?.split(','))];
      },
      set (value) {
        currentComponent.value.props.modelValue = value;
      },
    });

    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    });

    /**
     * @description 复选框值改变时触发
     */
    const onChange = (val) => {
      val = val.filter((item) => item !== '');
      val = props.multiple
        ? val
        : val.filter((n) => !currentComponent.value.props.modelValue?.includes(n));
      currentComponent.value.props.modelValue = val.join(',');
    };

    /**
     * @param {number} index - 在某项之前新增一项
     */
    const incrementOption = (index) => {
      const length = state.list.length + 1;
      const newItem = state.list.some((item) => isObject(item))
        ? Object.assign(cloneDeep(state.list[0]), {
          label: `选项${length}`,
          value: `选项${length}`,
        })
        : '';
      state.list.splice(index + 1, 0, newItem);
    };

    return () => (
      <div>
        <a-checkbox-group
          modelValue={checkList.value}
          style={{ fontSize: 'inherit' }}
          onChange={onChange}
        >
          <Draggable
            tag="ul"
            list={state.list}
            class="list-group"
            component-data={{
              tag: 'ul',
              type: 'transition-group',
              name: !state.drag ? 'flip-list' : null,
            }}
            handle=".handle"
            {...dragOptions.value}
            itemKey={''}
            onStart={() => (state.drag = true)}
            onEnd={() => (state.drag = false)}
          >
            {{
              item: ({ element, index }) => (
                <div class={'flex items-center justify-between'}>
                  {isObject(element) ? (
                    <>
                      <a-check-box label={element.value} class={'ml-5px'}>
                        {''}
                      </a-check-box>
                      label:
                      <a-input
                        v-model={element.label}
                        class={'my-12px mx-3px'}
                        style={{ width: '108px' }}
                        size="small"
                      ></a-input>
                      value:
                      <a-input
                        v-model={element.value}
                        class={'my-12px mx-3px'}
                        style={{ width: '106px' }}
                        size="small"
                      ></a-input>
                    </>
                  ) : (
                    <a-input
                      v-model={state.list[index]}
                      class={'m-12px'}
                      style={{ width: '270px' }}
                      size="small"
                    ></a-input>
                  )}
                  <div class={'flex flex-col'}>
                    <PlusCircleFilled />
                    <DeleteFilled />
                  </div>
                </div>
              ),
            }}
          </Draggable>
        </a-checkbox-group>
        {props.showItemPropsConfig && (
          <a-collapse>
            <a-collapse-item title={'选项配置'}>
              <a-tabs type={'border-card'}>
                {state.list.map((item) => (
                  <a-tab-pane tab={item.label} key={item.label}>
                    <a-form labelPosition={'left'} size="small">
                      <PropConfig component={item.component} block={item.block} />
                    </a-form>
                  </a-tab-pane>
                ))}
              </a-tabs>
            </a-collapse-item>
          </a-collapse>
        )}
      </div>
    );
  },
});