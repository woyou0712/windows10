import { Menu } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { winIcon, messageIcon, selectIcon } from "../svg/index"
import TaskbarSelect from "./TaskbarSelect";
/**
 * 任务栏
 */
class Taskbar {
  public box: HTMLElement;
  private win: HTMLElement;
  public appList: HTMLElement;
  private select: TaskbarSelect;
  private time: HTMLElement;
  public message: HTMLElement;
  constructor(windowsBox: HTMLElement) {
    this.box = createElement("windows10-taskbar");
    this.win = createElement("windows10-taskbar-win");
    this.appList = createElement("windows10-taskbar-app-list");
    this.select = new TaskbarSelect();
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
      const M = d.getMonth() + 1;
      const D = d.getDate();
      const h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();

      timeEl.innerText = `${h >= 10 ? h : "0" + h}:${m >= 10 ? m : "0" + m}:${s >= 10 ? s : "0" + s}`
      dateEl.innerText = `${d.getFullYear()}/${M >= 10 ? M : "0" + M}/${D >= 10 ? D : "0" + D}`
    }, 1000)
  }

  private setMenu() {
    new Menu(this.box, [
      {
        id: 0,
        name: "显示搜索框",
        method: () => {
          this.select.show()
        }
      },
      {
        id: 1,
        name: "隐藏搜索框",
        method: () => {
          this.select.hide()
        }
      },
      {
        id: 2,
        name: "显示桌面",
        method: () => {
          console.log("显示桌面")
        }
      }
    ])
  }


  private __init__() {
    this.win.innerHTML = winIcon;
    this.setTime(); // 设置时间
    this.message.innerHTML = messageIcon;
    this.box.appendChild(this.win);
    this.appList.appendChild(this.select.box);
    this.box.appendChild(this.appList);
    this.box.appendChild(this.time);
    this.box.appendChild(this.message);
    this.setMenu();
  }


}


export default Taskbar