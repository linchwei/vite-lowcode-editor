<script setup>
import { reactive, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { AttrEditor, Animate, EventAction, FormRule } from './components';
import { useComponentStore } from "@/store/componentStore";

defineOptions({ name: 'RightAttributePanel' });

const componentStore = useComponentStore();
const { currentComponent } = storeToRefs(componentStore);
const state = reactive({ activeName: 'attr', isOpen: true });
watch(
  () => currentComponent.value.label,
  (newLabel) => {
    if (!newLabel?.startsWith('表单') && state.activeName == 'form-rule') {
      state.activeName = 'attr';
    }
  },
);
</script>

<template>
  <!-- <div
    class="drawer"
    :class="{ 'isOpen': state.isOpen }"
  > -->
  <!-- <div
      class="floating-action-btn"
      @click="state.isOpen = !state.isOpen"
    >
      <RightOutlined v-if="state.isOpen" />
      <LeftOutlined v-else />
    </div> -->
  <a-tabs
    v-model="state.activeName"
    type="border-card"
    class="tabs"
  >
    <a-tab-pane
      tab="属性"
      key="attr"
    >
      <AttrEditor />
    </a-tab-pane>
    <a-tab-pane
      tab="动画"
      key="animate"
    >
      <Animate />
    </a-tab-pane>
    <a-tab-pane
      tab="事件"
      key="events"
    >
      <EventAction />
    </a-tab-pane>
    <a-tab-pane
      v-if="currentComponent.value?.label?.startsWith('表单')"
      tab="规则"
      key="form-rule"
    >
      <FormRule />
    </a-tab-pane>
  </a-tabs>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
$boxShadow: -2px 0 4px 0 rgb(0 0 0 / 10%);

.drawer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  width: 390px;
  background-color: white;
  transform: translateX(100%);
  box-shadow: $boxShadow;
  transition: transform 0.5s ease-in-out;
  contain: layout;

  &.is-open {
    transform: translateX(0);
  }
}

.floating-action-btn {
  position: absolute;
  top: 50%;
  left: 0;
  display: flex;
  width: 20px;
  height: 80px;
  cursor: pointer;
  background: #fff;
  transform: translateX(-20px);
  box-shadow: $boxShadow;
  transition: transform 0.5s ease-in-out;
  justify-content: center;
  align-items: center;
}

.attrs {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  background-color: white;

  .tabs {
    height: 100%;

    .el-tabs__content {
      height: 100%;
      padding-bottom: 50px;
      overflow-y: auto;
    }

    .el-form-item__label {
      font-size: 12px;
    }

    .el-form-item .el-form-item__content {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
