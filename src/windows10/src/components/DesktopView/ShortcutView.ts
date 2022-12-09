import createElement from "new-dream/src/utils/createElement";
import { chromeIcon, lockIcon } from "../../svg";
import { App } from "../../types/windows";

/** 快捷方式视图对象 */
export default class ShortcutView {
  public box: HTMLElement;
  public iconBox: HTMLElement;
  public titleBox: HTMLElement;
  private config: App;
  constructor(app: App) {
    this.config = app;
    this.box = createElement("windows10-desktop-shortcut-item");
    this.box.setAttribute("app-id", app.id);
    this.iconBox = createElement("windows10-desktop-shortcut-icon-box");
    this.titleBox = createElement("windows10-desktop-shortcut-title");
    this.__init__();
  }
  private __init__() {
    if (typeof this.config.icon === "string") {
      this.iconBox.innerHTML = this.config.icon;
    } else if (this.config.icon.nodeName) {
      this.iconBox.appendChild(this.config.icon);
    } else {
      this.iconBox.innerHTML = chromeIcon;
    }
    this.titleBox.innerText = this.config.title;
    const lock = createElement("windows10-desktop-shortcut-item-lock");
    lock.innerHTML = lockIcon;
    this.iconBox.appendChild(lock);
    this.box.appendChild(this.iconBox);
    this.box.appendChild(this.titleBox);
    this.box.appendChild(createElement("windows10-desktop-shortcut-item-shade"));
  }

}
