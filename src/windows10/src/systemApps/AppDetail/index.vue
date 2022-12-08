<template>
  <div class="window10-app-detail">
    <div class="window10-app-detail-content">
      <div class="window10-app-detail-head">
        <div class="window10-app-detail-head-icon" v-html="option.icon"> </div>
        <div class="window10-app-detail-head-title">
          <input type="text" v-model="option.title" placeholder="应用名称">
        </div>
      </div>
      <div class="window10-app-detail-setting">
        <FormItem label="应用ID：">
          <span v-text="option.id"></span>
        </FormItem>
        <FormItem label="目标类型：">
          <span v-text="appType"></span>
        </FormItem>
        <FormItem label="应用图标：">
          <input type="text" v-model="option.icon">
        </FormItem>
        <!-- URL网页属性 -->
        <div v-if="appType === '外部链接' || appType === 'Iframe'">
          <FormItem label="运行方式：">
            <select v-model="option.externalWindow">
              <option :value="true">外部链接</option>
              <option :value="false">Iframe</option>
            </select>
          </FormItem>
          <FormItem label="目标：">
            <input type="text" v-model="option.url" placeholder="目标位置">
          </FormItem>
        </div>
        <!-- VUE组件属性 -->
        <div v-else>
          <FormItem label="组件代码：">
            <pre class="component" v-text="JSON.stringify(option.component)"></pre>
          </FormItem>
        </div>
        <!-- 公共属性 -->
        <div>
          <FormItem label="快捷方式：">
            <select v-model="option.desktopShow">
              <option :value="true">显示</option>
              <option :value="false">不显示</option>
            </select>
          </FormItem>
          <FormItem label="开始屏幕：">
            <select v-model="option.startScreenShow">
              <option :value="true">固定</option>
              <option :value="false">取消</option>
            </select>
          </FormItem>
          <FormItem label="备注：">
            <input type="text" v-text="option.remark">
          </FormItem>
          <FormItem label="最小化：">
            <select v-model="option.miniBtn">
              <option :value="true">开启</option>
              <option :value="false">关闭</option>
            </select>
          </FormItem>
          <FormItem label="最大化：">
            <select v-model="option.maxBtn">
              <option :value="true">开启</option>
              <option :value="false">关闭</option>
            </select>
          </FormItem>
          <FormItem label="缩放：">
            <select v-model="option.resize">
              <option :value="true">开启</option>
              <option :value="false">关闭</option>
            </select>
          </FormItem>
        </div>
      </div>
    </div>
    <div class="window10-app-detail-footer">
      <button @click="change(option)">确定</button>
      <button @click="close">取消</button>
    </div>
  </div>
</template>

<script>
import FormItem from "../components/FormItem.vue";
export default {
  components: { FormItem },
  name: "AppDetail",
  width: "420px",
  height: "680px",
  props: {
    data: {
      type: Object,
      required: true
    },
    change: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      option: {
        /** 唯一ID，传唯一ID应用只可开一个，不传唯一应用可以多开 */
        id: "",
        /** 窗口标题 */
        title: "",
        /** 窗口宽 */
        width: "",
        /** 窗口高 */
        height: "",
        /** 最小化按钮是否显示 */
        miniBtn: false,
        /** 最大化按钮是否显示 */
        maxBtn: false,
        /** 窗口是否可缩放 */
        resize: false,
        /** 图标 */
        icon: "",
        /** VUE组件所需的参数 */
        props: {},
        /** VUE组件 */
        component: null,
        /** 是否用外部窗口打开 */
        externalWindow: false,
        /** 网站URL地址 */
        url: "",
        /** 是否在桌面显示 */
        desktopShow: false,
        /** 桌面排序 */
        desktopIndex: 0,
        /** 在桌面上的位置X */
        desktopX: 0,
        /** 在桌面上的位置Y */
        desktopY: 0,
        /** 是否固定到开始屏幕 */
        startScreenShow: false,
        /** 开始屏幕排序 */
        startScreenIndex: 0,
      }
    }
  },
  computed: {
    appType() {
      return this.option.externalWindow && this.option.url ? "外部链接" : this.option.url ? "Iframe" : "VUE组件";
    }
  },
  mounted() {
    for (let key in this.option) {
      if (this.data[key]) {
        this.option[key] = this.data[key];
      }
    }
  },
  methods: {

  }

}
</script>

<style lang="scss">
.window10-app-detail {
  width: 100%;
  height: 100%;
  padding: 10px 10px 0 10px;
  background-color: #eeeeee;
  color: #444444;
  .window10-app-detail-content {
    width: 100%;
    height: calc(100% - 50px);
    background-color: #ffffff;
    padding: 0 10px;

    .window10-app-detail-head {
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid #cccccc;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .window10-app-detail-head-icon {
        width: 40px;
        height: 40px;
        svg,
        img {
          width: 100%;
          height: 100%;
        }
      }

      .window10-app-detail-head-title {
        width: calc(100% - 60px);
      }
    }
    .window10-app-detail-setting {
      padding: 10px 0;
    }
  }
  .window10-app-detail-footer {
    width: 100%;
    height: 50px;
    text-align: right;
    padding: 10px 0;
    button {
      height: 30px;
      padding: 0 20px;
      margin-left: 10px;
    }
  }

  input,
  select {
    width: 100%;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
  }
  .component {
    width: 100%;
    overflow: hidden;
  }
}
</style>