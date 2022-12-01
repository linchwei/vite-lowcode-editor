import { defineComponent, getCurrentInstance, onMounted, PropType, reactive, createApp } from 'vue';
import { ElButton, ElDialog, ElTable, ElTableColumn, ElInput } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { defer } from '@/visual-editor/utils/defer';
import { VisualEditorProps } from '@/visual-editor/visual-editor.props';

const ServiceComponent = defineComponent({
  props: {
    option: { type: Object, required: true },
  },
  setup (props) {
    const ctx = getCurrentInstance();

    const state = reactive({
      option: props.option,
      showFlag: false,
      mounted: (() => {
        const dfd = defer();
        onMounted(() => setTimeout(() => dfd.resolve(), 0));
        return dfd.promise;
      })(),
      editData: [],
    });

    const methods = {
      service: (option) => {
        state.option = option;
        state.editData = cloneDeep(option.data || []);
        methods.show();
      },
      show: async () => {
        await state.mounted;
        state.showFlag = true;
      },
      hide: () => {
        state.showFlag = false;
      },
      add: () => {
        state.editData.push({});
      },
      reset: () => {
        state.editData = cloneDeep(state.option.data);
      },
    };

    const handler = {
      onConfirm: () => {
        state.option.onConfirm(state.editData);
        methods.hide();
      },
      onCancel: () => {
        methods.hide();
      },
      onDelete: (index) => {
        state.editData.splice(index, 1);
      },
    };

    Object.assign(ctx.proxy, methods);

    return () => (
      <>
        <ElDialog v-model={state.showFlag}>
          {{
            default: () => (
              <div>
                <div>
                  <ElButton {...({ onClick: methods.add })}>添加</ElButton>
                  <ElButton {...({ onClick: methods.reset })}>重置</ElButton>
                </div>
                <ElTable data={state.editData}>
                  <ElTableColumn {...({ type: 'index' })} />
                  {state.option.config.table.options.map((item) => (
                    <ElTableColumn {...({ label: item.label })}>
                      {{
                        default: ({ row }) => <ElInput v-model={row[item.field]} />,
                      }}
                    </ElTableColumn>
                  ))}
                  <ElTableColumn {...({ label: '操作栏' })}>
                    {{
                      default: ({ $index }) => (
                        <ElButton
                          type="danger"
                          {...({ onClick: () => handler.onDelete($index) })}
                        >
                          删除
                        </ElButton>
                      ),
                    }}
                  </ElTableColumn>
                </ElTable>
              </div>
            ),
            footer: () => (
              <>
                <ElButton {...({ onClick: handler.onCancel })}>取消</ElButton>
                <ElButton type="primary" {...({ onClick: handler.onConfirm })}>
                  确定
                </ElButton>
              </>
            ),
          }}
        </ElDialog>
      </>
    );
  },
});

export const $$tablePropEditor = (() => {
  let ins;
  return (option) => {
    if (!ins) {
      const el = document.createElement('div');
      document.body.appendChild(el);
      const app = createApp(ServiceComponent, { option });
      ins = app.mount(el);
    }
    const dfd = defer();
    ins.service({
      ...option,
      onConfirm: dfd.resolve,
    });
    return dfd.promise;
  };
})();
