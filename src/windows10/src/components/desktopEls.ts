import { Menu, Message, MessageBox, Win } from "new-dream";
import { dirSvg, disSvg, indSvg } from "new-dream/src/svg/button";
import createElement from "new-dream/src/utils/createElement";
import { appIcon } from "../svg";
import { DesktopAppSize, DesktopBackground } from "../types/style.d";
import { App, DesktopAppOrder, DesktopOption } from "../types/windows.d";

/** 桌面APP列表 */
class DesktopAppEls {
  public box;
  /** 桌面图标列表 */
  private appIcons: HTMLElement[] = [];
  /** 是否网格对齐 */
  private alignAuto: boolean;
  /** 应用图标大小 */
  private shortcutSize: DesktopAppSize = "default";
  private shortcutWidth = 76;
  private shortcutHeight = 90;
  private shortcutPadding = "4px 12px";

  constructor() {
    this.box = createElement("windows10-desktop-app-box");
    this.alignAuto = true;
    this.updateIconSize(this.shortcutSize);
  }

  private get __shortcutSize() {
    return this.shortcutSize
  }
  private set __shortcutSize(v) {
    if (v !== this.shortcutSize) {
      this.updateIconSize(v)
    }
    this.shortcutSize = v
  }

  private updateIconSize(size: DesktopAppSize) {
    const styleId = "style-desktop-shortcut-size";
    switch (size) {
      case "max":
        this.shortcutHeight = 100
        this.shortcutPadding = "4px"
        break;
      case "mini":
        this.shortcutHeight = 76
        this.shortcutPadding = "4px 18px"
        break;
      default:
        this.shortcutHeight = 90
        this.shortcutPadding = "4px 12px"
    }

    // 更新视图
    let style = document.getElementById(styleId);
    if (!style) {
      // 如果没有主题样式，则创建
      style = createElement({ name: "style", id: styleId });
      document.head.appendChild(style);
    }
    style.innerHTML = `
                :root{
                  --shortcutWidth: ${this.shortcutWidth}px !important;
                  --shortcutHeight: ${this.shortcutHeight}px !important;
                  --shortcutPadding: ${this.shortcutPadding} !important;
                }
              `;
  }
  /**
   * 清除桌面应用
   */
  private removeAll() {
    for (let i = this.appIcons.length - 1; i >= 0; i--) {
      this.box.removeChild(this.appIcons[i]); // 移除视图元素
      this.appIcons.splice(i, 1); // 移除储存对象
    }
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
    this.appIcons.push(appBox);
  }

  /** 设置快捷方式位置 */
  private setShortcutPosition(appList: App[]) {
    // 获取桌面大小
    const vw = this.box.offsetWidth, vh = this.box.offsetWidth;
    // 切割桌面
    // 如果是自动对齐
    if (this.alignAuto) {
      // 
    }
  }
  /** 渲染应用快捷方式 */
  public renderAppShortcut(appList: App[]) {
    // 清除之前的应用
    this.removeAll();
    // 设置快捷方式位置
    this.setShortcutPosition(appList);
    // 重新加载快捷方式
    appList.forEach((app) => {
      this.appendApp(app)
    })
    return this
  }

  /** 设置桌面应用图标大小 */
  public setIconSize(size: DesktopAppSize) {
    this.__shortcutSize = size
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
        id: 0,
        name: "新建应用",
        icon: appIcon,
        method: function () {
          console.log("你点击了【新建应用】")
        }
      },
      {
        id: 1,
        name: "快捷方式自动对齐",
        method: function () {
          console.log("你点击了【快捷方式自动对齐】")
        }
      },
      {
        id: 2,
        name: "取消自动对齐",
        method: function () {
          console.log("你点击了【取消自动对齐】")
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
      this.appList.setIconSize(option.theme.shortcutSize).setTextColor(option.theme.color).setAlignAoto(option.alignAuto);
    }
  }
  /**
   * 设置应用快捷方式
   */
  public setAppShortcut(appList: App[]) {
    this.appList.renderAppShortcut(appList)
  }
}