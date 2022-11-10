import { Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { selectIcon } from "../svg";
import { SelectDisplay } from "../types/style";



class TaskbarSelect {
  public box: HTMLElement;
  private icon: HTMLElement;
  private input: HTMLElement;
  private button: HTMLElement;
  private display?: SelectDisplay

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

  private get __display() {
    return this.display
  }

  private set __display(v) {
    if (!v || ["flex", "none"].indexOf(v) === -1) {
      v = "none"
    }
    this.display = v
    this.box.style["display"] = v
  }

  public setDisplay(display: SelectDisplay) {
    this.__display = display
  }


  private setEvent() {
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.query((this.input as HTMLInputElement).value)
      }
    })
    this.button.addEventListener("click", () => {
      this.query((this.input as HTMLInputElement).value)
    })
  }
  private query(key: string) {
    new Win({
      title: "Microsoft Bing",
      url: `https://cn.bing.com/search?q=${key}`
    })
  }
}

export default TaskbarSelect;