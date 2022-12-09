import createElement from "new-dream/src/utils/createElement";
import { QueryStatus } from "../../types/style";
import { chromeIcon, queryIcon } from "../../svg";
import { Win } from "new-dream";

/** 任务栏APP视图 */
export default class TaskbarAppListView {
  /** 任务区域 */
  public appListBox = createElement("windows10-taskbar-app-list");
  /** 搜索框 */
  public queryBox = createElement("windows10-taskbar-query");
  public queryIcon = createElement("windows10-taskbar-query-icon");
  public queryInput = createElement({ name: "input", class: "windows10-taskbar-query-input" }) as HTMLInputElement;
  public queryButton = createElement("windows10-taskbar-query-button");
  public queryStatus?: QueryStatus;

  constructor() {
    this.queryIcon.innerHTML = queryIcon;
    this.queryInput.setAttribute("placeholder", "在这里输入你要搜索的内容");
    this.queryButton.innerText = "搜索";
    const iptBox = createElement("windows10-taskbar-query-box");
    iptBox.appendChild(this.queryIcon);
    iptBox.appendChild(this.queryInput);
    iptBox.appendChild(this.queryButton);
    this.queryBox.appendChild(iptBox);
    this.appListBox.appendChild(this.queryBox);
    this.__queryStatus = "show";
    this.queryButton.addEventListener("click", () => { this.toQuery() })
  }

  private get __queryStatus() {
    return this.queryStatus
  }

  private set __queryStatus(v) {
    if (this.queryStatus !== v) {
      console.log(`【任务栏搜索框】渲染`)
      // 按需更新视图
      switch (v) {
        case "show":
          this.queryBox.classList.add("show")
          break;
        default:
          this.queryBox.classList.remove("show")
          break;
      }
      this.queryStatus = v
    }
  }

  private toQuery() {
    new Win({
      id: "window10-query",
      title: "必应",
      icon: chromeIcon,
      url: `https://cn.bing.com/search?q=${this.queryInput.value}`,
      maxBtn: true,
      miniBtn: true,
      resize: true,
    })
  }

  /** 设置搜索框显示状态 */
  public setQueryStatus(status: QueryStatus) {
    this.__queryStatus = status;
    return this
  }


}