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




  public setOption({ userInfo, taskbar, desktop }: WindowsOption) {
    this.userInfo = userInfo
    this.taskbar = taskbar
    this.desktop = desktop
  }


  /**
   * 打开设置
   * @param pageType 默认显示页面
   */
  public showSetting(pageType: SettingPageType = "default") {
    SystemSetting
    new Win({
      component: SystemSetting,
      props: {
        pageType,
        option: this,
        optionChange: (option: Option) => {
          // 设置配置项
          this.setOption(option)
        }
      }
    })
  }

  /**
 * 配置项改变触发的回调函数
 */
  private setOptions(option: WindowsOption) {
    // 设置防抖
    clearTimeout(this.optionsChangeTime)
    this.optionsChangeTime = setTimeout(() => {
      // 像监听函数发送通知
      this.methods.onChange(this)
    }, 50)
    return this
  }




}