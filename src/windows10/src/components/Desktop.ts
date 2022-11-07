import createElement from "new-dream/src/utils/createElement";

// 桌面
class Desktop {
  public box: HTMLElement;
  constructor(windowsBox: HTMLElement) {
    this.box = createElement("windows10-desktop");
    windowsBox.appendChild(this.box);
  }
}

export default Desktop