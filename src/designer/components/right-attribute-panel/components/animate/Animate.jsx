import { defineComponent, reactive, ref, watchEffect } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { PlayCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { animationTabs } from './animateConfig';
import styles from './animate.module.scss';
import { useVisualData } from '@/designer/hooks/useVisualData';
import { useAnimate } from '@/hooks/useAnimate';

export const Animate = defineComponent({
  setup () {
    const { currentBlock } = useVisualData();
    const target = ref();

    const state = reactive({
      activeName: '',
      isAddAnimates: false, // 是否显示添加动画集
      changeTargetIndex: -1, // 要修改的动画的索引
    });

    onClickOutside(target, () => (state.isAddAnimates = false));

    watchEffect((onInvalidate) => {
      if (state.isAddAnimates) {
        state.activeName = 'in';
      } else {
        state.changeTargetIndex = -1;
      }
      onInvalidate(() => {
        console.log('onInvalidate');
      });
    });

    /**
     * @description 运行动画
     */
    const runAnimation = (animation = []) => {
      let animateEl =
        (window.$$refs[currentBlock.value._vid]?.$el) ??
        (window.$$refs[currentBlock.value._vid]);

      animateEl = animateEl?.closest('.list-group-item')?.firstChild;

      if (animateEl) {
        useAnimate(animateEl, animation);
      }
    };

    /**
     * @description 点击要修改的动画名称
     */
    const clickAnimateName = (index) => {
      state.changeTargetIndex = index;
      state.isAddAnimates = true;
    };

    /**
     * @description 删除动画
     * @param index 要删除的动画的索引
     * @returns
     */
    const delAnimate = (index) => currentBlock.value.animations?.splice(index, 1);

    /**
     * @description 添加/修改 动画
     */
    const addOrChangeAnimate = (animateItem) => {
      const animation = {
        ...animateItem,
      };
      if (state.changeTargetIndex == -1) {
        currentBlock.value.animations?.push(animation);
      } else {
        // 修改动画
        currentBlock.value.animations[state.changeTargetIndex] = animation;
        state.changeTargetIndex = -1;
      }
      state.isAddAnimates = false;
      console.log(currentBlock.value.animations, '当前组件的动画');
    };

    // 已添加的动画列表组件
    const AddedAnimateList = () => (
      <>
        {currentBlock.value.animations?.map((item, index) => (
          <a-alert
            key={item.value}
            type={'info'}
            style={{ marginTop: '12px' }}
            onClose={() => delAnimate(index)}
          >
            {{
              title: () => (
                <div>
                  <span class={'title'}>{`动画${index + 1}`}</span>
                  <span onClick={() => clickAnimateName(index)} class={'label'}>
                    {item.label}
                  </span>

                  <span onClick={() => runAnimation(item)} class={'play'} title={'播放'}>
                    <PlayCircleOutlined />
                  </span>
                </div>
              ),
              default: () => (
                <>
                  <a-row gutter={6}>
                    <a-col span={8}>
                      时间：
                      <input v-model={item.duration} type="number" step={0.1} min={0} />
                    </a-col>
                    <a-col span={8}>
                      延迟：
                      <input v-model={item.delay} type="number" step={0.1} min={0} />
                    </a-col>
                    <a-col span={8}>
                      次数：
                      <input v-model={item.count} type="number" min={0} />
                    </a-col>
                  </a-row>
                  <a-wwitch v-model={item.infinite} /> 循环播放
                </>
              ),
            }}
          </a-alert>
        ))}
      </>
    );

    // 可添加的动画列表组件
    const AnimateList = () => (
      <a-tabs v-model={state.activeName}>
        {Object.entries(animationTabs).map(([tabKey, animationBox]) => (
          <a-tab-pane tab={animationTabs[tabKey].label} key={tabKey}>
            <a-row gutter={10}>
              {animationBox.value.map((animateItem) => (
                <a-col span={8} key={animateItem.value}>
                  <div
                    class={'animate-item'}
                    onClick={() => addOrChangeAnimate(animateItem)}
                    onMouseenter={() => runAnimation(animateItem)}
                  >
                    {animateItem.label}
                  </div>
                </a-col>
              ))}
            </a-row>
          </a-tab-pane>
        ))}
      </a-tabs>
    );

    return () => (
      <div ref={target} class={styles.animate}>
        <div v-show={!state.isAddAnimates}>
          <a-button
            type={'primary'}
            icon={PlusOutlined}
            disabled={!currentBlock.value.animations}
            onClick={() => (state.isAddAnimates = true)}
          >
            添加动画
          </a-button>
          <a-button
            type={'primary'}
            disabled={!currentBlock.value.animations?.length}
            icon={PlayCircleOutlined}
            onClick={() => runAnimation(currentBlock.value.animations)}
          >
            播放动画
          </a-button>
          <AddedAnimateList />
        </div>
        <AnimateList v-show={state.isAddAnimates} />
      </div>
    );
  },
});
