import { defineComponent } from 'vue';
import { cloneDeep } from 'lodash-es';
import Draggable from 'vuedraggable';
import { ContainerOutlined } from '@ant-design/icons-vue';
import styles from './index.module.scss';
import { visualConfig } from '@/config/componentModules';
import { createNewBlock } from '../../hooks/useCreateNewBlock';

export default ({
  name: 'ContainerComponent',
  label: '容器组件',
  icon: ContainerOutlined,
  order: 4,
  setup() {
    const log = (evt) => {
      window.console.log(evt);
    };
    // 克隆组件
    const cloneDog = (comp) => {
      console.log('当前拖拽的组件：', comp);
      const newComp = cloneDeep(comp);
      return createNewBlock(newComp);
    };

    return () => (
      <>
        <Draggable
          class={styles['list-group']}
          sort={false}
          forceFallback={false}
          list={visualConfig.componentModules.containerComponents}
          group={{ name: 'components', pull: 'clone', put: false }}
          clone={cloneDog}
          item-key="_vid"
          onChange={log}
        >
          {{
            item: ({ element }) => (
              <div class={styles['list-group-item']} data-label={element.label}>
                {element.preview()}
              </div>
            ),
          }}
        </Draggable>
      </>
    );
  },
});
