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
    const windows = new Windows();
  },
});
</script>

<style lang="scss">
@import "./windows10/src/scss/index";
</style>
