<template>
  <div class="system-setting-summarize">
    <div class="summarize-title">Windows 设置</div>
    <div class="summarize-content">
      <div class="summarize-content-item" v-for="item in summarizeContent" :key="item.type" @click="selectItem(item)">
        <div class="summarize-content-item-icon" v-html="item.icon"></div>
        <div class="summarize-content-item-text">
          <div class="summarize-content-item-name" v-text="item.name"> </div>
          <div class="summarize-content-item-message" v-text="item.message"> </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { appIcon, indIcon, systemIcon } from '@/windows10/src/svg'
export default {
  name: "SystemSummarize",
  data() {
    return {
      summarizeContent: [
        {
          type: "system",
          name: "系统",
          icon: systemIcon,
          message: "显示、电源"
        },
        {
          type: "individuation",
          name: "个性化",
          icon: indIcon,
          message: "桌面、颜色、背景"
        },
        {
          type: "taskbar",
          name: "任务栏",
          icon: indIcon,
          message: "主题、方向、搜索框"
        },
        {
          type: "app",
          name: "应用",
          icon: appIcon,
          message: "卸载、默认应用"
        },
      ]
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("type-change", item.type)
    }
  }
}
</script>

<style lang="scss">
.system-setting-summarize {
  width: 100%;
  color: #444444;

  & > .summarize-title {
    width: 100%;
    font-size: 24px;
    line-height: 80px;
    text-align: center;
  }

  & > .summarize-content {
    width: 500px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: auto;

    & > .summarize-content-item {
      width: 240px;
      height: 88px;
      display: flex;
      border: 1px solid #fff;
      margin-bottom: 20px;
      transition: 1s;
      cursor: default;

      &:hover {
        border-color: #aaa;
      }

      & > .summarize-content-item-icon {
        width: 60px;
        height: 60px;
        padding: 15px;
        color: #0590fe;

        svg {
          width: 100%;
          height: 100%;
        }
      }

      & > .summarize-content-item-text {
        width: calc(100% - 60px);
        height: 100%;
        padding: 12px 0;

        & > .summarize-content-item-name {
          font-size: 14px;
        }

        & > .summarize-content-item-message {
          font-size: 13px;
          line-height: 26px;
          color: #888888;
        }
      }
    }
  }
}
</style>