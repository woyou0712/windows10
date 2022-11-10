import createElement from "new-dream/src/utils/createElement";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import "new-dream/dist/index.css";
import { Win } from "new-dream";
import { Theme, Direaction, SelectStatus } from "./types/style.d";
import { OptionsCallback, Methods, WindowsOptions, OptionsData } from "./types/windows.d";


const defaultOptions: WindowsOptions = {
  taskbar: {
    theme: { backgroundColor: "#444444", color: "#FFFFFF" },
    direaction: "bottom",
    selectStatus: "show"
  }
}
// 任务变化监听回调函数（请勿直接访问）
let TaskChangeCallback: (data: { [key: string]: Win }) => void = () => true

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
    if (!v.taskbar.theme) v.taskbar.theme = defaultOptions.taskbar.theme;
    if (!v.taskbar.direaction) v.taskbar.direaction = defaultOptions.taskbar.direaction;
    if (!v.taskbar.selectStatus) v.taskbar.selectStatus = defaultOptions.taskbar.selectStatus;
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
    // 设置任务栏方向
    this.setTaskbarDireaction(this.__options.taskbar.direaction);
    // 设置任务栏主题
    this.setTaskbarTheme(this.__options.taskbar.theme);
    // 设置任务栏搜索框状态
    this.setTaskbarSelect(this.__options.taskbar.selectStatus);
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
        if (TaskChangeCallback) TaskChangeCallback(target); // 通知监听函数
        // 通知任务栏
        this.taskbar.setOpenApp(app);
        return true
      },
      // 监听关闭
      deleteProperty: (target, key) => {
        delete target[key];
        if (TaskChangeCallback) TaskChangeCallback(target); // 通知监听函数
        // 通知任务栏
        this.taskbar.setCloseApp(key as string);
        return true
      }
    })
  }
  /**
   * 设置监听配置项改变
   */
  private __on_option_change__() {
    this.taskbar.onOptionChange(this.__option_change_callback__()); // 监听任务栏配置项改变
  }
  /**
   * 监听配置项改变的回调函数
   */
  private __option_change_callback__() {
    // 包一层箭头函数，避免传递过去调用时导致this发生变化
    return (data: OptionsData) => {
      // 任务栏主题改变
      if (data.taskbar && data.taskbar.theme) {
        this.setTaskbarTheme(data.taskbar.theme)
      }
      // 方向
      if (data.taskbar && data.taskbar.direaction) {
        this.setTaskbarDireaction(data.taskbar.direaction)
      }
      if (data.taskbar && data.taskbar.selectStatus) {
        this.setTaskbarSelect(data.taskbar.selectStatus)
      }
      // 如果有用户监听，则向用户发送消息
      if (this.methods && this.methods.onOptionChange) {
        this.methods.onOptionChange(data)
      }
    }
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
  public setTaskbarTheme(theme: Theme) {
    this.taskbar.setTheme(theme)
    return this
  }
  /**
   * 设置任务栏搜索框
   */
  public setTaskbarSelect(display: SelectStatus) {
    this.taskbar.setSelectShow(display)
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
    TaskChangeCallback = fn
  }
}


export default Windows