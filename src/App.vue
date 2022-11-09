<template>
  <div id="app">

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Windows from "./windows10/src/Windows";

export default Vue.extend({
  name: "App",
  mounted() {
    const windows = new Windows();
    // setTimeout(() => {
    //   windows.setTaskbarTheme({ backgroundColor: "#f00", color: "#fff" });
    // }, 5000);
    // setTimeout(() => {
    //   windows.setTaskbarTheme({ backgroundColor: "#00f", color: "#fff" });
    // }, 10000);
  },
});
</script>

<style lang="scss">
@import "./windows10/src/scss/index";
</style>
