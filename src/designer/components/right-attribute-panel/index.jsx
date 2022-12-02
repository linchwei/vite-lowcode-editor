
import { defineComponent, reactive, watch } from 'vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import styles from './index.module.scss';
import { AttrEditor, Animate, EventAction, FormRule } from './components';
import { useVisualData } from '@/designer/hooks/useVisualData';

export default defineComponent({
  name: 'RightAttributePanel',
  setup () {
    const { currentBlock } = useVisualData();

    const state = reactive({
      activeName: 'attr',
      isOpen: true,
    });

    watch(
      () => currentBlock.value.label,
      (newLabel) => {
        if (!newLabel?.startsWith('表单') && state.activeName == 'form-rule') {
          state.activeName = 'attr';
        }
      },
    );

    return () => (
      <>
        <div class={[styles.drawer, { [styles.isOpen]: state.isOpen }]}>
          <div class={styles.floatingActionBtn} onClick={() => (state.isOpen = !state.isOpen)}>
            {state.isOpen ? <RightOutlined /> : <LeftOutlined />}
          </div>
          <div class={styles.attrs}>
            <a-tabs
              v-model={state.activeName}
              type="border-card"
              class={styles.tabs}
            >
              <a-tab-pane tab="属性" name="attr">
                <AttrEditor />
              </a-tab-pane>
              <a-tab-pane tab="动画" name="animate" lazy>
                <Animate />
              </a-tab-pane>
              <a-tab-pane tab="事件" name="events">
                <EventAction />
              </a-tab-pane>
              {currentBlock.value.label?.startsWith('表单') ? (
                <a-tab-pane tab="规则" name="form-rule" lazy>
                  <FormRule />
                </a-tab-pane>
              ) : null}
            </a-tabs>
          </div>
        </div>
      </>
    );
  },
});