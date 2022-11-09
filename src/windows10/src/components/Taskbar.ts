import { Menu, Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { messageIcon, selectIcon, setIcon, taskIcon } from "../svg/index"
import TaskbarSelect from "./TaskbarSelect";
import TaskbarTime from "./TaskbarTime";
import TaskbarWin from "./TaskbarWin";

import TaskManager from "../systemApps/TaskManager.vue"
import SetTaskbar from "../systemApps/SetTaskbar.vue"
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
        icon: selectIcon,
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
        icon: taskIcon,
        method: () => {
          new Win({
            component: TaskManager
          })
        }
      },
      {
        id: 5,
        name: "任务栏设置",
        icon: setIcon,
        method: () => {
          new Win({
            component: SetTaskbar
          })
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
  /**
   * APP打开
   */
  public setOpenApp(app: Win) {
    const appBox = createElement("taskbar-app-list-item");
    console.log(app)
  }
  /**
   * APP置顶
   */
  public setTopApp(appId: string | symbol) {
    console.log(appId)
  }
  /**
   * APP关闭
   */
  public setCloseApp(appId: string | symbol) {
    console.log(appId)
  }
}


export default Taskbar