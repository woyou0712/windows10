import { Win, Message, MessageBox, Menu } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { DesktopBackground } from "../types/style";
import { OptionsCallback } from "../types/windows";
import DesktopBg from "./DesktopBg";

// 桌面
class Desktop {
  private box: HTMLElement;
  private background: DesktopBg;

  private optionChange: OptionsCallback = () => true
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
    new Menu(this.box, [])
  }

  /**
   * 设置背景
   */
  public setBackground(background: DesktopBackground) {
    this.background.setBackground(background);
    return this
  }

  public onOptionChange(fn: OptionsCallback) {
    this.optionChange = fn
  }
}

export default Desktop