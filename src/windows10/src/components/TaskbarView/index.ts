import createElement from "new-dream/src/utils/createElement";
import { TaskbarTheme } from "../../types/style";
import { chromeIcon, queryIcon, setIcon, taskIcon, topIcon } from "../../svg";
import { SettingOpenFn, SettingPageType, TaskbarOption, UserInfo } from "../../types/windows";
import { Win, Menu } from "new-dream";
import TaskManager from "../../systemApps/TaskManager.vue";

import TaskbarWinEls from "./TaskbarWinEls"
import TaskbarAppListView from "./TaskbarAppListView"
import TaskbarTimeView from "./TaskbarTimeView"
import TaskbarMsgView from "./TaskbarMsgView"

/** 任务栏元素 */
export default class TaskbarView {
  /** 设置任务栏APP置顶高亮的防抖定时器 */
  private setAppTopTime = 0;
  /** 任务栏盒子 */
  public box = createElement("windows10-taskbar");
  /** WIN键 */
  private win = new TaskbarWinEls();
  /** 任务区域 */
  private appList = new TaskbarAppListView();

  /** 时间 */
  private taskbarTime = new TaskbarTimeView();
  /** 消息 */
  private taskbarMessage = new TaskbarMsgView();

  /** 打开是应用列表 */
  private openAppList: Win[] = []
  /** 打开的APP图标Map */
  private appIconMap: { [key: string]: HTMLElement } = {};
  /** 监听函数MAP */
  private methods = {
    openSetting: (type?: SettingPageType) => { console.log("打开设置") },
  };
  private theme?: TaskbarTheme;

  constructor() {
    this.box.appendChild(this.win.winBox);
    this.box.appendChild(this.appList.appListBox);
    this.box.appendChild(this.taskbarTime.timeBox);
    this.box.appendChild(this.taskbarMessage.messageBox);
    this.setMenu()
  }

  private get __theme() {
    return this.theme
  }

  private set __theme(v) {
    if (!v) { return }
    if (!this.theme || this.theme.backgroundColor !== v.backgroundColor || this.theme.color !== v.color) {
      console.log(`【任务栏主题】渲染`)
      // 按需更新
      const styleId = "style-taskbar-theme"
      let style = document.getElementById(styleId)
      if (!style) {
        // 如果没有主题样式，则创建
        style = createElement({ name: "style", id: styleId });
        document.head.appendChild(style);
      }
      style.innerHTML = `
                :root{
                  --taskbarBg: ${v.backgroundColor} !important;
                  --taskbarColor: ${v.color} !important;
                }
              `;
      this.theme = Object.assign({}, v)
    }
  }


  /**
   * 设置右键菜单
   */
  private setMenu() {
    new Menu(this.box, [
      {
        id: 1,
        name: "显示搜索框",
        icon: queryIcon,
        method: () => {
          this.appList.setQueryStatus("show")
        }
      },
      {
        id: 2,
        name: "隐藏搜索框",
        method: () => {
          this.appList.setQueryStatus("none")
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
          this.methods.openSetting("taskbar")
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
  private setAppRmenu(appIcon: HTMLElement, app: Win) {
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
    clearTimeout(this.setAppTopTime)
    this.setAppTopTime = setTimeout(() => {
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
   * 设置任务栏主题
   */
  public setTheme(theme: TaskbarTheme) {
    this.__theme = theme
    return this
  }

  /**
   * 打开APP（图标）
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
    this.setAppRmenu(appIcon, app);
    this.appList.appListBox.appendChild(appIcon);
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
   * 关闭APP关闭（图标）
   */
  public setCloseApp(appId: string) {
    // 关闭图标
    this.appList.appListBox.removeChild(this.appIconMap[appId]);
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
   * 事件监听
   */
  public onEvent({ onQuit, openSetting }: { onQuit: () => void; openSetting: SettingOpenFn }) {
    // 点击Win菜单左侧【设置】
    this.win.setter.addEventListener("click", () => { openSetting("default") });
    // 点击Win菜单左侧【退出】
    this.win.quit.addEventListener("click", onQuit);
    // 储存该方法，右键菜单也需要
    this.methods.openSetting = openSetting;
  }
  /**
   * 设置Win菜单用户信息
   */
  public setWinUserInfo(userInfo: UserInfo) {
    this.win.renderUserInfo(userInfo)
    return this
  }
  /**
   * 更新视图
   */
  public updateView(option: TaskbarOption) {
    if (option.theme) {
      this.setTheme(option.theme)
    }
    if (option.queryStatus) {
      this.appList.setQueryStatus(option.queryStatus)
    }
  }

}
