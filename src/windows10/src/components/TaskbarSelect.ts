import { Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { selectIcon } from "../svg";

class TaskbarSelect {
  public box: HTMLElement;
  private icon: HTMLElement;
  private input: HTMLElement;
  private button: HTMLElement;

  constructor() {
    this.box = createElement("windows10-taskbar-select");
    this.icon = createElement("windows10-taskbar-select-icon");
    this.icon.innerHTML = selectIcon;
    this.box.appendChild(this.icon);

    this.input = createElement({ name: "input", class: "windows10-taskbar-select-input" });
    this.input.setAttribute("placeholder", "在这里输入你要搜索的内容");
    this.box.appendChild(this.input);
    this.button = createElement("windows10-taskbar-select-button");
    this.button.innerText = "搜索";
    this.box.appendChild(this.button);

    this.setEvent();
  }

  private setEvent() {
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.query((this.input as HTMLInputElement).value)
      }
    })
  }
  private query(key: string) {
    new Win({
      title: "百度一下，你就知道",
      url: `https://cn.bing.com/search?q=${key}`
    })
  }

  public show() {
    this.box.style["display"] = "flex"
  }
  public hide() {
    this.box.style["display"] = "none"
  }
}

export default TaskbarSelect;