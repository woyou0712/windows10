import createElement from "new-dream/src/utils/createElement";
import { QueryStatus, TaskbarTheme } from "../types/style";
import { chromeIcon, winIcon, queryIcon, quitIcon, setIcon, userIcon, messageIcon, taskIcon, topIcon } from "../svg";
import { UserInfo } from "../types/windows";
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
  constructor() {
    // 装载图标
    this.userIcons.innerHTML = userIcon;
    this.setIcons.innerHTML = setIcon;
    this.quitIcons.innerHTML = quitIcon;
    // 装载文字
    this.userName.innerText = "用户"
    this.setName.innerText = "设置"
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

  /**
   * 监听左侧按钮点击
   */
  public onLeftClick({ onStting, onQuit }: { onStting: () => void; onQuit: () => void }) {
    // 点击设置
    this.setter.addEventListener("click", onStting);
    // 点击退出
    this.quit.addEventListener("click", onQuit);
  }
  /**
   * 设置用户信息
   */
  public setUserInfo(userInfo: UserInfo) {
    this.userName.innerText = userInfo.nickName;
    if (userInfo.avatar) {
      // 如果头像类型是图片
      if (userInfo.avatarType === "image") {
        const avatar = createElement({ name: "img" }) as HTMLImageElement;
        avatar.setAttribute("src", userInfo.avatar)
        this.userIcons.appendChild(avatar)
      } else {
        // 负责按SVG处理
        this.userIcons.innerHTML = userInfo.avatar
      }
    }

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
  public queryInput = createElement({ name: "queryInput", class: "windows10-taskbar-query-input" });
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
    this.__queryStatus = "show"
  }

  private get __queryStatus() {
    return this.queryStatus
  }

  private set __queryStatus(v) {
    if (!v || ["show", "none"].indexOf(v) === -1) {
      v = "show"
    }
    this.queryStatus = v
    switch (v) {
      case "show":
        this.queryBox.classList.add("show")
        break;
      default:
        this.queryBox.classList.remove("show")
        break;
    }
  }


  /** 设置搜索框显示状态 */
  public setQueryStatus(status: QueryStatus) {
    if (this.__queryStatus !== status) {
      this.__queryStatus = status;
    }
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
}









/** 任务栏元素 */
export default class TaskbarEls {
  /** 设置任务栏APP置顶高亮的防抖定时器 */
  private setAppTopTime = 0;
  /** 任务栏盒子 */
  public box = createElement("windows10-taskbar");
  /** WIN键 */
  public win = new TaskbarWinEls();
  /** 任务区域 */
  public appList = new TaskbarAppListEls();

  /** 时间 */
  public taskbarTime = new TaskbarTimeEls();
  /** 消息 */
  public taskbarMessage = new TaskbarMsgEls();

  /** 打开是应用列表 */
  private openAppList: Win[] = []
  /** 打开的APP图标Map */
  private appIconMap: { [key: string]: HTMLElement } = {};
  /** 监听函数MAP */
  private methods: { [Key: string]: () => void } = {
    clickSetting: () => true,
  };
  constructor() {
    this.box.appendChild(this.win.winBox);
    this.box.appendChild(this.appList.appListBox);
    this.box.appendChild(this.taskbarTime.timeBox);
    this.box.appendChild(this.taskbarMessage.messageBox);
    this.setMenu()
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
          this.methods.clickSetting()
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
   * 监听点击设置
   */
  onClickSetting(fn: () => void) {
    this.methods["clickSetting"] = fn;
    return this;
  }
}
