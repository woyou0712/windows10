<template>
  <div class="windows10-system-task-manager">
    <div class="system-task-manager-content">
      <div class="system-task-manager-content-item" tabindex v-for="(app, index) in openAppList" :key="app.id"
        @click="selectIndex = index" :class="selectIndex === index ? 'select' : ''">
        <div class="system-task-manager-content-ite-icon" v-html="app.config.icon"> </div>
        <div class="system-task-manager-content-ite-name" v-html="app.config.title"> </div>
      </div>
    </div>
    <div class="system-task-manager-footer">
      <button :disabled="!selectIndex && selectIndex !== 0" @click="close">结束任务</button>
    </div>
  </div>
</template>

<script>
import { Win } from 'new-dream';
import Windows from "../Windows";
import { taskIcon } from '../svg';
export default {
  id: "system-task-manager",
  title: "任务管理器",
  icon: taskIcon,
  resize: true,
  miniBtn: true,
  maxBtn: true,
  width: "350px",
  height: "350px",
  data() {
    return {
      openAppList: [],
      selectIndex: null,
    }
  },
  created() {
    // 查找到所有打开的应用
    for (let key in Win.WinIdMap) {
      const app = Win.WinIdMap[key]
      this.openAppList.push(app)
    }
    // 监听任务变化
    Windows.onTask((data) => {
      this.openAppList = [];
      for (let key in data) {
        const app = data[key]
        this.openAppList.push(app)
      }
    });
  },
  methods: {
    // 关闭应用
    close() {
      const app = this.openAppList[this.selectIndex];
      app.close()
    }
  }
};
</script>

<style lang="scss">
.windows10-system-task-manager {
  width: 100%;
  height: 100%;
  padding: 5px 0;

  &>.system-task-manager-content {
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: auto;

    &>.system-task-manager-content-item {
      width: 100%;
      height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
      padding: 0 5px;

      &:hover {
        background-color: rgba(98, 153, 243, 0.1);
      }

      &.select {
        background-color: rgba(98, 153, 243, 0.2);
      }

      &>.system-task-manager-content-ite-icon {
        width: 30px;
        height: 30px;
        padding: 5px;

        &>svg,
        &>img {
          width: 100%;
          height: 100%;
        }

      }

      &>.system-task-manager-content-ite-name {
        font-size: 12px;
      }
    }
  }

  &>.system-task-manager-footer {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: right;
    padding: 0 20px;
  }
}
</style>