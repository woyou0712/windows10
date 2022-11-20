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
  public option: Option
  private els: WindowsEls;
  constructor(option?: WindowsOption) {
    this.option = option ? new Option(option) : new Option(defaultOptions);
    this.els = new WindowsEls();
  }
}

export default Windows