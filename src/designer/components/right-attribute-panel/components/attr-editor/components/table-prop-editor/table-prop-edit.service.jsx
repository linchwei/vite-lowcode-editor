import { defineComponent, getCurrentInstance, onMounted, reactive, createApp } from 'vue';
import { cloneDeep } from 'lodash-es';
import { defer } from '@/designer/utils/defer';

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
        <a-modal v-model={state.showFlag}>
          {{
            default: () => (
              <div>
                <div>
                  <a-button {...({ onClick: methods.add })}>添加</a-button>
                  <a-button {...({ onClick: methods.reset })}>重置</a-button>
                </div>
                <a-table data={state.editData}>
                  <a-table-column {...({ type: 'index' })} />
                  {state.option.config.table.options.map((item) => (
                    <a-table-column {...({ label: item.label })}>
                      {{
                        default: ({ row }) => <a-input v-model={row[item.field]} />,
                      }}
                    </a-table-column>
                  ))}
                  <a-table-column {...({ label: '操作栏' })}>
                    {{
                      default: ({ $index }) => (
                        <a-button
                          type="danger"
                          {...({ onClick: () => handler.onDelete($index) })}
                        >
                          删除
                        </a-button>
                      ),
                    }}
                  </a-table-column>
                </a-table>
              </div>
            ),
            footer: () => (
              <>
                <a-button {...({ onClick: handler.onCancel })}>取消</a-button>
                <a-button type="primary" {...({ onClick: handler.onConfirm })}>
                  确定
                </a-button>
              </>
            ),
          }}
        </a-modal>
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
