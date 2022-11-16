<template>
  <div class="windows10-system-set-taskbar">
    <div class="system-set-taskbar-left">

    </div>
    <div class="system-set-taskbar-right">
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
            <option value="none">隐藏</option>
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
  </div>
</template>

<script>
export default {
  name: "SettingTaskbar",
  props: {
    data: {
      type: Object,
      default() {
        return {
          theme: {
            backgroundColor: "#4444444",
            color: "#FFFFFF"
          },
          direaction: "bottom",
          queryStatus: "show"
        }
      }
    },
  },
  data() {
    return {
      taskbar: {
        theme: {
          backgroundColor: "#4444444",
          color: "#FFFFFF"
        },
        direaction: "bottom",
        queryStatus: "show"
      }
    }
  },
  mounted() {
    this.taskbar.theme = this.data.theme;
    this.taskbar.direaction = this.data.direaction;
    this.taskbar.queryStatus = this.data.queryStatus;
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
      this.$emit("change", opptionData)
    }
  }
}
</script>

<style lang="scss">
.windows10-system-set-taskbar {
  width: 100%;
  height: 100%;

  &>.system-set-taskbar-left {
    width: 240px;
    height: 100%;
  }

  &>.system-set-taskbar-right {
    width: calc(100% - 240px);
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
}
</style>