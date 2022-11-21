import createElement from "new-dream/src/utils/createElement";
import { DesktopBackground } from "../types/style.d";
import { DesktopOption } from "../types/windows";

/** 桌面元素 */
export default class DesktopEls {
  public box = createElement("windows10-desktop");
  private background = createElement("windows10-desktop-background");
  constructor() {
    this.box.appendChild(this.background)
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

  public updateView(option: DesktopOption) {
    if (option.theme) {
      this.setBackground(option.theme.background)
    }
  }
}