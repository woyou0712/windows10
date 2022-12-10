import { Menu } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { winIcon, quitIcon, setIcon, userIcon, chromeIcon } from "../../svg";
import { App, UserInfo } from "../../types/windows";
import openApp from "../../utils/openApp";

/** Win菜单应用 */
interface WinApp extends App {
  winAppEl: WinAppEl
}

class WinAppEl {
  public box: HTMLElement;
  private iconEl: HTMLElement;
  private titleEl: HTMLElement;
  private icon?: string | HTMLImageElement;
  private title?: string;
  constructor(app: App) {
    this.box = createElement("windows10-taskbar-win-view-content-app-item");
    this.box.setAttribute("app-id", app.id);
    this.iconEl = createElement("windows10-taskbar-win-view-content-app-icon");
    this.titleEl = createElement("windows10-taskbar-win-view-content-app-title");
    this.box.appendChild(this.iconEl);
    this.box.appendChild(this.titleEl);
    this.setIcon(app.icon);
    this.setTitle(app.title);
  }

  private set __icon(v: string | HTMLImageElement) {
    if (v !== this.icon) {
      this.icon = v;
      if (typeof v === "string") {
        this.iconEl.innerHTML = v;
      } else if (v.nodeName) {
        this.iconEl.appendChild(v);
      } else {
        this.iconEl.innerHTML = chromeIcon;
      }
    }
  }

  private set __title(v: string) {
    if (v !== this.title) {
      this.title = v
      this.titleEl.innerText = v;
    }
  }

  public setIcon(icon: string | HTMLImageElement) {
    this.__icon = icon
    return this
  }

  public setTitle(title: string) {
    this.__title = title;
    return this
  }

}

/** Win菜单元素 */
export default class TaskbarWinEls {
  public winBox = createElement("windows10-taskbar-win");
  public winIcon = createElement("windows10-taskbar-win-icon");
  /** Win菜单 */
  public viewBox = createElement("windows10-taskbar-win-view");;
  // 左侧小菜单
  public viewLeft = createElement("windows10-taskbar-win-view-left");
  public leftContent = createElement("win-view-left-content");
  public userInfo = createElement("win-view-left-content-item");
  public userIcons = createElement("win-view-left-content-item-icon");
  public userName = createElement("win-view-left-content-item-name");
  public setter = createElement("win-view-left-content-item");
  public setIcons = createElement("win-view-left-content-item-icon");
  public setName = createElement("win-view-left-content-item-name");
  public quit = createElement("win-view-left-content-item");
  public quitIcons = createElement("win-view-left-content-item-icon");
  public quitName = createElement("win-view-left-content-item-name");
  // 中间区域的应用列表
  public viewConten = createElement("windows10-taskbar-win-view-content");
  // 右侧开始屏幕
  public viewRight = createElement("windows10-taskbar-win-view-right");

  private nickName?: string
  private avatarType?: "svg" | "image";
  private avatar?: string;
  constructor() {
    // 装载用户信息
    this.__avatar = userIcon;
    this.__nickName = "用户"
    // 设置图文
    this.setIcons.innerHTML = setIcon;
    this.setName.innerText = "设置"
    // 退出图文
    this.quitIcons.innerHTML = quitIcon;
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
    this.viewBox.appendChild(this.viewLeft);
    this.viewBox.appendChild(this.viewConten);
    this.viewBox.appendChild(this.viewRight);
    // 将窗口装入到WIN盒子中
    this.winIcon.innerHTML = winIcon;
    this.winBox.appendChild(this.winIcon);
    this.winBox.appendChild(this.viewBox);
    // 监听事件
    // 点击切换显示win菜单
    this.winIcon.addEventListener("click", () => {
      this.viewBox.classList.toggle("show");
    })
    this.winBox.setAttribute("tabindex", "0"); // 允许获得焦点
    // 失去焦点关闭win菜单
    this.winBox.addEventListener("blur", () => {
      this.viewBox.classList.remove("show");
    })
  }

  private get __nickName() {
    return this.nickName
  }
  private set __nickName(v) {
    if (v && v !== this.nickName) {
      this.userName.innerText = v;
      this.nickName = v
    }
  }

  private get __avatar() {
    return this.avatar
  }
  private set __avatar(v) {
    if (v && v !== this.avatar) {
      // 如果头像类型是图片
      if (this.avatarType === "image") {
        let avatar = document.getElementById("windows10-taskbar-avatar") as HTMLImageElement;
        if (!avatar) {
          avatar = createElement({ name: "img", id: 'windows10-taskbar-avatar' }) as HTMLImageElement;
          this.userIcons.appendChild(avatar)
        }
        if (v && v !== this.avatar) {
          avatar.setAttribute("src", v)
        }
      } else {
        // 否则按SVG处理
        if (v && v !== this.avatar) {
          this.userIcons.innerHTML = v
        }
      }
      this.avatar = v
    }
  }

  /**
   * 设置应用列表右键菜单
   */
  private setAppListMenu(winAppList: WinApp[]) {
    new Menu(winAppList.map(winapp => winapp.winAppEl.box), [
      {
        id: 1,
        name: "打开",
        method: (el) => {
          const appId = el?.getAttribute("app-id");
          if (appId) {
            for (const app of winAppList) {
              if (app.id === appId) {
                openApp(app);
                return
              }
            }
          }
        }
      },
      {
        id: 2,
        name: "卸载",
        method: (el) => {
          const appId = el?.getAttribute("app-id");
          if (appId) {
            for (const app of winAppList) {
              if (app.id === appId) {
                console.log("卸载应用", app)
                return
              }
            }
          }
        }
      },
    ])
  }


  /**
   * 渲染用户信息
   */
  public renderUserInfo(userInfo: UserInfo) {
    this.__nickName = userInfo.nickName
    this.avatarType = userInfo.avatarType
    this.__avatar = userInfo.avatar
    return this
  }

  /**
   * 渲染应用列表
   */
  public renderAppList(appList: App[]) {
    // 清空之前的应用列表
    this.viewConten.innerHTML = "";
    const winAppList: WinApp[] = [];
    appList.forEach(app => {
      const winApp: WinApp = Object.assign({ winAppEl: (app as WinApp).winAppEl }, app)
      if (!winApp.winAppEl) {
        winApp.winAppEl = new WinAppEl(app);
      }
      winApp.winAppEl.setIcon(app.icon).setTitle(app.title);
      this.viewConten.appendChild(winApp.winAppEl.box);
      winAppList.push(winApp);
    })
    this.setAppListMenu(winAppList);
    return this
  }



}