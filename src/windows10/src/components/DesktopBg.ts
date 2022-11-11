import createElement from "new-dream/src/utils/createElement";
import { DesktopBackground } from "../types/style";

class DesktopBg {
  public box: HTMLElement;
  constructor() {
    this.box = createElement("windows10-desktop-background");
  }

  /**
   * 设置背景
   */
  public setBackground(background: DesktopBackground) {
    if (background.type === "image") {
      this.box.style["backgroundImage"] = `url(${background.backgroundImage})`
      if (background.backgroundSize) {
        this.box.style["backgroundSize"] = background.backgroundSize
      }
      if (background.backgroundRepeat) {
        this.box.style["backgroundRepeat"] = background.backgroundRepeat
      }
      if (background.backgroundPosition) {
        this.box.style["backgroundPosition"] = background.backgroundPosition
      }
    } else if (background.type === "color") {
      this.box.style["backgroundColor"] = background.backgroundColor;
      this.box.style["backgroundImage"] = "none"
    } else {
      console.error("桌面背景配置项异常！")
    }
    return this
  }

}

export default DesktopBg