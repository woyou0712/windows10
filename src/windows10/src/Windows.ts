import "new-dream/dist/index.css";
import { Win } from "new-dream";
Win.showMiniList = false; // 关闭组件自带的最小化列表

import { WindowsOption, SettingPageType } from "./types/windows.d";
import { defaultOptions } from "./defaultData";
import SystemSetting from "./systemApps/SystemSetting/index.vue";
import WindowsEls from "./components/WindowsEls";


class Windows {
  /** 监听任务变化(应用打开/关闭)   */
  static onTask: (data: { [key: string]: Win }) => void = () => null;

  public option: WindowsOption = defaultOptions;
  private els: WindowsEls;
  private updateViewTime = 0;
  /** 内部监听事件 */
  private methods = {
    onQuit: () => {/** 监听点击退出 */ },
    onOptionChange: (option: WindowsOption) => { /** 监听配置项变化 */ }
  }

  constructor(option?: WindowsOption) {
    this.els = new WindowsEls();
    this.__option = option ? option : defaultOptions;
    /** 监听应用启动关闭  监听用户操作事件 */
    this.onAppChange().onEvent(); // 
    // 挂载到页面
    document.body.appendChild(this.els.appBox);
  }

  private get __option() {
    return this.option
  }
  private set __option(v) {
    this.option = v;
    // 设置防抖
    clearTimeout(this.updateViewTime);
    this.updateViewTime = setTimeout(() => {
      // 异步更新视图
      this.els.updateView(v); // 更新视图
      this.methods.onOptionChange(v)
    }, 20)
  }
  /**
   * 监听应用启动/关闭
   */
  private onAppChange() {
    const p: { [key: string | symbol]: Win } = {}
    // 代理Win窗口MAP对象
    Win.WinIdMap = new Proxy(p, {
      // 监听打开
      set: (target, key, app: Win) => {
        target[key] = app;
        Windows.onTask(target); // 通知监听函数
        // 通知任务栏
        this.els.pushTaskbarOpenApp(app);
        return true
      },
      // 监听关闭
      deleteProperty: (target, key) => {
        delete target[key];
        Windows.onTask(target); // 通知监听函数
        // 通知任务栏
        this.els.pushTaskbarCloseApp(key as string);
        return true
      }
    })
    return this
  }

  /**
   * 监听事件
   */
  private onEvent() {
    // 任务栏事件
    this.els.onTaskbarEvent({
      onQuit: () => this.methods.onQuit(),
      openSetting: (type?: SettingPageType) => {
        this.openSetting(type)
      }
    })
    return this
  }
  /**
   * 打开设置
   * @param pageType 默认显示页面
   */
  private openSetting(pageType: SettingPageType = "default") {
    new Win({
      component: SystemSetting,
      props: {
        pageType,
        option: this.__option,
        change: (option: WindowsOption) => {
          this.__option = option;
        }
      }
    })
    return this
  }
  /**
   * 监听用户点击退出系统按钮
   */
  public onQuit(fn: () => void) {
    this.methods.onQuit = fn
    return this
  }
  /**
   * 监听配置项改变
   */
  public onOptionChange(fn: (option: WindowsOption) => void) {
    this.methods.onOptionChange = fn;
    return this
  }
}

export default Windows