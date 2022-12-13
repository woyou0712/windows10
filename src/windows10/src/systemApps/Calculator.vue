<template>
  <div class="windows10-calculator">
    <div class="calculator-view">这是一个还没完成的VUE组件</div>
    <div class="calculator-keys"></div>
  </div>
</template>

<script>
export default {
  name: "SyetemCalculator",
  width: "320px",
  height: "500px",
  data() {
    return {
      keys: [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["0", "."],
      ],
      tags: ["+", "-", "×", "÷"],
    };
  },
  methods: {
    test(){
      console.log("???????????????")
    }
  }
};
</script>

<style>
</style>