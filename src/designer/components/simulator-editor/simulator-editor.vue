<script lang="jsx" setup>
import { ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash-es';
import DraggableTransitionGroup from './draggable-transition-group.vue';
import CompRender from './comp-render';
import SlotItem from './slot-item.vue';
import { $$dropdown, DropdownOption } from './utils/dropdown-service';
import MonacoEditor from '../common/monaco-editor/MonacoEditor';
import { useGlobalProperties } from '@/hooks/useGlobalProperties';
import { generateNanoid } from '@/designer/utils';
import { useComponentStore } from "@/store/componentStore";

const { globalProperties } = useGlobalProperties();
const drag = ref(false);
const componentStore = useComponentStore();
const { components, currentComponent } = storeToRefs(componentStore);

//递归实现
//@leafId  为你要查找的id，
//@nodes   为原始Json数据
//@path    供递归使用，不要赋值
const findPathByLeafId = (leafId, nodes = [], path = []) => {
  for (let i = 0; i < nodes.length; i++) {
    const tmpPath = path.concat();
    tmpPath.push(nodes[i]);
    if (leafId == nodes[i]._vid) {
      return tmpPath;
    }
    const slots = nodes[i].props?.slots || {};
    const keys = Object.keys(slots);
    for (let j = 0; j < keys.length; j++) {
      const children = slots[keys[j]]?.children;
      if (children) {
        const findResult = findPathByLeafId(leafId, children, tmpPath);
        if (findResult) {
          return findResult;
        }
      }
    }
  }
};

// 给当前点击的组件设置聚焦
const handleSlotsFocus = (component, _vid) => {
  const slots = component.props?.slots || {};
  if (Object.keys(slots).length > 0) {
    Object.keys(slots).forEach((key) => {
      slots[key]?.children?.forEach((item) => {
        item.focusWithChild = false;
        item.focus = item._vid == _vid;
        if (item.focus) {
          const arr = findPathByLeafId(_vid, components);
          arr.forEach((n) => (n.focusWithChild = true));
        }
        if (Object.keys(item.props?.slots || {}).length) {
          handleSlotsFocus(item, _vid);
        }
      });
    });
  }
};

// 选择要操作的组件
const selectComp = (element) => {
  componentStore.setCurrentBlock(element);
  components.value.forEach((component) => {
    component.focus = element._vid == component._vid;
    component.focusWithChild = false;
    handleSlotsFocus(component, element._vid);
    element.focusWithChild = false;
  });
};

/**
 * 删除组件
 */
const deleteComp = (block, parentBlocks = components.value) => {
  console.log(block, 'block');
  const index = parentBlocks.findIndex((item) => item._vid == block._vid);
  if (index != -1) {
    delete globalProperties.$$refs[parentBlocks[index]._vid];
    const delTarget = parentBlocks.splice(index, 1)[0];
    if (delTarget.focus) {
      componentStore.setCurrentBlock({});
    }
  }
};

const onContextmenuBlock = (e, block, parentBlocks = components.value) => {
  $$dropdown({
    reference: e,
    content: () => (
      <>
        <DropdownOption
          label="复制节点"
          icon="el-icon-document-copy"
          {...{
            onClick: () => {
              const index = parentBlocks.findIndex((item) => item._vid == block._vid);
              if (index != -1) {
                const setBlockVid = (block) => {
                  block._vid = `vid_${generateNanoid()}`;
                  block.focus = false;
                  const slots = block?.props?.slots || {};
                  const slotKeys = Object.keys(slots);
                  if (slotKeys.length) {
                    slotKeys.forEach((slotKey) => {
                      slots[slotKey]?.children?.forEach((child) => setBlockVid(child));
                    });
                  }
                };
                const blockCopy = cloneDeep(parentBlocks[index]);
                setBlockVid(blockCopy);
                parentBlocks.splice(index + 1, 0, blockCopy);
              }
            },
          }}
        />
        <DropdownOption
          label="查看节点"
          icon="el-icon-view"
          {...{
            onClick: () =>
              useModal({
                title: '节点信息',
                footer: null,
                props: {
                  width: 600,
                },
                content: () => (
                  <MonacoEditor code={JSON.stringify(block)} layout={{ width: 530, height: 600 }} vid={block._vid} />
                ),
              }),
          }}
        />
        <DropdownOption
          label="删除节点"
          icon="el-icon-delete"
          {...{
            onClick: () => deleteComp(block, parentBlocks),
          }}
        />
      </>
    ),
  });
};
</script>

<template>
  <div class="simulator-container">
    <div class="simulator-editor">
      <div class="simulator-editor-content">
        <DraggableTransitionGroup
          v-model:drag="drag"
          v-model="components"
          class="!min-h-680px"
          draggable=".item-drag"
        >
          <template #item="{ element: outElement }">
            <div
              class="list-group-item"
              :data-label="outElement.label"
              :class="{
                focus: outElement.focus,
                focusWithChild: outElement.focusWithChild,
                drag,
                ['has-slot']: !!Object.keys(outElement.props.slots || {}).length,
              }"
              @contextmenu.stop.prevent="onContextmenuBlock($event, outElement)"
              @mousedown="selectComp(outElement)"
            >
              <comp-render
                :key="outElement._vid"
                :element="outElement"
                :style="{
                  pointerEvents: Object.keys(outElement.props?.slots || {}).length
                    ? 'auto'
                    : 'none',
                }"
              >
                <template
                  v-for="(value, slotKey) in outElement.props?.slots"
                  :key="slotKey"
                  #[slotKey]
                >
                  <SlotItem
                    v-model:children="value.children"
                    v-model:drag="drag"
                    :slot-key="slotKey"
                    :on-contextmenu-block="onContextmenuBlock"
                    :select-comp="selectComp"
                    :delete-comp="deleteComp"
                  />
                </template>
              </comp-render>
            </div>
          </template>
        </DraggableTransitionGroup>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './func.scss';

.simulator-container {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  @media (max-width: 1114px) {
    padding-right: 0;
  }
}

.simulator-editor {
  width: 100%;
  height: 100%;
  padding: 20px 24px 0;
  overflow: hidden auto;
  background: #fafafa;
  border-radius: 5px;
  box-sizing: border-box;
  background-clip: content-box;
  contain: layout;

  &::-webkit-scrollbar {
    width: 0;
  }

  &-content {
    height: 100%;
    transform: translate(0);
    box-shadow: 0 8px 12px #ebedf0;
  }
}

.list-group-item {
  position: relative;
  padding: 3px;
  cursor: move;

  >div {
    position: relative;
  }

  &.focus {
    @include showComponentBorder;
  }

  &.drag::after {
    display: none;
  }

  &:not(.has-slot) {
    content: '';
  }

  &.focusWithChild {
    @include showContainerBorder;
  }

  i {
    cursor: pointer;
  }
}
</style>