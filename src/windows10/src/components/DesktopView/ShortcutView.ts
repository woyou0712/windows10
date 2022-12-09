import createElement from "new-dream/src/utils/createElement";
import { chromeIcon, lockIcon } from "../../svg";
import { App } from "../../types/windows";

/** 快捷方式视图对象 */
export default class ShortcutView {
  /** 盒子 */
  public box: HTMLElement;
  private iconBox: HTMLElement;
  private titleBox: HTMLElement;
  /** 标题名称 */
  public title: string;
  /** icon图标 */
  public icon: string | HTMLImageElement;
  
  constructor(app: App) {
    this.title = app.title;
    this.icon = app.icon;
    this.box = createElement("windows10-desktop-shortcut-item");
    this.box.setAttribute("app-id", app.id);
    this.iconBox = createElement("windows10-desktop-shortcut-icon-box");
    this.titleBox = createElement("windows10-desktop-shortcut-title");
    this.__init__();
  }
  private __init__() {
    this.setTitle(this.title).setIcon(this.icon);
    this.box.appendChild(this.iconBox);
    this.box.appendChild(this.titleBox);
    this.box.appendChild(createElement("windows10-desktop-shortcut-item-shade"));
  }

  public setTitle(title: string) {
    this.titleBox.innerHTML = "";
    this.titleBox.innerText = title;
    return this;
  }

  public setIcon(icon: string | HTMLImageElement) {
    this.iconBox.innerHTML = "";
    if (typeof icon === "string") {
      this.iconBox.innerHTML = icon;
    } else if (icon.nodeName) {
      this.iconBox.appendChild(icon);
    } else {
      this.iconBox.innerHTML = chromeIcon;
    }
    const lock = createElement("windows10-desktop-shortcut-item-lock");
    lock.innerHTML = lockIcon;
    this.iconBox.appendChild(lock);
    return this
  }
}
