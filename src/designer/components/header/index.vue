<script setup>
import { ref } from 'vue'
import { useTools } from './hooks/useTools'
const tools = useTools()
</script>

<template>
  <a-row
    type="flex"
    class="header"
  >
    <a-col>
      <h3 class="header-title"> 低代码平台 </h3>
    </a-col>
    <a-col :flex="1">
      <div class="tool">
        <template
          v-for="(toolItem, toolIndex) in tools"
          :key="toolIndex"
        >
          <a-button
            type="link"
            @click="toolItem.onClick"
          > {{toolItem.title}} </a-button>
        </template>
      </div>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.header {
  &-title {
    color: #000000;
    font-size: 18px;
    font-weight: bold;
  }
  .tool {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 64px;
  }
}
</style>
