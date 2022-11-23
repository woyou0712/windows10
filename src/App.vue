<template>
  <div id="app"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { App, WindowsOption } from "./windows10/src/types/windows";
import Windows from "./windows10/src/Windows";

export default Vue.extend({
  name: "App",
  mounted() {
    const windows = new Windows();
    windows
      .onQuit(() => {
        console.log("点了退出？");
      })
      .onOptionChange((option: WindowsOption) => {
        console.log("监听到配置项数据变化了", option);
      })
      .onAppChange((appList: App[]) => {
        console.log("监听到应用数据变化了", appList);
      });
  },
});
</script>

<style lang="scss">
@import "./windows10/src/scss/index";
</style>
