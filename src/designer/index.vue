<script setup>
import Header from './components/header/index.vue'
import LeftAside from './components/left-aside/index.vue'
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
      <a-layout-content>Content</a-layout-content>
      <a-layout-sider>Sider</a-layout-sider>
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
