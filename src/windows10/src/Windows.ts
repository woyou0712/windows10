import createElement from "new-dream/src/utils/createElement";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import "new-dream/dist/index.css";
import { Win } from "new-dream";
type Direaction = "top" | "bottom";




class Windows {
  static methods: { [key: string]: (data?: any) => void } = {}

  private box: HTMLElement; // 盒子
  private desktop: Desktop; // 桌面
  private taskbar: Taskbar; // 任务栏
  private direaction?: Direaction; // 任务栏所在方向
  constructor() {
    this.box = createElement("windows10-app");
    this.desktop = new Desktop(this.box);
    this.taskbar = new Taskbar(this.box);
    this.__direaction = "bottom"; // 任务栏默认在下方
    document.body.appendChild(this.box);
    this.__init__();
  }

  private get __direaction() {
    return this.direaction
  }

  private set __direaction(v) {
    this.direaction = v
    switch (v) {
      case "top":
        this.box.classList.add("top");
        this.box.classList.remove("right");
        this.box.classList.remove("bottom");
        this.box.classList.remove("left");
        break;
      default:
        this.box.classList.add("bottom");
        this.box.classList.remove("top");
        this.box.classList.remove("right");
        this.box.classList.remove("left");
        break;
    }
  }

  private __init__() {
    // 监听应用打开
    const p: { [key: string | symbol]: Win } = {}
    Win.WinIdMap = new Proxy(p, {
      get(target, key) {
        return target[key]
      },
      set(target, key, app: Win) {
        target[key] = app
        if (Windows.methods.onOpenApp) Windows.methods.onOpenApp(target)
        return true
      }
    })

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
  public setTaskbarTheme({ backgroundColor, color }: { backgroundColor: string; color: string }) {
    let style = document.getElementById("style-taskbar-theme")
    if (!style) {
      style = createElement({ name: "style", id: "style-taskbar-theme" });
      document.head.appendChild(style);
    }
    style.innerHTML = `
      :root{
        --taskbarBg: ${backgroundColor} !important;
        --taskbarColor: ${color} !important;
      }
    `;
    return this
  }

  /**
   * 监听应用打开
   */
  static onOpenApp(fn: (data: { [key: string]: Win }) => void) {
    Windows.methods.onOpenApp = fn
  }
}


export default Windows