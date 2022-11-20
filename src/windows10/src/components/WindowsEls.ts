import { Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { UserInfo } from "../types/windows";
import TaskbarEls from "./TaskbarEls";


/** 桌面元素 */
class DesktopEls {
  public box = createElement("windows10-desktop");
  public desktopBackground = createElement("windows10-desktop-background");
  constructor() {
    // pass
  }
}

export default class WindowsEls {
  /** 系统盒子 */
  private appBox: HTMLElement;
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
    document.body.appendChild(this.appBox);
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
}