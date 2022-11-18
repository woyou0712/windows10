import { Win, Message, MessageBox, Menu } from "new-dream";
import { dirSvg, disSvg, indSvg } from "new-dream/src/svg/button";
import createElement from "new-dream/src/utils/createElement";
import { DesktopBackground } from "../types/style";
import { OptionsCallback, SettingPageType } from "../types/windows";
import DesktopBg from "./DesktopBg";

// 桌面
class Desktop {
  private box: HTMLElement;
  private background: DesktopBg;

  private showSetting: (pageType: SettingPageType) => void = () => true;
  constructor(windowsBox: HTMLElement) {
    this.box = createElement("windows10-desktop");
    this.background = new DesktopBg();
    this.box.appendChild(this.background.box);
    windowsBox.appendChild(this.box);
    this.__init__();
  }

  private __init__() {
    Win.defaultContentBox = this.box; // 将弹窗组件的顶级盒子设定为桌面
    Message.defaultContentBox = this.box; // 将消息提示框的默认盒子设定为桌面
    MessageBox.defaultContentBox = this.box;
    this.__set_menu__()
  }

  private __set_menu__() {
    const option = [
      {
        id: 0,
        icon: dirSvg,
        name: "新建文件夹",
        method: function () {
          console.log("1你点击了【新建文件夹】")
        }
      },
      {
        id: 1,
        name: "查看(V)",
        method: function () {
          console.log("2你点击了【查看】")
        }
      },
      {
        id: 2,
        name: "排序方式(O)",
        method: function () {
          console.log("3你点击了【排序方式】")
        }
      },
      {
        id: 3,
        name: "刷新",
        method: function () {
          location.reload()
        }
      },
      {
        id: 4,
        icon: disSvg,
        name: "显示设置",
        method: function () {
          console.log("5你点击了【显示设置】")
        }
      },
      {
        id: 4,
        icon: indSvg,
        name: "个性化",
        method: function () {
          console.log("6你点击了【个性化】")
        }
      },
    ]
    new Menu(this.box, option)
  }

  /**
   * 设置背景
   */
  public setBackground(background: DesktopBackground) {
    this.background.setBackground(background);
    return this
  }

  /**
   * 设置【打开设置】方法
   * @param fn 打开设置的方法
   * @returns 
   */
  public setShowSetting(fn: (pageType: SettingPageType) => void) {
    this.showSetting = fn;
    return this
  }
}

export default Desktop