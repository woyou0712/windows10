import "new-dream/dist/index.css";
import { Win } from "new-dream";
Win.showMiniList = false; // 关闭组件自带的最小化列表

import { WindowsOption, SettingPageType } from "./types/windows.d";
import { defaultOptions } from "./systemData";
import SystemSetting from "./systemApps/SystemSetting/index.vue";
import WindowsEls from "./components/WindowsEls";


class Windows {
  /** 监听任务变化(应用打开/关闭)   */
  static onTask: (data: { [key: string]: Win }) => void = () => null;

  public option: WindowsOption = defaultOptions;
  private els: WindowsEls;
  private updateViewTime = 0;

  constructor(option?: WindowsOption) {
    this.els = new WindowsEls();
    this.__option = option ? option : defaultOptions;
    this.onAppChange();
    this.onEvent();
  }

  private get __option() {
    return this.option
  }
  private set __option(v) {
    this.option = v;
    // 设置防抖
    clearTimeout(this.updateViewTime);
    this.updateViewTime = setTimeout(() => {
      this.els.updateView(v); // 更新视图
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
  }

  /**
   * 监听事件
   */
  private onEvent() {
    // 任务栏事件
    this.els.onTaskbarEvent({
      onQuit: () => { console.log("点击了退出") },
      openSetting: (type?: SettingPageType) => {
        this.openSetting(type)
      }
    })
  }
  /**
   * 打开设置
   * @param pageType 默认显示页面
   */
  public openSetting(pageType: SettingPageType = "default") {
    new Win({
      component: SystemSetting,
      props: {
        pageType,
        option: this.__option,
        change: (option: WindowsOption) => {
          console.log(option)
          this.__option = option;
        }
      }
    })
  }



}

export default Windows