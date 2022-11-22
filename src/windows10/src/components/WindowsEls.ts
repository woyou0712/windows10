import { Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { SettingPageType, UserInfo, WindowsOption } from "../types/windows";
import DesktopEls from "./desktopEls";
import TaskbarEls from "./TaskbarEls";


export default class WindowsEls {
  /** 系统盒子 */
  public appBox: HTMLElement;
  /** 桌面盒子 */
  private desktopEls: DesktopEls;

  /** 任务栏盒子 */
  private taskbarEls: TaskbarEls;

  constructor() {
    this.appBox = createElement(["windows10-app", "bottom"])
    this.desktopEls = new DesktopEls()
    this.taskbarEls = new TaskbarEls()
    this.__init__();
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
   * 根据配置项更新任务栏视图
   */
  public updateView(option: WindowsOption) {
    // 用户信息
    if (option.userInfo) {
      this.setUserInfo(option.userInfo)
    }
    // 任务栏配置项
    if (option.taskbar) {
      const taskbar = option.taskbar
      this.taskbarEls.updateView(taskbar)
      if (taskbar.direaction) {
        switch (taskbar.direaction) {
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
    // 桌面设置
    if (option.desktop) {
      this.desktopEls.updateView(option.desktop)
    }



  }

  /**
   * 监听任务栏事件
   */
  public onTaskbarEvent({ onQuit, openSetting }: { onQuit: () => void; openSetting: (type?: SettingPageType) => void }) {
    this.taskbarEls.onEvent({ onQuit, openSetting })
  }

}