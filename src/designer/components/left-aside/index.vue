<script setup>
import { ref } from 'vue'
import components from './components'

defineOptions({
  name: 'LeftAside',
})
const tabs = Object.entries(components)
  .map(([name, component]) => {
    const { label, icon, order } = component
    return { label, icon, name, order, comp: component }
  })
  .sort((a, b) => a.order - b.order)
console.log('tabs=== ', tabs)
const activeName = ref(tabs[0].name)
</script>

<template>
  <a-tabs
    v-model="activeName"
    class="left-aside"
  >
    <a-tab-pane
      v-for="tabItem in tabs"
      :key="tabItem.name"
      :tab="tabItem.label"
    >
      <component
        :is="tabItem.comp"
        v-bind="$attrs"
      />
    </a-tab-pane>
  </a-tabs>
</template>

<style lang="scss" scoped>
.left-aside {
  height: 100%;
  contain: layout;
  > :deep(.el-tabs__header) {
    margin-right: 0;
    .el-tabs__item {
      height: 80px;
      padding: 20px 16px;
      .tab-item {
        display: flex;
        align-items: center;
        justify-content: center;
        [class^='el-icon-'] {
          font-size: 20px;
        }
      }
    }
  }
  > :deep(.el-tabs__content) {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
