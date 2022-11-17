import { Menu, Win } from "new-dream";
import createElement from "new-dream/src/utils/createElement";
import { chromeIcon, messageIcon, queryIcon, setIcon, taskIcon, topIcon } from "../svg/index"
import TaskbarQuery from "./TaskbarQuery";
import TaskbarTime from "./TaskbarTime";
import TaskbarWin from "./TaskbarWin";

import TaskManager from "../systemApps/TaskManager.vue";
import { Direaction, QueryStatus, TtaskbarTheme } from "../types/style.d";
import { OptionsCallback, OptionsData, SettingPageType, UserInfo } from "../types/windows";
/**
 * 任务栏
 */
class Taskbar {
  static SetAppTopTime: number;

  private box: HTMLElement;
  private win: TaskbarWin;
  private appListBox: HTMLElement;
  private query: TaskbarQuery;
  private time: TaskbarTime;
  private message: HTMLElement;
  private queryStatus: QueryStatus = "show";
  private queryStatusChange: (data: QueryStatus) => void = () => true;
  private showSetting: (pageType: SettingPageType) => void = () => true;

  private openAppList: Win[] = []; // 打开的APP列表
  private appIconMap: { [key: string]: HTMLElement } = {}; // 打开的APP图标Map

  constructor(windowsBox: HTMLElement) {
    this.box = createElement("windows10-taskbar");
    this.win = new TaskbarWin();
    this.appListBox = createElement("windows10-taskbar-app-list");
    this.query = new TaskbarQuery();
    this.time = new TaskbarTime();
    this.message = createElement("windows10-taskbar-message");
    this.__init__();
    windowsBox.appendChild(this.box);
  }

  private get __queryStatus() {
    return this.queryStatus
  }
  private set __queryStatus(v) {
    this.queryStatus = v
    this.queryStatusChange(v)
  }

  private __init__() {
    this.message.innerHTML = messageIcon;
    this.box.appendChild(this.win.box);
    this.appListBox.appendChild(this.query.box);
    this.box.appendChild(this.appListBox);
    this.box.appendChild(this.time.box);
    this.box.appendChild(this.message);
    this.__init_menu__();
  }

  /*
   * 初始化右键菜单
   */
  private __init_menu__() {
    new Menu(this.box, [
      {
        id: 1,
        name: "显示搜索框",
        icon: queryIcon,
        method: () => {
          const status = "show";
          if (this.__queryStatus === status) {
            return
          }
          this.__queryStatus = status
        }
      },
      {
        id: 2,
        name: "隐藏搜索框",
        method: () => {
          const status = "none";
          if (this.__queryStatus === status) {
            return
          }
          this.__queryStatus = status
        }
      },
      {
        id: 3,
        name: "显示桌面",
        method: () => {
          // 将所有的窗口都最小化
          this.openAppList.forEach((app) => {
            if (app.status === "mini") { return }
            app.setMini()
          })
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
          this.showSetting("taskbar")
        }
      },
      {
        id: 6,
        name: "关闭全部任务",
        method: () => {
          // 关闭所有窗口（因为关闭窗口会触发删除操作，故需要从后往前遍历）
          for (let i = this.openAppList.length - 1; i >= 0; i--) {
            this.openAppList[i].close()
          }
        }
      },
    ])
  }
  /**
   * 为任务栏的应用图标设置右键菜单
   */
  private __set_app_menu__(appIcon: HTMLElement, app: Win) {
    new Menu(appIcon, [
      {
        id: 1,
        name: "置顶显示",
        icon: topIcon,
        method: () => {
          if (app.status === "mini") {
            // 如果在最小化状态，则恢复
            app.setMini()
          }
          // 设置应用置顶
          app.setTop();
        }
      },
      {
        id: 2,
        name: "最大化窗口",
        method: () => {
          app.setMax();
        }
      },
      {
        id: 3,
        name: "最小化窗口",
        method: () => {
          app.setMini();
        }
      },
      {
        id: 10,
        name: "关闭窗口",
        method: () => {
          app.close();
        }
      },
    ])
  }
  /**
   * 设置置顶应用图标高亮
   */
  private setTopAppIcon() {
    // 防抖
    clearTimeout(Taskbar.SetAppTopTime)
    Taskbar.SetAppTopTime = setTimeout(() => {
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
   * 设置用户信息
   */
  public setUserInfo(userInfo: UserInfo) {
    this.win.setUserInfo(userInfo)
    return this
  }

  /**
   * 设置任务栏主题
   */
  public setTheme(theme: TtaskbarTheme) {
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
    return this
  }

  /**
   * 接收APP打开通知 
   */
  public setOpenApp(app: Win) {
    const className = "taskbar-app-list-item"
    // 设置打开APP对应的图标
    const appIcon = createElement(className);
    if (app.config.icon) {
      if (typeof app.config.icon === "string") {
        appIcon.innerHTML = app.config.icon
      } else if (app.config.icon.nodeName) {
        appIcon.appendChild(app.config.icon)
      }
    } else {
      appIcon.innerHTML = chromeIcon
    }
    // 点击任务栏图标
    appIcon.addEventListener("click", (e) => {
      const clickNode = e.target as HTMLElement;
      // 只有点击的是图标，才触发最小化
      if (clickNode === appIcon || (clickNode.nodeName === "svg" && clickNode.parentNode === appIcon)) {
        // 判断点击元素
        if (app.status === "mini") {
          // 如果在最小化状态，则恢复
          app.setMini()
        }
        // 设置应用置顶
        app.setTop();
      }
    })
    this.openAppList.push(app);
    this.appIconMap[app.id] = appIcon;
    this.__set_app_menu__(appIcon, app);
    this.appListBox.appendChild(appIcon);
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
    return this
  }

  /**
   * 接收APP关闭通知
   */
  public setCloseApp(appId: string) {
    console.log(appId)
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
    return this
  }

  /**
   * 搜索框显示/隐藏
   */
  public setQueryShow(status: QueryStatus) {
    this.queryStatus = status;
    this.query.setStatus(status)
    return this
  }

  /**
   * 监听搜索框状态改变
   */
  public onQueryStatusChange(fn: (data: QueryStatus) => void) {
    this.queryStatusChange = fn;
    return this
  }

  /**
   * 设置【打开设置】方法
   * @param fn 打开设置的方法
   * @returns 
   */
  public setShowSetting(fn: (pageType: SettingPageType) => void) {
    this.showSetting = fn;
    this.win.view.setShowSetting(fn);
    return this
  }
}


export default Taskbar