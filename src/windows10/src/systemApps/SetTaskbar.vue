<template>
  <div class="windows10-system-set-taskbar">
    <div class="system-set-taskbar-title">任务栏</div>
    <div class="system-set-taskbar-content">
      <div class="set-taskbar-content-item title">
        任务栏在屏幕上的位置
      </div>
      <div class="set-taskbar-content-item method">
        <select v-model="taskbarDireaction" @change="onChange" class="windwos10-select">
          <option value="top">顶部</option>
          <option value="bottom">底部</option>
        </select>
      </div>
      <div class="set-taskbar-content-item title">
        搜索框
      </div>
      <div class="set-taskbar-content-item method">
        <select v-model="TaskbarQueryStatus" @change="onChange" class="windwos10-select">
          <option value="show">显示搜索框</option>
          <option value="none">隐藏</option>
        </select>
      </div>
      <div class="set-taskbar-content-item title">
        任务栏背景颜色
      </div>
      <div class="set-taskbar-content-item method">
        <input type="color" v-model="taskbarTheme.backgroundColor" class="windwos10-color-select" @input="onChange">
      </div>
      <div class="set-taskbar-content-item title">
        任务栏字体颜色
      </div>
      <div class="set-taskbar-content-item method">
        <input type="color" v-model="taskbarTheme.color" class="windwos10-color-select" @input="onChange">
      </div>
    </div>
  </div>
</template>

<script>
import { setIcon } from '../svg';
export default {
  id: "system-set-taskbar",
  title: "设置",
  icon: setIcon,
  resize: true,
  miniBtn: true,
  maxBtn: true,
  width: "500px",
  height: "460px",
  props: {
    theme: {
      type: Object,
      default() {
        return {
          backgroundColor: "#4444444",
          color: "#FFFFFF"
        }
      }
    },
    direaction: {
      type: String,
      default() {
        return "button"
      }
    },
    queryStatus: {
      type: String,
      default() {
        return "flex"
      }
    },
    change: {
      type: Function,
      default() {
        return () => true
      }
    }
  },
  data() {
    return {
      taskbarTheme: {
        backgroundColor: "#4444444",
        color: "#FFFFFF"
      },
      taskbarDireaction: "bottom",
      TaskbarQueryStatus: "flex"
    }
  },
  mounted() {
    this.taskbarTheme = this.theme;
    this.taskbarDireaction = this.direaction;
    this.TaskbarQueryStatus = this.queryStatus;
  },
  methods: {
    onChange() {
      const opptionData = {
        taskbar: {
          theme: this.taskbarTheme,
          direaction: this.taskbarDireaction,
          queryStatus: this.TaskbarQueryStatus
        }
      }
      this.change(opptionData)
    }
  }
}
</script>

<style lang="scss">
.windows10-system-set-taskbar {
  width: 100%;
  height: 100%;
  padding: 0 40px;

  &>.system-set-taskbar-title {
    width: 100%;
    font-size: 26px;
    height: 80px;
    line-height: 80px;
  }

  &>.system-set-taskbar-content {
    font-size: 16px;
    padding-left: 10px;

    &>.set-taskbar-content-item {
      padding: 4px 0;
      font-size: 14px;

      &.method {
        margin-bottom: 10px;
      }
    }
  }
}
</style>