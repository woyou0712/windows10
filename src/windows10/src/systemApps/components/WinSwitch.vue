<template>
  <div class="windows10-switch" :class="value ? 'on' : ''" @click="setChange">
    <div class="windows10-switch-core"></div>
  </div>
</template>

<script>
export default {
  name: "WinSwitch",
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  model: {
    prop: "value",
    event: "change",
  },
  methods: {
    setChange() {
      this.$emit("change", !this.value)
    }
  }
}
</script>

<style lang="scss">
.windows10-switch {
  width: 40px;
  height: 20px;
  padding: 2px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #666;
  position: relative;
  transition: 0.3s;

  &>.windows10-switch-core {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #666;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: 0.3s;
  }

  &.on {
    background: #409EFF;
    border-color: #409EFF;

    &>.windows10-switch-core {
      background-color: #fff;
      left: 22px;
    }
  }


}
</style>