import { Win, Message, MessageBox, Menu } from "new-dream";
import createElement from "new-dream/src/utils/createElement";

// 桌面
class Desktop {
  public box: HTMLElement;
  constructor(windowsBox: HTMLElement) {
    this.box = createElement("windows10-desktop");
    windowsBox.appendChild(this.box);
    this.__init__();
  }

  private __init__() {
    Win.defaultContentBox = this.box; // 将弹窗组件的顶级盒子设定为桌面
    Message.defaultContentBox = this.box; // 将消息提示框的默认盒子设定为桌面
    MessageBox.defaultContentBox = this.box;
    new Menu(this.box, [])
  }
}

export default Desktop