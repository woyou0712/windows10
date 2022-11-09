import createElement from "new-dream/src/utils/createElement"
import { winIcon } from "../svg/index"
class TaskbarWin {
  public box: HTMLElement // 盒子
  private icon: HTMLElement // 图标
  private view: HTMLElement // 视图
  private viewLeft: HTMLElement
  private viewConten: HTMLElement
  private viewRight: HTMLElement
  constructor() {
    this.box = createElement("windows10-taskbar-win");
    this.icon = createElement("windows10-taskbar-win-icon");
    this.view = createElement("windows10-taskbar-win-view");
    this.viewLeft = createElement("windows10-taskbar-win-view-left");
    this.viewConten = createElement("windows10-taskbar-win-view-content");
    this.viewRight = createElement("windows10-taskbar-win-view-right");
    this.__init__();


  }

  private __init__() {
    // 组装元素
    this.icon.innerHTML = winIcon;
    this.view.appendChild(this.viewLeft);
    this.view.appendChild(this.viewConten);
    this.view.appendChild(this.viewRight);
    this.box.appendChild(this.icon);
    this.box.appendChild(this.view);
    // 监听事件
    // 点击切换显示win菜单
    this.icon.addEventListener("click", () => {
      this.view.classList.toggle("show");
    })
    this.box.setAttribute("tabindex", "0"); // 允许获得焦点
    // 失去焦点关闭win菜单
    this.box.addEventListener("blur", () => {
      // this.view.classList.remove("show");
    })
  }

  private __init_view_left__() {
    // 
  }


}

export default TaskbarWin