<template>
  <div class="system-set-taskbar">
    <div class="system-set-taskbar-title">任务栏</div>
    <div class="system-set-taskbar-content">
      <WinFormItem label="背景颜色">
        <input type="color" v-model="taskbarTheme.backgroundColor" class="windwos10-color-select" @input="onChange">
      </WinFormItem>
      <WinFormItem label="字体颜色">
        <input type="color" v-model="taskbarTheme.color" class="windwos10-color-select" @input="onChange">
      </WinFormItem>
      <WinFormItem label="任务栏方向">
        <select v-model="taskbarDireaction" @change="onChange" class="windwos10-select">
          <option value="top">顶部</option>
          <option value="bottom">底部</option>
        </select>
      </WinFormItem>
      <WinFormItem label="搜索框">
        <select v-model="taskbarSelectDisplay" @change="onChange" class="windwos10-select">
          <option value="flex">显示</option>
          <option value="none">隐藏</option>
        </select>
      </WinFormItem>
    </div>
  </div>
</template>

<script>
import { setIcon } from '../svg';
import WinFormItem from "./components/FormItem.vue";
export default {
  id: "system-set-taskbar",
  title: "设置",
  icon: setIcon,
  resize: true,
  miniBtn: true,
  maxBtn: true,
  width: "520",
  height: "500px",
  components: { WinFormItem },
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
    selectDisplay: {
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
      taskbarSelectDisplay: "flex"
    }
  },
  mounted() {
    this.taskbarTheme = this.theme;
    this.taskbarDireaction = this.direaction;
    this.taskbarSelectDisplay = this.selectDisplay;
  },
  methods: {
    onChange() {
      const opptionData = {
        taskbar: {
          theme: this.taskbarTheme,
          direaction: this.taskbarDireaction,
          selectDisplay: this.taskbarSelectDisplay
        }
      }
      this.change(opptionData)
    }
  }
}
</script>

<style lang="scss">
.system-set-taskbar {
  width: 100%;
  height: 100%;
  padding: 0 20px;

  & > .system-set-taskbar-title {
    width: 100%;
    font-size: 26px;
    height: 70px;
    line-height: 70px;
  }
  & > .system-set-taskbar-content {
    font-size: 16px;
    padding-left: 10px;
  }
}
</style>