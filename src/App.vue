<template>
  <div id="app">

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Windows from "./windows10/src/Windows";
import axios from "axios";

export default Vue.extend({
  name: "App",
  mounted() {
    const windows = new Windows({
      taskbar: {
        theme: { backgroundColor: "#aa5500", color: "#ffffff" },
        direaction: "bottom",
        selectDisplay: "flex",
      },
    });
    windows.onOptionChange((data) => {
      console.log(data);
    });
  },
});
</script>

<style lang="scss">
@import "./windows10/src/scss/index";
</style>
