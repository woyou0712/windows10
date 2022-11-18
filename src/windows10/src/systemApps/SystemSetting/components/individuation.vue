<template>
  <div class="windows10-system-set-individuation">
    <div class="system-set-individuation-title">个性化</div>
    <div class="system-set-individuation-content">
      <div class="set-individuation-content-item method">
        <div class="window10-desktop-mini" :style="miniDesktop"> </div>
      </div>
      <div class="set-individuation-content-item title">
        搜索框
      </div>
      <div class="set-individuation-content-item method">
        <select v-model="individuation.queryStatus" @change="onChange" class="windwos10-select">
          <option value="show">显示搜索框</option>
          <option value="none">隐藏搜索框</option>
        </select>
      </div>
      <div class="set-individuation-content-item title">
        任务栏背景颜色
      </div>
      <div class="set-individuation-content-item method">
        <input type="color" v-model="individuation.backgroundColor" class="windwos10-color-select" @input="onChange">
      </div>
      <div class="set-individuation-content-item title">
        字体颜色
      </div>
      <div class="set-individuation-content-item method">
        <input type="color" v-model="individuation.color" class="windwos10-color-select" @input="onChange">
      </div>
      <div class="set-individuation-content-item title">
        字体大小
      </div>
      <div class="set-individuation-content-item method">
        <select v-model="individuation.iconSize" @input="onChange">
          <option value="70px" label="大图标"></option>
          <option value="55px" label="中等图标"></option>
          <option value="40px" label="小图标"></option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { defaultOptions } from '../../../systemData';
export default {
  name: "SettingIndividuation",
  props: {
    data: {
      type: Object,
      default() {
        return defaultOptions.desktop.theme;
      }
    }
  },
  data() {
    return {
      individuation: defaultOptions.desktop.theme,
    }
  },
  computed: {
    miniDesktop() {
      const style = {};
      const background = this.individuation.background;
      if (background.type === "image") {
        style["backgroundImage"] = `url(${background.backgroundImage})`
        if (background.backgroundSize) {
          style["backgroundSize"] = background.backgroundSize
        }
        if (background.backgroundRepeat) {
          style["backgroundRepeat"] = background.backgroundRepeat
        }
        if (background.backgroundPosition) {
          style["backgroundPosition"] = background.backgroundPosition
        }
      } else if (background.type === "color") {
        style["backgroundColor"] = background.backgroundColor;
        style["backgroundImage"] = "none"
      } else {
        console.error("桌面背景配置项异常！")
      }

      return style
    }
  },
  mounted() {
    this.individuation = this.data;
    console.log(this.data)
  },
  methods: {
    onChange() {
      this.$emit("change", this.individuation)
    }
  }
}
</script>

<style lang="scss">
.windows10-system-set-individuation {
  width: 100%;
  height: 100%;
  & > .system-set-individuation-title {
    width: 100%;
    font-size: 26px;
    height: 80px;
    line-height: 80px;
  }

  & > .system-set-individuation-content {
    font-size: 16px;
    padding-left: 10px;

    & > .set-individuation-content-item {
      padding: 4px 0;
      font-size: 14px;

      &.method {
        margin-bottom: 10px;
      }
    }
  }
  .window10-desktop-mini {
    width: 450px;
    height: 300px;
  }
}
</style>