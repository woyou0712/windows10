import "new-dream/dist/index.css";
import { Win } from "new-dream";
Win.showMiniList = false; // 关闭组件自带的最小化列表

import { WindowsOption, SettingPageType, App } from "./types/windows.d";
import { defaultAppList, defaultOptions } from "./defaultData";
import SystemSetting from "./systemApps/SystemSetting/index.vue";
import WindowsView from "./components/WindowsView";


export default class Windows {
  /** 监听任务变化(应用打开/关闭)   */
  static onTask: (data: { [key: string]: Win }) => void = () => null;

  public option: WindowsOption = defaultOptions;
  private appList: App[] = [];
  private els: WindowsView;
  private updateViewTime = 0;
  private updateAppViewTime = 0;
  /** 内部监听事件 */
  private methods = {
    onQuit: () => {/** 监听点击退出 */ },
    onOptionChange: (option: WindowsOption) => { console.log("配置项发生变化", option) },
    onAppChange: (data: App[]) => { console.log("应用数据发生变化", data) },
  }

  constructor(option?: WindowsOption, appList?: App[]) {
    this.els = new WindowsView();
    this.__option = option ? option : defaultOptions;
    this.__appList = appList ? appList : defaultAppList;
    /** 监听应用启动关闭  监听用户操作事件 */
    this.onAppOpenChange().onEvent(); // 
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
      console.log("set __option监听到赋值，通知更新视图");
      // 更新基础视图
      this.els.updateView(v);
      // 通知监听对象
      console.log("通知onOptionChange监听函数");
      this.methods.onOptionChange(v);
    }, 30)
  }

  private get __appList() {
    return this.appList
  }
  private set __appList(v) {
    this.appList = v;
    // 设置防抖
    clearTimeout(this.updateAppViewTime);
    this.updateAppViewTime = setTimeout(() => {
      console.log("set __appList监听到赋值，通知更新视图")
      // 更新 应用视图
      this.els.updateAppView(v);
      // 通知监听对象
      console.log("通知onAppChange监听函数");
      this.methods.onAppChange(v);
    }, 30)
  }
  /**
   * 监听应用启动/关闭
   */
  private onAppOpenChange() {
    const p: { [key: string | symbol]: Win } = {}
    // 代理Win窗口MAP对象
    Win.WinIdMap = new Proxy(p, {
      // 监听打开
      set: (target, key, app: Win) => {
        target[key] = app;
        Windows.onTask(target); // 通知监听函数
        // 顶级窗口通知任务栏生成任务图标
        if (!app.config.parentId) {
          this.els.pushTaskbarOpenApp(app);
        }
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
    // 监听桌面事件
    this.els.onDesktopEvent({
      openSetting: (type?: SettingPageType) => {
        this.openSetting(type)
      }
    })
    // 监听应用变化
    this.els.onAppChange((appList: App[]) => {
      console.log("app-list", appList)
      console.log("监听到应用数据有变化，重新为__appList赋值")
      this.__appList = appList;
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
   * 监听配置项变化
   */
  public onOptionChange(fn: (option: WindowsOption) => void) {
    this.methods.onOptionChange = fn;
    return this
  }
  /**
   * 监听应用数据变化
   */
  public onAppChange(fn: (data: App[]) => void) {
    this.methods.onAppChange = fn;
    return this
  }
}
