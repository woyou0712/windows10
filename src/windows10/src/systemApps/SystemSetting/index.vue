<template>
  <div class="windows10-system-setting">
    <summarize v-if="type === 0" @type-change="typeChange" />
    <div class="windows10-system-setting-content" v-else>
      <taskbar v-if="type === 3" />
    </div>
  </div>
</template>

<script>
import { setIcon } from '../../svg';
import { defaultOptions } from '../../systemData'
import summarize from "./components/summarize.vue";
import taskbar from "./components/taskbar.vue";
export default {
  name: "SystemSetting",
  id: "windows10-system-setting",
  title: "设置",
  icon: setIcon,
  resize: true,
  miniBtn: true,
  maxBtn: true,
  components: { summarize, taskbar },
  props: {
    /** 当前显示的页面 */
    pageType: {
      type: Number,
      default() {
        return 0
      }
    },
    /**
     * 配置项默认数据
     */
    optionsData: {
      type: Object,
      default() {
        return defaultOptions
      }
    }
  },
  data() {
    return {
      type: 0,
      options: {}
    }
  },
  created() {
    this.type = this.pageType
    this.options = this.optionsData
  },
  methods: {
    typeChange(type) {
      this.type = type
    }
  }
}
</script>

<style lang="scss">

</style>