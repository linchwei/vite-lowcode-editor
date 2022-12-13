<script setup>
import Header from './components/header/index.vue';
import LeftAside from './components/left-aside/index.vue';
import RightAttributePanel from './components/right-attribute-panel/index.vue';
import SimulatorEditor from './components/simulator-editor/simulator-editor.vue';
</script>

<template>
  <a-layout class="lowcode">
    <a-layout-header>
      <Header />
    </a-layout-header>
    <a-layout class="lowcode-main">
      <a-layout-sider>
        <LeftAside />
      </a-layout-sider>
      <a-layout-content>
        <SimulatorEditor />
      </a-layout-content>
      <a-layout-sider>
        <RightAttributePanel />
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped>
.lowcode {
  height: 100%;

  :deep(.ant-layout-header) {
    background: #ffffff;
  }

  :deep(.ant-layout-sider) {
    background: #ffffff;
  }

  &-main {
    flex: 1;
  }
}
</style>
