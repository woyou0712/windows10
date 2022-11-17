import createElement from "new-dream/src/utils/createElement"
import { Config } from "new-dream/src/Win/win"
import { winIcon } from "../svg/index"
import { UserInfo } from "../types/windows"
import TaskbarWinView from "./TaskbarWinView"
class TaskbarWin {
  public box: HTMLElement // 盒子
  public view: TaskbarWinView // 视图
  private icon: HTMLElement // 图标

  constructor() {
    this.box = createElement("windows10-taskbar-win");
    this.icon = createElement("windows10-taskbar-win-icon");
    this.view = new TaskbarWinView();
    this.__init__();
  }

  private __init__() {
    // 装载图标
    this.icon.innerHTML = winIcon;
    this.box.appendChild(this.icon);
    this.box.appendChild(this.view.box);
    // 监听事件
    // 点击切换显示win菜单
    this.icon.addEventListener("click", () => {
      this.view.box.classList.toggle("show");
    })
    this.box.setAttribute("tabindex", "0"); // 允许获得焦点
    // 失去焦点关闭win菜单
    this.box.addEventListener("blur", () => {
      this.view.box.classList.remove("show");
    })
  }


  /**
   * 设置用户信息
   */
  public setUserInfo(userInfo: UserInfo) {
    this.view.setUserInfo(userInfo)
    return this
  }

  public setAppData(appList: Config[]) {
    this.view.setAppData(appList)
    return this
  }



}

export default TaskbarWin