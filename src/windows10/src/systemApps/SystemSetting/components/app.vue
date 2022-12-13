<template>
  <div class="windows10-system-set-app">
    <div class="system-set-app-title">应用</div>
    <p>开发中，敬请期待。。。</p>
  </div>
</template>

<script>

export default {
  name: "SettingSetApp",
};
</script>

<style lang="scss">
.windows10-system-set-app {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  & > .system-set-app-title {
    width: 100%;
    font-size: 26px;
    height: 80px;
    line-height: 80px;
  }
}
</style>