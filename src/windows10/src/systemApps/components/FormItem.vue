<template>
  <div class="windows10-form-item">
    <div class="windows10-form-item-label" :style="{width:labelWidth,'textAlign':labelAlign}"><span v-text="label"></span></div>
    <div class="windows10-form-item-data" :style="{width:`calc(100% - ${labelWidth})`}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "WinFormItem",
  props: {
    label: {
      type: String
    },
    labelWidth: {
      type: String,
      default() {
        return "80px"
      }
    },
    labelAlign: {
      type: String,
      default() {
        return "left"
      }
    }
  },
}
</script>

<style lang="scss">
.windows10-form-item {
  width: 100%;
  min-height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  .windows10-form-item-data {
    padding-left: 10px;
  }
}
</style>