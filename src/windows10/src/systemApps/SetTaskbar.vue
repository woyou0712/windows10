<template>
  <div class="system-set-taskbar">
    <div class="system-set-taskbar-title">任务栏</div>
    <div class="system-set-taskbar-content">
      <div class="system-set-taskbar-content-item">锁定任务栏</div>
      <div class="system-set-taskbar-content-item">
        <WinSwitch v-model="test" />
      </div>
    </div>
  </div>
</template>

<script>
import { setIcon } from '../svg'
import WinSwitch from "./components/WinSwitch.vue"
export default {
  id: "system-set-taskbar",
  title: "设置",
  icon: setIcon,
  resize: true,
  miniBtn: true,
  maxBtn: true,
  width: "550px",
  components: { WinSwitch },
  data() {
    return {
      test: true
    }
  }
}
</script>

<style lang="scss">
.system-set-taskbar {
  width: 100%;
  height: 100%;
  padding: 0 20px;

  &>.system-set-taskbar-title {
    width: 100%;
    font-size: 26px;
    height: 70px;
    line-height: 70px;
  }
}
</style>