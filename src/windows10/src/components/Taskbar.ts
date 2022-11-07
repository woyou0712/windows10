import { Menu } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { winIcon, messageIcon } from "../svg/index"
/**
 * 任务栏
 */
class Taskbar {
  public box: HTMLElement;
  private win: HTMLElement;
  public appList: HTMLElement;
  private time: HTMLElement;
  public message: HTMLElement;
  constructor(windowsBox: HTMLElement) {
    this.box = createElement("windows10-taskbar");
    this.win = createElement("windows10-taskbar-win");
    this.appList = createElement("windows10-taskbar-app-list");
    this.time = createElement("windows10-taskbar-datetime");
    this.message = createElement("windows10-taskbar-message");
    this.__init__();
    windowsBox.appendChild(this.box);
  }

  private setTime() {
    const timeEl = createElement("windows10-taskbar-datetime-time");
    const dateEl = createElement("windows10-taskbar-datetime-date");
    this.time.appendChild(timeEl);
    this.time.appendChild(dateEl);
    setInterval(() => {
      const d = new Date();
      timeEl.innerText = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
      dateEl.innerText = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    }, 1000)
  }

  private setMenu() {
    new Menu(this.box, [
      {
        id: 0,
        name: "显示搜索框",
        method() {
          console.log("显示搜索框")
        }
      },
      {
        id: 1,
        name: "隐藏搜索框",
        method() {
          console.log("隐藏搜索框")
        }
      }
    ])
  }
  

  private __init__() {
    this.win.innerHTML = winIcon;
    this.setTime(); // 设置时间
    this.message.innerHTML = messageIcon;
    this.box.appendChild(this.win);
    this.box.appendChild(this.appList);
    this.box.appendChild(this.time);
    this.box.appendChild(this.message);
    this.setMenu();
  }


}


export default Taskbar