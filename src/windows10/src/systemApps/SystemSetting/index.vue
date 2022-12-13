<template>
  <div class="windows10-system-setting">
    <summarize v-if="type === 'default'" @type-change="typeChange" />
    <div class="windows10-system-setting-content" v-else>
      <div class="system-set-taskbar-left">
        <div class="set-taskbar-left-head" @click="type = 'default'">
          <div class="set-taskbar-left-head-icon" v-html="homeIcon"></div>
          <div class="set-taskbar-left-head-name">主页</div>
        </div>
      </div>
      <div class="system-set-taskbar-right">
        <!-- 系统设置 -->
        <system v-if="type === 'system'" :data="data.desktop.theme" @change="individuationChange" />
        <!-- 个性化设置 -->
        <individuation v-if="type === 'individuation'" :data="data.desktop.theme" @change="individuationChange" />
        <!-- 任务栏设置 -->
        <taskbar v-if="type === 'taskbar'" :data="data.taskbar" @change="taskbarChange" />
        <!-- 应用设置 -->
        <app v-if="type === 'app'" :data="data.taskbar" @change="taskbarChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { setIcon, homeIcon } from "../../svg/index";
import { defaultOptions } from "../../defaultData";
import summarize from "./components/summarize.vue";

import system from "./components/system.vue";
import individuation from "./components/individuation.vue";
import taskbar from "./components/taskbar.vue";
import app from "./components/app.vue";
export default {
  name: "SystemSetting",
  id: "windows10-system-setting",
  title: "设置",
  icon: setIcon,
  resize: true,
  miniBtn: true,
  maxBtn: true,
  components: { summarize, system, individuation, taskbar, app },
  props: {
    /** 当前显示的页面 */
    pageType: {
      type: String,
      default() {
        return "default";
      },
    },
    /**
     * 配置项默认数据（任务栏）
     */
    options: {
      type: Object,
      default() {
        return defaultOptions;
      },
    },
    change: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      homeIcon,
      type: 0,
      data: defaultOptions,
    };
  },
  created() {
    this.type = this.pageType;
    this.data = this.options;
  },
  methods: {
    typeChange(type) {
      this.type = type;
    },
    taskbarChange(taskbarOption) {
      this.data.taskbar = taskbarOption;
      this.change(this.data);
    },
    individuationChange(individuationOption) {
      this.data.desktop.theme = individuationOption;
      this.change(this.data);
    },
  },
};
</script>

<style lang="scss">
.windows10-system-setting {
  width: 100%;
  height: 100%;
  & > .windows10-system-setting-content {
    width: 100%;
    height: 100%;
    display: flex;
    & > .system-set-taskbar-left {
      width: 240px;
      height: 100%;
      background-color: #eeeeee;
      & > .set-taskbar-left-head {
        width: 100%;
        height: 40px;
        line-height: 20px;
        font-size: 16px;
        padding: 10px;
        display: flex;
        color: #444444;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
          background-color: var(--hoverColor);
        }
        & > .set-taskbar-left-head-icon {
          width: 20px;
          height: 20px;
          margin-right: 5px;
          padding: 2px;
          svg {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    & > .system-set-taskbar-right {
      width: calc(100% - 240px);
      height: 100%;
      padding-left: 40px;
    }
  }
}
</style>