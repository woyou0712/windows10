import { Menu, Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { messageIcon, selectIcon, setIcon, taskIcon } from "../svg/index"
import TaskbarSelect from "./TaskbarSelect";
import TaskbarTime from "./TaskbarTime";
import TaskbarWin from "./TaskbarWin";

import TaskManager from "../systemApps/TaskManager.vue";
import SetTaskbar from "../systemApps/SetTaskbar.vue";
import { Direaction, SelectStatus, Theme } from "../types/style.d";
import { OptionsCallback, OptionsData } from "../types/windows";
import { chromeSvg } from "new-dream/src/svg/button";

export interface TaskbarOptions {
  theme: Theme;
  direaction: Direaction;
  selectStatus: SelectStatus;
}

/**
 * 任务栏
 */
class Taskbar {
  static SetAppTopTime: number;

  public box: HTMLElement;
  private win: TaskbarWin;
  private appListBox: HTMLElement;
  private select: TaskbarSelect;
  private time: TaskbarTime;
  private message: HTMLElement;
  private theme?: Theme;
  private selectStatus?: SelectStatus;
  private direaction?: Direaction;
  private callback: OptionsCallback = () => true

  private openAppList: Win[] = []; // 打开的APP列表
  private appIconMap: { [key: string]: HTMLElement } = {}; // 打开的APP图标Map

  constructor(windowsBox: HTMLElement, direaction: Direaction) {
    this.box = createElement("windows10-taskbar");
    this.win = new TaskbarWin();
    this.appListBox = createElement("windows10-taskbar-app-list");
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

  private get __selectStatus() {
    return this.selectStatus
  }
  private set __selectStatus(v) {
    this.selectStatus = v
    this.pushOptionsChange()
  }

  private __init__() {
    this.message.innerHTML = messageIcon;
    this.box.appendChild(this.win.box);
    this.appListBox.appendChild(this.select.box);
    this.box.appendChild(this.appListBox);
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
          const display = "show";
          if (this.__selectStatus === display) {
            return
          }
          this.__selectStatus = display
        }
      },
      {
        id: 2,
        name: "隐藏搜索框",
        method: () => {
          const display = "none";
          if (this.__selectStatus === display) {
            return
          }
          this.__selectStatus = display
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
              selectStatus: this.selectStatus,
              change: (data: OptionsData) => {
                if (data.taskbar) {
                  // 修改状态
                  if (data.taskbar.theme) this.__theme = data.taskbar.theme;
                  if (data.taskbar.direaction) this.__direaction = data.taskbar.direaction;
                  if (data.taskbar.selectStatus) this.__selectStatus = data.taskbar.selectStatus;
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
        selectStatus: this.__selectStatus
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
  public setSelectShow(display: SelectStatus) {
    this.selectStatus = display;
    this.select.setDisplay(display)
  }
  /**
   * APP打开
   */
  public setOpenApp(app: Win) {
    // 在任务栏添加一个图标
    const appIcon = createElement("taskbar-app-list-item");
    if (app.config.icon) {
      if (typeof app.config.icon === "string") {
        appIcon.innerHTML = app.config.icon
      } else if (app.config.icon.nodeName) {
        appIcon.appendChild(app.config.icon)
      }
    } else {
      appIcon.innerHTML = chromeSvg
    }
    // 点击任务栏图标
    appIcon.addEventListener("click", () => {
      if (app.status === "mini") {
        // 如果在最小化状态，则恢复
        app.setMini()
      }
      // 设置应用置顶
      app.setTop();
    })
    this.appListBox.appendChild(appIcon);
    this.appIconMap[app.id] = appIcon;
    this.openAppList.push(app)
    // 新窗口打开
    app.onmounted(() => {
      this.setTopAppIcon()
    })
    // 监听窗口置顶
    app.ontop(() => {
      this.setTopAppIcon()
    })
    // 监听窗口最小化
    app.onmini(() => {
      this.setTopAppIcon()
    })
  }
  /**
   * 设置置顶应用图标高亮
   */
  private setTopAppIcon() {
    console.log("窗口置顶中？")
    // 防抖
    clearTimeout(Taskbar.SetAppTopTime)
    Taskbar.SetAppTopTime = setTimeout(() => {
      console.log("窗口置顶")
      // 修改窗口的置顶状态
      let topIndex = 0, topId = "";
      this.openAppList.forEach(app => {
        // 取消所有窗口的置顶状态
        this.appIconMap[app.id].classList.remove("top")
        // 最小化的窗口取消置顶状态
        if (app.status === "mini") {
          return
        }
        // 找到除了最新化之外的最顶层窗口
        if (app.zIndex > topIndex) {
          topIndex = app.zIndex
          topId = app.id
        }
      })
      if (topId && topId !== "") {
        this.appIconMap[topId].classList.add("top")
      }

    }, 50);
  }
  /**
   * APP关闭
   */
  public setCloseApp(appId: string) {
    // 关闭图标
    this.appListBox.removeChild(this.appIconMap[appId]);
    delete this.appIconMap[appId];
    // 从打开的应用列表移除
    for (let i = 0; i < this.openAppList.length; i++) {
      const app = this.openAppList[i];
      if (app.id === appId) {
        this.openAppList.splice(i, 1)
      }
    }
  }

}


export default Taskbar