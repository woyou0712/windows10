<template>
  <div class="windows10-system-set-taskbar">
    <div class="system-set-taskbar-title">任务栏</div>
    <div class="system-set-taskbar-content">
      <div class="set-taskbar-content-item title">
        任务栏在屏幕上的位置
      </div>
      <div class="set-taskbar-content-item method">
        <select v-model="taskbar.direaction" @change="onChange" class="windwos10-select">
          <option value="top">顶部</option>
          <option value="bottom">底部</option>
        </select>
      </div>
      <div class="set-taskbar-content-item title">
        搜索框
      </div>
      <div class="set-taskbar-content-item method">
        <select v-model="taskbar.queryStatus" @change="onChange" class="windwos10-select">
          <option value="show">显示搜索框</option>
          <option value="none">隐藏搜索框</option>
        </select>
      </div>
      <div class="set-taskbar-content-item title">
        任务栏背景颜色
      </div>
      <div class="set-taskbar-content-item method">
        <input type="color" v-model="taskbar.theme.backgroundColor" class="windwos10-color-select" @input="onChange">
      </div>
      <div class="set-taskbar-content-item title">
        任务栏字体颜色
      </div>
      <div class="set-taskbar-content-item method">
        <input type="color" v-model="taskbar.theme.color" class="windwos10-color-select" @input="onChange">
      </div>
    </div>
  </div>

</template>

<script>
import { defaultOptions } from '../../../defaultData';

export default {
  name: "SettingTaskbar",
  props: {
    data: {
      type: Object,
      default() {
        return defaultOptions.taskbar
      }
    },
  },
  data() {
    return {
      taskbar: defaultOptions.taskbar,

    }
  },
  mounted() {
    this.taskbar = this.data;
  },
  methods: {
    onChange() {
      this.$emit("change", this.taskbar)
    }
  }
}
</script>

<style lang="scss">
.windows10-system-set-taskbar {
  width: 100%;
  height: 100%;
  & > .system-set-taskbar-title {
    width: 100%;
    font-size: 26px;
    height: 80px;
    line-height: 80px;
  }

  & > .system-set-taskbar-content {
    font-size: 16px;
    padding-left: 10px;

    & > .set-taskbar-content-item {
      padding: 4px 0;
      font-size: 14px;

      &.method {
        margin-bottom: 10px;
      }
    }
  }
}
</style>