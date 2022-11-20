import createElement from "new-dream/src/utils/createElement";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import "new-dream/dist/index.css";
import { Win } from "new-dream";
import { TaskbarTheme, Direaction, QueryStatus, DesktopBackground } from "./types/style.d";
import { OptionsCallback, Methods, WindowsOption, UserInfo, SettingPageType } from "./types/windows.d";
import { defaultOptions } from "./systemData";
import SystemSetting from "./systemApps/SystemSetting/index.vue";
import WindowsEls from "./components/WindowsEls";


class Windows {
  /** 监听任务变化(应用打开/关闭)   */
  static onTask: (data: { [key: string]: Win }) => void = () => null;

  public options: WindowsOption = defaultOptions;
  private box: HTMLElement; // 盒子
  private desktop: Desktop; // 桌面
  private taskbar: Taskbar; // 任务栏
  private direaction?: Direaction; // 任务栏所在方向
  private methods: Methods = {};
  private OptionsChangeTime = 0;

  constructor(options?: WindowsOption) {
    this.__options = options ? options : defaultOptions;
    this.box = createElement("windows10-app");
    this.desktop = new Desktop(this.box);
    this.taskbar = new Taskbar(this.box);
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
    /** 设置用户信息 */
    this.setUserInfo(this.__options.userInfo)
      /** 设置任务栏方向 */
      .setTaskbarDireaction(this.__options.taskbar.direaction)
      /** 设置任务栏主题 */
      .setTaskbarTheme(this.__options.taskbar.theme)
      /** 设置任务栏搜索框状态 */
      .setTaskbarQuery(this.__options.taskbar.queryStatus)
      /** 设置背景 */
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
    // 代理Win窗口MAP对象
    Win.WinIdMap = new Proxy(p, {
      // 监听打开
      set: (target, key, app: Win) => {
        target[key] = app;
        Windows.onTask(target); // 通知监听函数
        // 通知任务栏
        this.taskbar.setOpenApp(app);
        return true
      },
      // 监听关闭
      deleteProperty: (target, key) => {
        delete target[key];
        Windows.onTask(target); // 通知监听函数
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
    /** 监听搜索框显示切换 */
    this.taskbar.onQueryStatusChange((queryStatus: QueryStatus) => {
      this.__options.taskbar.queryStatus = queryStatus;
      this.__option_change_callback__(this.__options);
    })
      /** 设置【打开设置】方法 */
      .setShowSetting((pageType: SettingPageType) => {
        this.showSetting(pageType);
      })

  }
  /**
   * 配置项改变触发的回调函数
   */
  private __option_change_callback__(options: WindowsOption) {
    // 设置防抖
    clearTimeout(this.OptionsChangeTime)
    this.OptionsChangeTime = setTimeout(() => {
      // 任务栏主题改变
      this.setTaskbarTheme(options.taskbar.theme)
      // 任务栏方向
      this.setTaskbarDireaction(options.taskbar.direaction)
      // 任务栏搜索框
      this.setTaskbarQuery(options.taskbar.queryStatus)
      // 桌面主题


      // 如果有用户监听，则向用户发送消息
      if (this.methods && this.methods.onOptionChange) {
        this.methods.onOptionChange(options)
      }
    }, 50)

  }

  /**
   * 打开设置
   * @param pageType 默认显示页面
   */
  private showSetting(pageType: SettingPageType = "default") {
    new Win({
      component: SystemSetting,
      props: {
        pageType,
        option: this.__options,
        optionChange: (option: WindowsOption) => {
          this.__option_change_callback__(option)
        }
      }
    })
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
  public setTaskbarTheme(theme: TaskbarTheme) {
    this.taskbar.setTheme(theme)
    return this
  }
  /**
   * 设置任务栏搜索框
   */
  public setTaskbarQuery(queryStatus: QueryStatus) {
    this.taskbar.setQueryShow(queryStatus)
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











}

export default Windows