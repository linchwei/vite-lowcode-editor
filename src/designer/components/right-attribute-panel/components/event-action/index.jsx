import { computed, ref, defineComponent, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import { generateNanoid } from '@/designer/utils';
import { useModal } from '@/designer/hooks/useModal';
import { useComponentStore } from "@/store/componentStore";

/**
 * @description 创建一个空的动作处理对象
 */
const createEmptyActionHandle = () => ({
  key: generateNanoid(),
  name: '',
  link: [],
});

/**
 * @description 新增一个空的事件
 */
const createEmptyAction = () => ({
  key: generateNanoid(),
  name: '',
  event: '',
  handle: [createEmptyActionHandle()],
});

export const EventAction = defineComponent({
  setup () {
    const componentStore = useComponentStore();
    const { components, currentComponent } = storeToRefs(componentStore);
    /**
     * @description 是否处于编辑状态
     */
    const isEdit = computed(() =>
      currentComponent.value.actions?.some((item) => item.key === state.ruleForm.key),
    );
    const ruleFormRef = ref();

    const state = reactive({
      activeNames: [],
      ruleForm: createEmptyAction(),
    });

    /**
     * @description 可绑定的动作
     */
    const actionOptions = computed(() => [
      {
        label: '组件',
        value: 'component',
        children: cloneDeep(components.value.blocks)
          .filter((item) => item.actions?.length)
          .map((item) => {
            item.value = item._vid;
            item.children = (item.actions || []).map((item) => {
              item.label = item.name;
              item.value = item.key;
              return item;
            });
            return item;
          }),
      },
    ]);

    /**
     * @description 获取动作路径
     */
    const getActionPath = (link) => {
      const result = [];
      link.reduce((prev, curr) => {
        const target = prev?.find((item) => item.value == curr);
        result.push(`${target?.label}`);
        return target?.children;
      }, actionOptions.value);
      return result.join(' => ');
    };

    /**
     * @description 删除某个动作
     */
    const deleteActionItem = (index) => {
      currentComponent.value.actions.splice(index, 1);
    };
    /**
     * @description 删除事件的某个动作
     */
    const deleteActionHandleItem = (index) => {
      state.ruleForm.handle.splice(index, 1);
    };

    /**
     * @description 给组件新增一个事件模型
     */
    const addActionItem = () => {
      state.ruleForm = createEmptyAction();
      showOperateModal();
    };

    /**
     * @description 给事件新增一个空的动作
     */
    const addActionHanleItem = () => {
      state.ruleForm.handle.push(createEmptyActionHandle());
    };

    /**
     * @description 编辑事件
     */
    const showEditActionModal = (action) => {
      state.ruleForm = cloneDeep(action);
      showOperateModal();
    };

    /**
     * @description 显示操作动作的模态框
     */
    const showOperateModal = () => {
      const operateType = isEdit.value ? '编辑' : '新增';
      useModal({
        title: `${operateType}动作`,
        props: { width: 600 },
        content: () => (
          <a-form model={state.ruleForm} ref={ruleFormRef} label-width="100px">
            <a-form-item
              label="事件"
              prop={'event'}
              rules={[{ required: true, message: '请选择事件', trigger: 'change' }]}
            >
              <a-select v-model={state.ruleForm.event} class={'w-full'}>
                {currentComponent.value.events?.map((eventItem) => (
                  <a-select-option
                    key={eventItem.value}
                    value={eventItem.value}
                  > {eventItem.label} </a-select-option>
                ))}
              </a-select>
            </a-form-item>
            <a-form-item
              label="事件名称"
              prop="name"
              rules={[{ required: true, message: '请输入事件名称', trigger: 'change' }]}
            >
              <a-input v-model={state.ruleForm.name} placeholder={'请输入事件名称'} />
            </a-form-item>
            {!state.ruleForm.handle?.length && (
              <a-form-item>
                <a-button onClick={addActionHanleItem} type={'primary'}>
                  添加动作
                </a-button>
              </a-form-item>
            )}
            {state.ruleForm.handle.map((handleItem, index) => (
              <a-card
                key={handleItem.key}
                bordered={true}
                class={'mt-10px'}
                v-slots={{
                  header: () => (
                    <div class={'flex justify-between'}>
                      <a-form-item
                        label="动作名称"
                        prop={`handle.${index}.name`}
                        rules={[{ required: true, message: '请输入动作名称', trigger: 'change' }]}
                      >
                        <a-input v-model={handleItem.name} placeholder={'请输入动作名称'} />
                      </a-form-item>
                      <div>
                        <a-button onClick={() => deleteActionHandleItem(index)} type={'danger'}>
                          删除
                        </a-button>
                        <a-button onClick={addActionHanleItem} type={'primary'}>
                          添加
                        </a-button>
                      </div>
                    </div>
                  ),
                }}
              >
                <a-form-item
                  label="触发的动作"
                  prop={`handle.${index}.link`}
                  rules={[{ required: true, message: '请选择你要触发的动作', trigger: 'change' }]}
                >
                  <a-cascader
                    allowClear={true}
                    class={'w-full'}
                    placeholder="请选择你要触发的动作"
                    v-model={handleItem.link}
                    options={actionOptions.value}
                  ></a-cascader>
                </a-form-item>
              </a-card>
            ))}
          </a-form>
        ),
        onConfirm: () => {
          return new Promise((resolve, reject) => {
            ruleFormRef.value?.validate((valid) => {
              if (valid) {
                const index = currentComponent.value.actions.findIndex(
                  (item) => item.key == state.ruleForm.key,
                );
                if (index === -1) {
                  currentComponent.value.actions.push(state.ruleForm);
                } else {
                  currentComponent.value.actions.splice(index, 1, state.ruleForm);
                }
                state.ruleForm = createEmptyAction();
                resolve('submit!');
              } else {
                reject();
                console.log('error submit!!');
                return false;
              }
            });
          });
        },
        onCancel: () => (state.ruleForm = createEmptyAction()),
      });
    };

    return () => (
      <>
        <a-button onClick={addActionItem} disabled={!currentComponent.value.actions} type="primary">
          添加事件
        </a-button>

        {currentComponent.value.actions?.map((actionItem, index) => (
          <a-card
            key={index}
            class={'mt-10px'}
            v-slots={{
              header: () => (
                <div class={'flex justify-between'}>
                  {actionItem.name}
                  <div>
                    <a-popconfirm
                      title={'确定要删除该事件吗？'}
                      onConfirm={() => deleteActionItem(index)}
                    >
                      {{
                        reference: () => <a-button type={'danger'}>删除</a-button>,
                      }}
                    </a-popconfirm>
                    <a-button onClick={() => showEditActionModal(actionItem)} type="primary">
                      编辑
                    </a-button>
                  </div>
                </div>
              ),
            }}
          >
            <a-collapse v-model={state.activeNames}>
              {actionItem.handle.map((item, index) => (
                <a-collapse-panel header={`${index + 1}. ${item.name}`} key={item.key}>
                  {{
                    default: () => <div>动作路径：{getActionPath(item.link)}</div>,
                  }}
                </a-collapse-panel>
              ))}
            </a-collapse>
          </a-card>
        ))}
      </>
    );
  },
});
