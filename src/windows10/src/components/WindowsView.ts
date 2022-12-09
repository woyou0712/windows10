import { Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { App, SettingOpenFn, UserInfo, WindowsOption } from "../types/windows";
import DesktopView from "./DesktopView/index";
import TaskbarView from "./TaskbarView/index";


export default class WindowsView {
  /** 系统盒子 */
  public appBox: HTMLElement;
  /** 桌面盒子 */
  private desktopEls: DesktopView;

  /** 任务栏盒子 */
  private taskbarEls: TaskbarView;
  /** 任务栏方向 */
  private direaction?: "bottom" | "top";
  /** 全部应用列表 */
  private appList: App[] = []
  /** 监听函数 */
  private methods: { [key: string]: any } = {
    onAppChange: (data: App[]) => { console.log("应用发送变化！") }
  }


  constructor() {
    this.appBox = createElement(["windows10-app", "bottom"])
    this.desktopEls = new DesktopView()
    this.taskbarEls = new TaskbarView()
    this.__init__();
  }

  private get __direaction() {
    return this.direaction
  }
  private set __direaction(v) {
    if (v && this.direaction !== v) {
      console.log("【任务栏方向】渲染")
      this.direaction = v;
      switch (v) {
        case "top":
          this.appBox.classList.add("top");
          this.appBox.classList.remove("bottom");
          break;
        default:
          this.appBox.classList.add("bottom");
          this.appBox.classList.remove("top");
          break;
      }

    }
  }

  private __init__() {
    this.appBox.appendChild(this.desktopEls.box);
    this.appBox.appendChild(this.taskbarEls.box);
  }



  /**
   * 通知任务栏应用打开
   * @param app 
   */
  public pushTaskbarOpenApp(app: Win) {
    this.taskbarEls.setOpenApp(app)
    return this
  }
  /**
   * 通知任务栏关闭APP
   * @param app 
   */
  public pushTaskbarCloseApp(appId: string) {
    this.taskbarEls.setCloseApp(appId)
    return this
  }
  /**
   * 设置用户信息
   * @param userInfo 
   */
  public setUserInfo(userInfo: UserInfo) {
    this.taskbarEls.setWinUserInfo(userInfo)
    return this
  }

  /**
   * 更新基础视图
   */
  public updateView(option: WindowsOption) {
    // 用户信息
    if (option.userInfo) {
      this.setUserInfo(option.userInfo)
    }
    // 任务栏
    if (option.taskbar) {
      const taskbar = option.taskbar
      this.__direaction = taskbar.direaction
      this.taskbarEls.updateView(taskbar)
    }
    // 更新桌面视图
    if (option.desktop) {
      this.desktopEls.updateView(option.desktop)
    }
    return this
  }
  /**
   * 更新应用视图
   */
  public updateAppView(appList: App[]) {
    this.appList = appList;
    // 桌面应用列表
    const desktopAppList = appList.filter(app => {
      // 过滤出桌面显示的应用列表
      if (app.desktopShow) {
        return Object.assign({}, app)
      }
    })
    // 设置应用快捷方式
    this.desktopEls.setAppShortcut(desktopAppList);
  }
  /**
   * 监听任务栏事件
   */
  public onTaskbarEvent({ onQuit, openSetting }: { onQuit: () => void; openSetting: SettingOpenFn }) {
    this.taskbarEls.onEvent({ onQuit, openSetting })
  }

  /**
   * 监听桌面事件
   */
  public onDesktopEvent({ openSetting }: { openSetting: SettingOpenFn; }) {
    this.desktopEls.onEvent({
      openSetting,
      onShortcutChange: (newAppList: App[]) => {
        console.log("监听到桌面快捷方式变化，更新应用列表")
        // 快捷方式改变，更新对应的APP
        this.appList.forEach(oldApp => {
          let desktopShow = false;
          for (let index = 0; index < newAppList.length; index++) {
            const newApp = newAppList[index];
            if (newApp.id === oldApp.id) {
              desktopShow = true;
              Object.assign(oldApp, newApp);
              break
            }
          }
          oldApp.desktopShow = desktopShow;
        })
        // 通知监听函数
        this.methods.onAppChange(this.appList);
      }
    })
  }

  /** 监听应用变更事件 */
  public onAppChange(fn: (data: App[]) => void) {
    this.methods.onAppChange = fn;
  }
}