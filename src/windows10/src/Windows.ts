import createElement from "new-dream/src/utils/createElement";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import "new-dream/dist/index.css";
import { Win } from "new-dream";
import { TtaskbarTheme, Direaction, QueryStatus, DesktopBackground } from "./types/style.d";
import { OptionsCallback, Methods, WindowsOptions, OptionsData, GlobalTask, UserInfo } from "./types/windows.d";
import { userIcon } from "./svg";


const defaultOptions: WindowsOptions = {
  userInfo: {
    nickName: "小妖",
    avatar: userIcon,
    avatarType: "svg"
  },
  taskbar: {
    theme: { backgroundColor: "#444444", color: "#FFFFFF" },
    direaction: "bottom",
    queryStatus: "show"
  },
  desktop: {
    theme: {
      background: {
        type: "color",
        backgroundColor: "#808080",
      },
      color: "#ffffff",
      fontSize: "14px",
    },
  },
}
// 全局任务对象
const globalTask: GlobalTask = {
  TaskChangeCallback: () => true,
  OptionsChangeTime: 0
}


class Windows {
  public options: WindowsOptions = defaultOptions;
  private box: HTMLElement; // 盒子
  private desktop: Desktop; // 桌面
  private taskbar: Taskbar; // 任务栏
  private direaction?: Direaction; // 任务栏所在方向
  private methods: Methods = {};

  constructor(options?: WindowsOptions) {
    this.__options = options ? options : defaultOptions;
    this.box = createElement("windows10-app");
    this.desktop = new Desktop(this.box);
    this.taskbar = new Taskbar(this.box, this.__options.taskbar.direaction);
    document.body.appendChild(this.box);
    this.__init__();
  }
  private get __options() {
    return this.options
  }
  private set __options(v) {
    // 用户信息
    if (!v.userInfo.nickName) v.userInfo.nickName = defaultOptions.userInfo.nickName;
    if (!v.userInfo.avatar) v.userInfo.avatar = defaultOptions.userInfo.avatar;
    if (!v.userInfo.avatarType) v.userInfo.avatar = defaultOptions.userInfo.avatar;
    // 任务栏配置项
    if (!v.taskbar.theme) v.taskbar.theme = defaultOptions.taskbar.theme;
    if (!v.taskbar.direaction) v.taskbar.direaction = defaultOptions.taskbar.direaction;
    if (!v.taskbar.queryStatus) v.taskbar.queryStatus = defaultOptions.taskbar.queryStatus;
    this.options = v
  }

  private get __direaction() {
    return this.direaction
  }

  private set __direaction(v) {
    if (!v || ["top", "bottom"].indexOf(v) == -1) {
      v = "bottom"
    }
    switch (v) {
      case "top":
        this.box.classList.add("top");
        this.box.classList.remove("bottom");
        break;
      default:
        this.box.classList.add("bottom");
        this.box.classList.remove("top");
        break;
    }
    this.direaction = v
  }



  private __init__() {
    Win.showMiniList = false; // 隐藏最小化列表
    // 设置用户信息
    this.setUserInfo(this.__options.userInfo)
      // 设置任务栏方向
      .setTaskbarDireaction(this.__options.taskbar.direaction)
      // 设置任务栏主题
      .setTaskbarTheme(this.__options.taskbar.theme)
      // 设置任务栏搜索框状态
      .setTaskbarQuery(this.__options.taskbar.queryStatus)
      // 设置背景
      .setDesktopBackground(this.__options.desktop.theme.background)

    /**
     * 监听应用启动和关闭
     */
    this.__on_app_change__();
    /**
     * 监听配置项变化
     */
    this.__on_option_change__()
  }
  /**
   * 监听应用启动/关闭
   */
  private __on_app_change__() {
    const p: { [key: string | symbol]: Win } = {}
    Win.WinIdMap = new Proxy(p, {
      // 监听打开
      set: (target, key, app: Win) => {
        target[key] = app;
        if (globalTask.TaskChangeCallback) globalTask.TaskChangeCallback(target); // 通知监听函数
        // 通知任务栏
        this.taskbar.setOpenApp(app);
        return true
      },
      // 监听关闭
      deleteProperty: (target, key) => {
        delete target[key];
        if (globalTask.TaskChangeCallback) globalTask.TaskChangeCallback(target); // 通知监听函数
        // 通知任务栏
        this.taskbar.setCloseApp(key as string);
        return true
      }
    })
  }
  /**
   * 监听配置项改变
   */
  private __on_option_change__() {
    const changeCallback = this.__option_change_callback__()
    this.taskbar.onOptionChange(changeCallback); // 监听任务栏 改变 配置项
    this.desktop.onOptionChange(changeCallback); // 监听桌面 改变 配置项
  }
  /**
   * 配置项改变触发的回调函数
   */
  private __option_change_callback__() {
    // 包一层箭头函数，避免传递过去调用时导致this发生变化
    return (data: OptionsData) => {
      // 设置防抖
      clearTimeout(globalTask.OptionsChangeTime)
      globalTask.OptionsChangeTime = setTimeout(() => {
        // 任务栏主题改变
        if (data.taskbar && data.taskbar.theme) {
          this.setTaskbarTheme(data.taskbar.theme)
        }
        // 方向
        if (data.taskbar && data.taskbar.direaction) {
          this.setTaskbarDireaction(data.taskbar.direaction)
        }
        if (data.taskbar && data.taskbar.queryStatus) {
          this.setTaskbarQuery(data.taskbar.queryStatus)
        }
        // 如果有用户监听，则向用户发送消息
        if (this.methods && this.methods.onOptionChange) {
          this.methods.onOptionChange(data)
        }
      }, 50)
    }
  }






  /**
   * 设置用户信息
   */
  public setUserInfo(userInfo: UserInfo) {
    this.taskbar.setUserInfo(userInfo)
    return this
  }

  /**
   * 设置任务栏方向
   */
  public setTaskbarDireaction(direaction: Direaction) {
    this.__direaction = direaction;
    return this
  }

  /**
   * 设置任务栏主题
   */
  public setTaskbarTheme(theme: TtaskbarTheme) {
    this.taskbar.setTheme(theme)
    return this
  }
  /**
   * 设置任务栏搜索框
   */
  public setTaskbarQuery(display: QueryStatus) {
    this.taskbar.setQueryShow(display)
    return this
  }

  /**
   * 桌面背景
   */
  public setDesktopBackground(background: DesktopBackground) {
    this.desktop.setBackground(background);
    return this
  }







  /**
   * 监听配置项发送变化
   */
  public onOptionChange(fn: OptionsCallback) {
    this.methods.onOptionChange = fn;
  }










  /**
   * 监听任务变化(应用打开/关闭)
   */
  static onTask(fn: (data: { [key: string]: Win }) => void) {
    globalTask.TaskChangeCallback = fn
  }
}


export default Windows