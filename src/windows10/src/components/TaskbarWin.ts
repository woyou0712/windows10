import { Win } from "new-dream"
import createElement from "new-dream/src/utils/createElement"
import { Config } from "new-dream/src/Win/win"
import { quitIcon, setIcon, userIcon, winIcon } from "../svg/index"
class TaskbarWin {
  public box: HTMLElement // 盒子
  private icon: HTMLElement // 图标
  private view: HTMLElement // 视图
  // 左侧小菜单
  private viewLeft: HTMLElement
  private leftContent: HTMLElement
  private userInfo: HTMLElement
  private userIcons: HTMLElement
  private userName: HTMLElement
  private setter: HTMLElement
  private setIcons: HTMLElement
  private setName: HTMLElement
  private quit: HTMLElement
  private quitIcons: HTMLElement
  private quitName: HTMLElement
  // 中间区域的应用列表
  private viewConten: HTMLElement
  // 右侧开始屏幕
  private viewRight: HTMLElement

  constructor() {
    this.box = createElement("windows10-taskbar-win");
    this.icon = createElement("windows10-taskbar-win-icon");
    this.view = createElement("windows10-taskbar-win-view");
    // 左侧小菜单
    this.viewLeft = createElement("windows10-taskbar-win-view-left");
    this.leftContent = createElement("win-view-left-content");
    this.userInfo = createElement("win-view-left-content-item");
    this.userIcons = createElement("win-view-left-content-item-icon");
    this.userName = createElement("win-view-left-content-item-name");
    this.setter = createElement("win-view-left-content-item");
    this.setIcons = createElement("win-view-left-content-item-icon");
    this.setName = createElement("win-view-left-content-item-name");
    this.quit = createElement("win-view-left-content-item");
    this.quitIcons = createElement("win-view-left-content-item-icon");
    this.quitName = createElement("win-view-left-content-item-name");

    this.viewConten = createElement("windows10-taskbar-win-view-content");
    this.viewRight = createElement("windows10-taskbar-win-view-right");
    this.__init__();


  }

  private __init__() {
    // 装载图标
    this.icon.innerHTML = winIcon;
    this.userIcons.innerHTML = userIcon;
    this.setIcons.innerHTML = setIcon;
    this.quitIcons.innerHTML = quitIcon;
    // 装载文字
    this.userName.innerText = "用户"
    this.setName.innerText = "设置"
    this.quitName.innerText = "退出"

    // 组装左侧小菜单
    this.userInfo.appendChild(this.userIcons);
    this.userInfo.appendChild(this.userName);
    this.leftContent.appendChild(this.userInfo);
    this.setter.appendChild(this.setIcons);
    this.setter.appendChild(this.setName);
    this.leftContent.appendChild(this.setter);
    this.quit.appendChild(this.quitIcons);
    this.quit.appendChild(this.quitName);
    this.leftContent.appendChild(this.quit);
    this.viewLeft.appendChild(this.leftContent);

    // 组装大盒子
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
  /**
   * 设置用户信息
   * @param userName 用户名
   * @param icon 头像图标（可以是<img />元素或者是svg字符串）
   */
  public setUser(userName: string, icon?: HTMLImageElement | string) {
    this.userName.innerText = userName;
    if (icon) {
      if (typeof icon === "string") this.userIcons.innerHTML = icon
      else if (icon.nodeName) this.userIcons.appendChild(icon)
    }
  }

  private setApp(app: Config) {
    const item = createElement("win-view-content-item");
    const icon = createElement("win-view-content-icon");
    if (app.icon) {
      if (typeof app.icon === "string") icon.innerHTML = app.icon;
      else if (app.icon.nodeName) icon.appendChild(app.icon);
    }
    const name = createElement("win-view-content-name");
    name.innerText = app.title ? app.title : "应用";
    item.appendChild(icon);
    item.appendChild(name);
    this.viewConten.appendChild(item);
    return item
  }
  public setAppData(appList: Config[]) {
    appList.forEach(app => {
      this.setApp(app).addEventListener("click", () => {
        new Win(app)
      })
    })
  }



}

export default TaskbarWin