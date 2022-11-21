import { Win } from "new-dream";
import { DesktopOption, SettingPageType, TaskbarOption, UserInfo, WindowsOption } from "../types/windows.d";
import { Direaction } from "../types/style.d";
import SystemSetting from "../systemApps/SystemSetting/index.vue";
import createElement from "new-dream/src/utils/createElement";


export default class Option {
  /** windows盒子 */
  public windowsBox: HTMLElement;
  /** 配置项变更防抖定时器 */
  private optionsChangeTime = 0;
  /** 用户信息 */
  public userInfo: UserInfo;
  /** 任务栏配置项 */
  public taskbar: TaskbarOption;
  /** 桌面配置项 */
  public desktop: DesktopOption;

  private methods: {
    onChange: (option: Option) => void
  } = {
      onChange: () => true
    }

  constructor({ userInfo, taskbar, desktop }: WindowsOption) {
    this.windowsBox = createElement("windows10-app")
    this.userInfo = userInfo
    this.taskbar = taskbar
    this.desktop = desktop
  }

  private get __direaction() {
    return this.taskbar.direaction
  }

  private set __direaction(v) {
    if (!v || ["top", "bottom"].indexOf(v) == -1) {
      v = "bottom"
    }
    switch (v) {
      case "top":
        this.windowsBox.classList.add("top");
        this.windowsBox.classList.remove("bottom");
        break;
      default:
        this.windowsBox.classList.add("bottom");
        this.windowsBox.classList.remove("top");
        break;
    }
    this.taskbar.direaction = v
  }

  /**
   * 设置任务栏方向
   */
  public setTaskbarDireaction(direaction: Direaction) {
    this.__direaction = direaction;
    return this
  }

}