import createElement from "new-dream/src/utils/createElement";
import { QueryStatus, TaskbarTheme } from "../types/style";
import { chromeIcon, winIcon, queryIcon, quitIcon, setIcon, userIcon, messageIcon, taskIcon, topIcon } from "../svg";
import { SettingOpenFn, SettingPageType, TaskbarOption, UserInfo } from "../types/windows";
import { Menu, Win } from "new-dream";
import TaskManager from "../systemApps/TaskManager.vue";

/** Win菜单元素 */
class TaskbarWinEls {
  public winBox = createElement("windows10-taskbar-win");
  public winIcon = createElement("windows10-taskbar-win-icon");
  /** Win菜单 */
  public viewBox = createElement("windows10-taskbar-win-view");;
  // 左侧小菜单
  public viewLeft = createElement("windows10-taskbar-win-view-left");
  public leftContent = createElement("win-view-left-content");
  public userInfo = createElement("win-view-left-content-item");
  public userIcons = createElement("win-view-left-content-item-icon");
  public userName = createElement("win-view-left-content-item-name");
  public setter = createElement("win-view-left-content-item");
  public setIcons = createElement("win-view-left-content-item-icon");
  public setName = createElement("win-view-left-content-item-name");
  public quit = createElement("win-view-left-content-item");
  public quitIcons = createElement("win-view-left-content-item-icon");
  public quitName = createElement("win-view-left-content-item-name");
  // 中间区域的应用列表
  public viewConten = createElement("windows10-taskbar-win-view-content");
  // 右侧开始屏幕
  public viewRight = createElement("windows10-taskbar-win-view-right");

  private nickName?: string
  private avatarType?: "svg" | "image";
  private avatar?: string;
  constructor() {
    // 装载用户信息
    this.__avatar = userIcon;
    this.__nickName = "用户"
    // 设置图文
    this.setIcons.innerHTML = setIcon;
    this.setName.innerText = "设置"
    // 退出图文
    this.quitIcons.innerHTML = quitIcon;
    this.quitName.innerText = "退出"

    // 组装左侧小菜单
    this.userInfo.appendChild(this.userIcons);
    this.userInfo.appendChild(this.userName);
    this.leftContent.appendChild(this.userInfo);
    this.setter.appendChild(this.setIcons);
    this.setter.appendChild(this.setName);
    this.leftContent.appendChild(this.setter);
    this.quit.appendChild(this.quitIcons);
    this.quit.appendChild(this.quitName);
    this.leftContent.appendChild(this.quit);
    this.viewLeft.appendChild(this.leftContent);
    // 组装大盒子
    this.viewBox.appendChild(this.viewLeft);
    this.viewBox.appendChild(this.viewConten);
    this.viewBox.appendChild(this.viewRight);
    // 将窗口装入到WIN盒子中
    this.winIcon.innerHTML = winIcon;
    this.winBox.appendChild(this.winIcon);
    this.winBox.appendChild(this.viewBox);
    // 监听事件
    // 点击切换显示win菜单
    this.winIcon.addEventListener("click", () => {
      this.viewBox.classList.toggle("show");
    })
    this.winBox.setAttribute("tabindex", "0"); // 允许获得焦点
    // 失去焦点关闭win菜单
    this.winBox.addEventListener("blur", () => {
      this.viewBox.classList.remove("show");
    })
  }

  private get __nickName() {
    return this.nickName
  }
  private set __nickName(v) {
    if (v && v !== this.nickName) {
      this.userName.innerText = v;
      this.nickName = v
    }
  }

  private get __avatar() {
    return this.avatar
  }
  private set __avatar(v) {
    if (v && v !== this.avatar) {
      // 如果头像类型是图片
      if (this.avatarType === "image") {
        let avatar = document.getElementById("windows10-taskbar-avatar") as HTMLImageElement;
        if (!avatar) {
          avatar = createElement({ name: "img", id: 'windows10-taskbar-avatar' }) as HTMLImageElement;
          this.userIcons.appendChild(avatar)
        }
        if (v && v !== this.avatar) {
          avatar.setAttribute("src", v)
        }
      } else {
        // 否则按SVG处理
        if (v && v !== this.avatar) {
          this.userIcons.innerHTML = v
        }
      }
      this.avatar = v
    }
  }

  /**
   * 渲染用户信息
   */
  public renderUserInfo(userInfo: UserInfo) {
    this.__nickName = userInfo.nickName
    this.avatarType = userInfo.avatarType
    this.__avatar = userInfo.avatar
    return this
  }

}
/** 任务栏APP */
class TaskbarAppListEls {
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
/** 任务栏时间 */
class TaskbarTimeEls {
  public timeBox = createElement("windows10-taskbar-datetime");
  private time = createElement("windows10-taskbar-datetime-time");
  private date = createElement("windows10-taskbar-datetime-date");
  constructor() {
    this.timeBox.appendChild(this.time);
    this.timeBox.appendChild(this.date);
    this.setTime()
    setInterval(() => { this.setTime() }, 1000)
  }
  private setTime() {
    const d = new Date();
    const M = d.getMonth() + 1;
    const D = d.getDate();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    this.time.innerText = `${h >= 10 ? h : "0" + h}:${m >= 10 ? m : "0" + m}:${s >= 10 ? s : "0" + s}`;
    this.date.innerText = `${d.getFullYear()}/${M >= 10 ? M : "0" + M}/${D >= 10 ? D : "0" + D}`;
  }
}
/** 任务栏消息 */
class TaskbarMsgEls {
  public messageBox = createElement("windows10-taskbar-message");
  constructor() {
    this.messageBox.innerHTML = messageIcon;
  }
}









/** 任务栏元素 */
export default class TaskbarEls {
  /** 设置任务栏APP置顶高亮的防抖定时器 */
  private setAppTopTime = 0;
  /** 任务栏盒子 */
  public box = createElement("windows10-taskbar");
  /** WIN键 */
  private win = new TaskbarWinEls();
  /** 任务区域 */
  private appList = new TaskbarAppListEls();

  /** 时间 */
  private taskbarTime = new TaskbarTimeEls();
  /** 消息 */
  private taskbarMessage = new TaskbarMsgEls();

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
