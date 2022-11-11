<script setup>
import Header from "./components/header/index.vue";
import { ref } from "vue";

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <a-layout class="lowcode">
    <a-layout-header>
      <Header />
    </a-layout-header>
    <a-layout class="lowcode-main">
      <a-layout-sider>Sider</a-layout-sider>
      <a-layout-content>Content</a-layout-content>
      <a-layout-sider>Sider</a-layout-sider>
    </a-layout>
  </a-layout>
</template>

<style lang="scss">
.lowcode {
  height: 100%;
  &-main {
    flex: 1;
  }
}
</style>
