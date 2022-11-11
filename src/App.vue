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
    const windows = new Windows(
    //   {
    //   userInfo: {
    //     nickName: "小妖",
    //   },
    //   taskbar: {
    //     theme: { backgroundColor: "#aa5500", color: "#ffffff" },
    //     direaction: "bottom",
    //     queryStatus: "show",
    //   },
    //   desktop: {
    //     theme: {
    //       background: {
    //         type: "image",
    //         backgroundImage:
    //           "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F5%2F578df8f2cd4dc.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670735127&t=13363bdea72aba4b2558b34e91031b4f",
    //         backgroundSize: "100% 100%",
    //       },
    //       color: "#ffffff",
    //       fontSize: "14px",
    //     },
    //   },
    // }
    );
    windows.onOptionChange((data) => {
      console.log(data);
    });
  },
});
</script>

<style lang="scss">
@import "./windows10/src/scss/index";
</style>
