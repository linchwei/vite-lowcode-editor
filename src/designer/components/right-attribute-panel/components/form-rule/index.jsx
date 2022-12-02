import { defineComponent } from 'vue';
import { QuestionCircleFilled } from '@ant-design/icons-vue';

export const FormRule = defineComponent({
  setup () {
    return () => (
      <>
        <a-card bordered={true} class={'mb-20px'}>
          {{
            header: () => (
              <div class="flex justify-between">
                <span>设置关联规则</span>
                <a-tooltip title="当前面题目选中某些选项时才出现此题" placement="bottom-end">
                  <QuestionCircleFilled />
                </a-tooltip>
              </div>
            ),
            default: () => <div>暂无规则</div>,
          }}
        </a-card>
        <a-card bordered={true} bodyStyle={{ padding: '0' }} class={'mb-20px'}>
          {{
            header: () => (
              <div class="flex justify-between">
                <span>设置选项关联规则</span>
                <a-tooltip
                  title="当前面题目选择某些选项时才出现此题的某些选项 "
                  placement="bottom-end"
                >
                  <QuestionCircleFilled />
                </a-tooltip>
              </div>
            ),
            default: () => null,
          }}
        </a-card>
      </>
    );
  },
});
