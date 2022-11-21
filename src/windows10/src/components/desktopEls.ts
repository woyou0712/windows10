import { Menu, Message, MessageBox, Win } from "new-dream";
import { dirSvg, disSvg, indSvg } from "new-dream/src/svg/button";
import createElement from "new-dream/src/utils/createElement";
import { DesktopBackground } from "../types/style.d";
import { DesktopOption } from "../types/windows";

/** 桌面元素 */
export default class DesktopEls {
  public box = createElement("windows10-desktop");
  private background = createElement("windows10-desktop-background");
  constructor() {
    Win.defaultContentBox = this.box; // 将弹窗组件的顶级盒子设定为桌面
    Message.defaultContentBox = this.box; // 将消息提示框的默认盒子设定为桌面
    MessageBox.defaultContentBox = this.box;
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

  public updateView(option: DesktopOption) {
    if (option.theme) {
      this.setBackground(option.theme.background)
    }
  }
}