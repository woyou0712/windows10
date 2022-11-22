import { Menu, Message, MessageBox, Win } from "new-dream";
import { dirSvg, disSvg, indSvg } from "new-dream/src/svg/button";
import createElement from "new-dream/src/utils/createElement";
import { DesktopAppSize, DesktopBackground } from "../types/style.d";
import { App, DesktopAppOrder, DesktopOption } from "../types/windows.d";

/** 桌面APP列表 */
class DesktopAppEls {
  public box;
  /** 排序方式 */
  private order: DesktopAppOrder;
  /** 是否网格对齐 */
  private alignAuto: boolean;
  constructor() {
    this.box = createElement("windows10-desktop-app-box");
    this.alignAuto = true;
    this.order = "default";
  }
  /**
   * 在桌面添加应用
   */
  private appendApp(app: App) {
    const appBox = createElement("windows10-desktop-app-item");
    const icon = createElement("windows10-desktop-app-icon-box");
    if (typeof app.icon === "string") {
      icon.innerHTML = app.icon
    } else if (app.icon.nodeName) {
      icon.appendChild(app.icon)
    }
    const title = createElement("windows10-desktop-app-title");
    title.innerText = app.title;
    appBox.appendChild(icon);
    appBox.appendChild(title);
    this.box.appendChild(appBox);
  }

  /**
   * 清除桌面
   */
  private removeAll() {
    const appList = this.box.childNodes;
    for (let i = appList.length - 1; i >= 0; i--) {
      this.box.removeChild(appList[i])
    }
  }
  /** 设置应用图标位置 */
  private setAppPosition(appList: App[]) {
    // 
  }

  /** 设置APP列表 */
  public setAppList(appList: App[]) {
    // 清除之前的应用
    this.removeAll();
    // 重新加载应用
    appList.forEach(app => {
      this.appendApp(app)
    })
    return this
  }

  /** 设置桌面应用图标大小 */
  public setIconSize(size: DesktopAppSize) {
    this.box.className = `windows10-desktop-app-box app-${size}`
    return this
  }
  /** 设置桌面应用字体颜色 */
  public setTextColor(color: string) {
    this.box.style["color"] = color;
    return this
  }
  /** 设置自动对齐 */
  public setAlignAoto(alignAuto: boolean) {
    this.alignAuto = alignAuto;
    return this
  }
  /** 设置自动对齐 */
  public setOrder(order: DesktopAppOrder) {
    this.order = order;
    return this
  }
}


/** 桌面元素 */
export default class DesktopEls {
  public box = createElement("windows10-desktop");
  private background = createElement("windows10-desktop-background");
  private appList: DesktopAppEls;;
  constructor() {
    Win.defaultContentBox = this.box; // 将弹窗组件的顶级盒子设定为桌面
    Message.defaultContentBox = this.box; // 将消息提示框的默认盒子设定为桌面
    MessageBox.defaultContentBox = this.box;
    this.appList = new DesktopAppEls();
    this.box.appendChild(this.appList.box);
    this.box.appendChild(this.background);
    this.setRmenu();
  }
  /**
   * 设置右键菜单
   */
  private setRmenu() {
    const option = [
      {
        id: 1,
        name: "时间排序",
        method: function () {
          console.log("你点击了【时间排序】")
        }
      },
      {
        id: 2,
        name: "名称排序",
        method: function () {
          console.log("你点击了【名称排序】")
        }
      },
      {
        id: 3,
        name: "重载(F5)",
        method: function () {
          location.reload()
        }
      },
      {
        id: 4,
        icon: disSvg,
        name: "显示设置",
        method: function () {
          console.log("你点击了【显示设置】")
        }
      },
      {
        id: 4,
        icon: indSvg,
        name: "个性化",
        method: function () {
          console.log("你点击了【个性化】")
        }
      },
    ]
    new Menu(this.box, option)
  }
  /**
   * 设置背景
   */
  public setBackground(background: DesktopBackground) {
    if (background.type === "image") {
      this.background.style["backgroundImage"] = `url(${background.backgroundImage})`
      if (background.backgroundSize) {
        this.background.style["backgroundSize"] = background.backgroundSize
      }
      if (background.backgroundRepeat) {
        this.background.style["backgroundRepeat"] = background.backgroundRepeat
      }
      if (background.backgroundPosition) {
        this.background.style["backgroundPosition"] = background.backgroundPosition
      }
    } else if (background.type === "color") {
      this.background.style["backgroundColor"] = background.backgroundColor;
      this.background.style["backgroundImage"] = "none"
    } else {
      console.error("桌面背景配置项异常！")
    }
    return this
  }
  /**
   * 更新视图
   */
  public updateView(option: DesktopOption) {
    if (option.theme) {
      this.setBackground(option.theme.background);
      this.appList.setIconSize(option.theme.iconSize).setTextColor(option.theme.color).setAlignAoto(option.alignAuto).setOrder(option.order);
    }
  }
  /**
   * 设置桌面应用列表
   */
  public setAppList(appList: App[]) {
    this.appList.setAppList(appList)
  }
}