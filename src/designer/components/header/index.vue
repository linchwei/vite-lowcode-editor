<script setup>
import { ref } from "vue";
defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <a-row type="flex" class="header">
    <a-col>
      <h3 class="header-title">lowcode</h3>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  &-title {
    color: #ffffff;
  }
}
</style>
