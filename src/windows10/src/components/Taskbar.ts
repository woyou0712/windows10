import { Menu } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { winIcon, messageIcon } from "../svg/index"
import TaskbarSelect from "./TaskbarSelect";
import TaskbarTime from "./TaskbarTime";
import TaskbarWin from "./TaskbarWin";
/**
 * 任务栏
 */
class Taskbar {
  public box: HTMLElement;
  public win: TaskbarWin;
  public appList: HTMLElement;
  private select: TaskbarSelect;
  private time: TaskbarTime;
  public message: HTMLElement;
  constructor(windowsBox: HTMLElement) {
    this.box = createElement("windows10-taskbar");
    this.win = new TaskbarWin();
    this.appList = createElement("windows10-taskbar-app-list");
    this.select = new TaskbarSelect();
    this.time = new TaskbarTime();
    this.message = createElement("windows10-taskbar-message");
    this.__init__();
    windowsBox.appendChild(this.box);
  }



  private setMenu() {
    new Menu(this.box, [
      {
        id: 1,
        name: "显示搜索框",
        method: () => {
          this.select.show()
        }
      },
      {
        id: 2,
        name: "隐藏搜索框",
        method: () => {
          this.select.hide()
        }
      },
      {
        id: 3,
        name: "显示桌面",
        method: () => {
          console.log("显示桌面")
        }
      },
      {
        id: 4,
        name: "任务管理器",
        method: () => {
          console.log("显示桌面")
        }
      },
      {
        id: 5,
        name: "任务栏设置",
        method: () => {
          console.log("显示桌面")
        }
      },
    ])
  }


  private __init__() {
    this.message.innerHTML = messageIcon;
    this.box.appendChild(this.win.box);
    this.appList.appendChild(this.select.box);
    this.box.appendChild(this.appList);
    this.box.appendChild(this.time.box);
    this.box.appendChild(this.message);
    this.setMenu();
  }


}


export default Taskbar