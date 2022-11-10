import { Menu, Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { messageIcon, selectIcon, setIcon, taskIcon } from "../svg/index"
import TaskbarSelect from "./TaskbarSelect";
import TaskbarTime from "./TaskbarTime";
import TaskbarWin from "./TaskbarWin";

import TaskManager from "../systemApps/TaskManager.vue";
import SetTaskbar from "../systemApps/SetTaskbar.vue";
import { Direaction, SelectDisplay, Theme } from "../types/style.d";
import { OptionsCallback, OptionsData } from "../types/windows";

export interface TaskbarOptions {
  theme: Theme;
  direaction: Direaction;
  selectDisplay: SelectDisplay;
}

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
  private theme?: Theme;
  private selectDisplay?: SelectDisplay;
  private direaction?: Direaction;
  private callback: OptionsCallback = () => true

  constructor(windowsBox: HTMLElement, direaction: Direaction) {
    this.box = createElement("windows10-taskbar");
    this.win = new TaskbarWin();
    this.appList = createElement("windows10-taskbar-app-list");
    this.select = new TaskbarSelect();
    this.time = new TaskbarTime();
    this.message = createElement("windows10-taskbar-message");
    this.direaction = direaction; // 记录初始化状态(设置需要)，无需跟踪，则不需要走set方法
    this.__init__();
    windowsBox.appendChild(this.box);
  }

  private get __theme() {
    return this.theme
  }
  private set __theme(v) {
    this.theme = v
    this.pushOptionsChange()
  }

  private get __direaction() {
    return this.direaction
  }
  private set __direaction(v) {
    this.direaction = v
    this.pushOptionsChange()
  }

  private get __selectDisplay() {
    return this.selectDisplay
  }
  private set __selectDisplay(v) {
    this.selectDisplay = v
    this.pushOptionsChange()
  }

  private __init__() {
    this.message.innerHTML = messageIcon;
    this.box.appendChild(this.win.box);
    this.appList.appendChild(this.select.box);
    this.box.appendChild(this.appList);
    this.box.appendChild(this.time.box);
    this.box.appendChild(this.message);
    this.__init_menu__();
  }



  /**
   * 初始化右键菜单
   */
  private __init_menu__() {
    new Menu(this.box, [
      {
        id: 1,
        name: "显示搜索框",
        icon: selectIcon,
        method: () => {
          const display = "flex";
          if (this.__selectDisplay === display) {
            return
          }
          this.__selectDisplay = display
        }
      },
      {
        id: 2,
        name: "隐藏搜索框",
        method: () => {
          const display = "none";
          if (this.__selectDisplay === display) {
            return
          }
          this.__selectDisplay = display
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
            component: SetTaskbar,
            props: {
              theme: this.theme,
              direaction: this.__direaction,
              selectDisplay: this.selectDisplay,
              change: (data: OptionsData) => {
                if (data.taskbar) {
                  // 修改状态
                  if (data.taskbar.theme) this.__theme = data.taskbar.theme;
                  if (data.taskbar.direaction) this.__direaction = data.taskbar.direaction;
                  if (data.taskbar.selectDisplay) this.__selectDisplay = data.taskbar.selectDisplay;
                }
              }
            }
          })
        }
      },
    ])
  }
  /**
   * 向监听对象发送配置项改变的消息通知
   */
  private pushOptionsChange() {
    const data: OptionsData = {
      taskbar: {
        theme: this.__theme,
        direaction: this.__direaction,
        selectDisplay: this.__selectDisplay
      }
    }
    this.callback(data)
  }

  /**
   * 监听配置项改变
   */
  public onOptionChange(fn: OptionsCallback) {
    this.callback = fn
    return this
  }

  /**
   * 设置任务栏主题
   */
  public setTheme(theme: Theme) {
    let style = document.getElementById("style-taskbar-theme")
    if (!style) {
      // 如果没有主题样式，则创建
      style = createElement({ name: "style", id: "style-taskbar-theme" });
      document.head.appendChild(style);
    }
    style.innerHTML = `
          :root{
            --taskbarBg: ${theme.backgroundColor} !important;
            --taskbarColor: ${theme.color} !important;
          }
        `;
    this.theme = theme;
    return this
  }
  /**
   * 搜索框显示/隐藏
   */
  public setSelectShow(display: SelectDisplay) {
    this.selectDisplay = display;
    this.select.setDisplay(display)
  }
  /**
   * APP打开
   */
  public setOpenApp(app: Win) {
    // const appBox = createElement("taskbar-app-list-item");
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