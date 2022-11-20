<template>
  <div class="windows10-system-set-individuation">
    <div class="system-set-individuation-title">个性化</div>
    <div class="system-set-individuation-content">
      <div class="set-individuation-content-item method">
        <div class="window10-desktop-mini" :style="miniDesktop"> </div>
      </div>
      <div class="set-individuation-content-item title">
        背景
      </div>
      <div class="set-individuation-content-item method">
        <select v-model="individuation.background.type" @change="onChange" class="windwos10-select">
          <option value="image">图片</option>
          <option value="color">纯色</option>
        </select>
      </div>
      <div class="set-individuation-content-item title">
        <span v-text="individuation.background.type === 'image'?'选择背景图片':'选择背景颜色'"></span>
      </div>
      <div class="set-individuation-content-item method">
        <div class="individuation-images" v-show="individuation.background.type === 'image'">
          <div class="individuation-image-item" v-for="(bg,index) in backgroundList" :key="index" :style="bgItemStyle(bg)" :class="individuation.background.backgroundImage === bg?'on':''" @click="setBackground(bg)"></div>
        </div>
        <input v-show="individuation.background.type === 'color'" type="color" v-model="individuation.background.backgroundColor" class="windwos10-color-select" @input="onChange">
      </div>
      <div class="set-individuation-content-item title">
        字体颜色
      </div>
      <div class="set-individuation-content-item method">
        <input type="color" v-model="individuation.color" class="windwos10-color-select" @input="onChange">
      </div>
      <div class="set-individuation-content-item title">
        图标大小
      </div>
      <div class="set-individuation-content-item method">
        <select v-model="individuation.iconSize" @input="onChange">
          <option value="max" label="大图标"></option>
          <option value="default" label="中等图标"></option>
          <option value="mini" label="小图标"></option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { defaultOptions } from '../../../systemData';
import { desktopImage0, desktopImage1, desktopImage2 } from "../../../images/index";
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
    backgroundList() {
      return [desktopImage0, desktopImage1, desktopImage2].concat(this.individuation.backgroundList)
    },
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
  watch: {
    "individuation.background.type"(v) {
      if (v === "color" && !this.individuation.background.backgroundColor) {
        this.individuation.background.backgroundColor = "#808080"
      }
    }
  },
  mounted() {
    this.individuation = this.data;
  },
  methods: {
    // 监听配置项变化
    onChange() {
      this.$emit("change", this.individuation)
    },
    // 改变背景图片
    setBackground(bg) {
      this.individuation.background.backgroundImage = bg;
      this.onChange();
    },
    bgItemStyle(bg) {
      const style = {}
      style["backgroundImage"] = `url(${bg})`
      style["backgroundSize"] = "100% auto"
      return style
    }
  }
}
</script>

<style lang="scss">
.windows10-system-set-individuation {
  width: 100%;
  height: 100%;
  overflow-y: auto;
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
      & > .individuation-images {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        & > .individuation-image-item {
          width: 90px;
          height: 50px;
          margin: 0 5px 5px 0;
          border: var(--border);
          &.on {
            border-color: var(--selectBorderColor);
            box-shadow: var(--boxShadow);
          }
        }
      }
    }
  }
  .window10-desktop-mini {
    width: 450px;
    height: 250px;
    border: var(--border);
  }
}
</style>