import createElement from "new-dream/src/utils/createElement";
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
}