import createElement from "new-dream/src/utils/createElement";
import Desktop from "./components/Desktop";
import Taskbar from "./components/TaskbarEls";
import "new-dream/dist/index.css";
import { Win } from "new-dream";
import { TaskbarTheme, Direaction, QueryStatus, DesktopBackground } from "./types/style.d";
import { OptionsCallback, Methods, WindowsOption, UserInfo, SettingPageType } from "./types/windows.d";
import { defaultOptions } from "./systemData";
import SystemSetting from "./systemApps/SystemSetting/index.vue";
import WindowsEls from "./components/WindowsEls";
import Option from "./components/Option";


class Windows {
  /** 监听任务变化(应用打开/关闭)   */
  static onTask: (data: { [key: string]: Win }) => void = () => null;
  public option: Option
  private els: WindowsEls;
  constructor(option?: WindowsOption) {
    this.option = option ? new Option(option) : new Option(defaultOptions);
    this.els = new WindowsEls();
    this.onAppChange();
  }

  /**
   * 监听应用启动/关闭
   */
  private onAppChange() {
    const p: { [key: string | symbol]: Win } = {}
    // 代理Win窗口MAP对象
    Win.WinIdMap = new Proxy(p, {
      // 监听打开
      set: (target, key, app: Win) => {
        target[key] = app;
        Windows.onTask(target); // 通知监听函数
        // 通知任务栏
        this.els.pushTaskbarOpenApp(app);
        return true
      },
      // 监听关闭
      deleteProperty: (target, key) => {
        delete target[key];
        Windows.onTask(target); // 通知监听函数
        // 通知任务栏
        this.els.pushTaskbarCloseApp(key as string);
        return true
      }
    })
  }
}

export default Windows