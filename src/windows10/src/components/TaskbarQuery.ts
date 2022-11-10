import { Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { chromeIcon, queryIcon } from "../svg";
import { QueryStatus } from "../types/style";



class TaskbarQuery {
  public box: HTMLElement;
  private icon: HTMLElement;
  private input: HTMLElement;
  private button: HTMLElement;
  private display?: QueryStatus

  constructor() {
    this.box = createElement("windows10-taskbar-query");
    this.icon = createElement("windows10-taskbar-query-icon");
    this.icon.innerHTML = queryIcon;
    this.input = createElement({ name: "input", class: "windows10-taskbar-query-input" });
    this.input.setAttribute("placeholder", "在这里输入你要搜索的内容");
    this.button = createElement("windows10-taskbar-query-button");
    this.button.innerText = "搜索";

    const iptBox = createElement("windows10-taskbar-query-box");
    iptBox.appendChild(this.icon);
    iptBox.appendChild(this.input);
    iptBox.appendChild(this.button);

    this.box.appendChild(iptBox);
    this.setEvent();
  }

  private get __display() {
    return this.display
  }

  private set __display(v) {
    if (!v || ["show", "none"].indexOf(v) === -1) {
      v = "none"
    }
    this.display = v
    switch (v) {
      case "show":
        this.box.classList.add("show")
        break;
      default:
        this.box.classList.remove("show")
        break;
    }
  }

  public setDisplay(display: QueryStatus) {
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
      url: `https://cn.bing.com/search?q=${key}`,
      resize: true,
      maxBtn: true,
      miniBtn: true,
      icon: chromeIcon
    })
  }
}

export default TaskbarQuery;